import {
    mapToMap,
    isFalsyString,
} from '@togglecorp/fujs';
import {resolve as resolveUrl} from 'url';
import { api } from '#config';

import { ContextInterface } from './context';

export interface ErrorFromServer {
    errorCode?: number;
    errors: {
        // NOTE: it is most probably only string[]
        [key: string]: string[] | string;
    };
}
export interface Error {
    reason: string;
    // exception: any;
    value: {
        formErrors: {
            [key: string]: string | undefined;
        },
        messageForNotification: string,
        errors?: ErrorFromServer['errors'];
    };
    errorCode: number | undefined;
}


function alterResponse(errors: ErrorFromServer['errors']): Error['value']['formErrors'] {
    const otherErrors = mapToMap(
        errors,
        item => item,
        item => (Array.isArray(item) ? item.join(' ') : item),
    );
    return otherErrors;
}

interface OptionBase {
    schemaName?: string;
}

type GoContextInterface = ContextInterface<
    // eslint-disable-next-line @typescript-eslint/ban-types
    object,
    ErrorFromServer,
    Error,
    OptionBase
>;

export const processGoUrls: GoContextInterface['transformUrl'] = (url) => (
    isFalsyString(url) ? '' : /http/.test(url) ? url: resolveUrl(api, url)
);

export const processGoOptions = (token: string | undefined) => {
    const callback: GoContextInterface['transformOptions'] = (
        url,
        options,
    ) => {
        const {
            body,
            headers,
            ...otherOptions
        } = options;

        return {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: token
                    ? `Token ${token}`
                    : '',
                ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
            ...otherOptions,
        };
    };
    return callback;
};

export const processGoResponse: GoContextInterface['transformBody'] = async (
    res,
    url,
    options,
) => {
    const resText = await res.text();
    if (resText.length > 0) {
        const json = JSON.parse(resText);
        return json;
    }
    return undefined;
};

export const processGoError: GoContextInterface['transformError'] = (res) => {
    if (res === 'network') {
        return {
            reason: 'network',
            // exception: e,
            value: {
                messageForNotification: 'Network error',
                formErrors: {
                    $internal: 'Network error',
                },
            },
            errorCode: undefined,
        };
    }
    if (res === 'parse') {
        return {
            reason: 'parse',
            // exception: e,
            value: {
                messageForNotification: 'Response parse error',
                formErrors: {
                    $internal: 'Response parse error',
                },
            },
            errorCode: undefined,
        };
    }

    const formErrors = alterResponse(res.errors);

    const messageForNotification = (
        formErrors?.$internal
        ?? 'Some error occurred while performing this action.'
    );

    const requestError = {
        formErrors,
        messageForNotification,
        errors: res.errors,
    };

    return {
        reason: 'server',
        value: requestError,
        errorCode: res.errorCode,
    };
};

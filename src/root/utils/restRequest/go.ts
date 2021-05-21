import {
    mapToMap,
    isFalsyString,
} from '@togglecorp/fujs';
import {resolve as resolveUrl} from 'url';
import { get as getFromLocalStorage } from 'local-storage';
import { api } from '#config';

import { ContextInterface } from './context';

const CONTENT_TYPE_JSON = 'application/json';
const CONTENT_TYPE_CSV = 'text/csv';

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

export interface OptionBase {
    isCsvRequest?: boolean;
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

export const processGoOptions: GoContextInterface['transformOptions'] = (
    url,
    options,
    requestOptions,
) => {
    const {
        body,
        headers,
        ...otherOptions
    } = options;

    const {
        isCsvRequest,
    } = requestOptions;

    const user = getFromLocalStorage('user');
    const token = Date.parse(user?.expires) > Date.now()
        ? user?.token
        : undefined;

    return {
        method: 'GET',
        headers: {
            Accept: isCsvRequest ? CONTENT_TYPE_CSV : CONTENT_TYPE_JSON,
            'Content-Type': isCsvRequest
                ? 'text/csv; charset=utf-8' : 'application/json; charset=utf-8',
            Authorization: token ? `Token ${token}` : '',
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        ...otherOptions,
    };
};

export const processGoResponse: GoContextInterface['transformResponse'] = async (
    res,
) => {
    const resText = await res.text();
    if (resText.length < 1) {
        return undefined;
    }
    if (res.headers.get('content-type') === CONTENT_TYPE_JSON) {
        const json = JSON.parse(resText);
        return json;
    }

    return resText;
};

export const processGoError: GoContextInterface['transformError'] = (res, url, options) => {
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
    const {
        method,
    } = options;

    const formErrors = alterResponse(res.errors);
    const finalMessage = method === 'GET'
        ? 'Failed to load data'
        : 'Some error occurred while performing this action.';

    const messageForNotification = formErrors?.$internal ?? finalMessage;

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

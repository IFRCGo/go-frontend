import {
  mapToMap,
  isFalsyString,
} from '@togglecorp/fujs';
import {resolve as resolveUrl} from 'url';
import { get as getFromLocalStorage } from 'local-storage';
import { api } from '#config';
import store from '#utils/store';

import { ContextInterface } from './context';

const CONTENT_TYPE_JSON = 'application/json';
const CONTENT_TYPE_CSV = 'text/csv';

export interface ErrorFromServer {
  errorCode?: number;
  errors?: {
    // NOTE: it is most probably only string[]
    [key: string]: string[] | string;
  };
  detail?: string;
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
  debugMessage: string;
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
  enforceEnglish?: boolean;
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
  requestOptions,
  extraOptions,
) => {
  const {
    body,
    headers,
    method = 'GET',
    ...otherOptions
  } = requestOptions;

  const {
    isCsvRequest,
    enforceEnglish,
  } = extraOptions;

  const user = getFromLocalStorage('user');
  const currentLanguage = store.getState().lang.current;
  const token = Date.parse(user?.expires) > Date.now()
    ? user?.token
    : undefined;

    return {
      method,
      headers: {
        Accept: isCsvRequest ? CONTENT_TYPE_CSV : CONTENT_TYPE_JSON,
        'Content-Type': isCsvRequest
          ? 'text/csv; charset=utf-8'
          : 'application/json; charset=utf-8',
        Authorization: token ? `Token ${token}` : '',
        'Accept-Language': (enforceEnglish || method !== 'GET') ? 'en': currentLanguage,
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

export const processGoError: GoContextInterface['transformError'] = async (
  reason,
  url,
  requestOptions,
  extraOptions,
  responseBody,
  response,
) => {
  const responseText = await response?.text();

  if (reason === 'network') {
    return {
      reason: 'network',
      value: {
        messageForNotification: 'Cannot communicate with the server! Please, make sure you have an active internet connection and try again!',
        formErrors: {
          $internal: 'Network error',
        },
      },
      errorCode: undefined,
      debugMessage: JSON.stringify({
        url,
        status: response?.status,
        requestOptions,
        error: 'Network error',
      }),
    };
  }


  if (reason === 'parse') {
    return {
      reason: 'parse',
      value: {
        messageForNotification: 'There was a problem parsing the response from server',
        formErrors: {
          $internal: 'Response parse error',
        },
      },
      errorCode: undefined,
      debugMessage: JSON.stringify({
        url,
        status: response?.status,
        requestOptions,
        error: 'Response parse error',
        responseText: responseText,
      }),
    };
  }

  const { method } = requestOptions;
  const formErrors = alterResponse(responseBody?.errors);

  let finalMessage = method === 'GET'
    ? 'Failed to load data'
    : 'Some error occurred while performing this action.';

  let messageForNotification = formErrors?.$internal ?? responseBody?.detail ?? finalMessage;

  if (method === 'POST' && response?.status === 401) {
    messageForNotification = 'You do not have enough permission to perform this action';
  }

  return {
    reason: 'server',
    value: {
      formErrors,
      messageForNotification,
      errors: responseBody?.errors,
    },
    errorCode: response?.status,
    debugMessage: JSON.stringify({
      url,
      status: response?.status,
      requestOptions,
      error: 'Request rejected by the server',
      responseText: responseText,
    }),
  };
};

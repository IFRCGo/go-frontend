import {
  isDefined,
  mapToMap,
  isFalsyString,
} from '@togglecorp/fujs';
import { resolve as resolveUrl } from 'url';
import { get as getFromLocalStorage } from 'local-storage';
import { api } from '#config';

import store from '#utils/store';
import { isObject } from '#utils/common';

import { ContextInterface } from './context';

const CONTENT_TYPE_JSON = 'application/json';
const CONTENT_TYPE_CSV = 'text/csv';

export type ErrorFromServer = {
  errorCode?: number;
  errors?: {
    // NOTE: it is most probably only string[]
    [key: string]: string[] | string;
  };
  detail?: string;
} | {
  [key: string]: string[];
}

export interface Error {
  reason: 'network' | 'parse' | 'server';
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


function alterResponse(response: ErrorFromServer | undefined): Error['value']['formErrors'] {
  let errors = {};
  if (!response) {
    return errors;
  }

  if (!isObject(response) || !response.errors) {
    return errors;
  }

  return mapToMap(
    (response?.errors) as Record<string, string>,
    item => item,
    item => (Array.isArray(item) ? item.join(' ') : item),
  );
}

export interface OptionBase {
  formData?: boolean;
  isCsvRequest?: boolean;
  enforceEnglish?: boolean;
}

type GoContextInterface = ContextInterface<
  object,
  ErrorFromServer,
  Error,
  OptionBase
>;

export const processGoUrls: GoContextInterface['transformUrl'] = (url) => (
  isFalsyString(url) ? '' : /http/.test(url) ? url : resolveUrl(api, url)
);
type Literal = string | number | boolean | File;

type FormDataCompatibleObj = Record<string, Literal | Literal[] | null | undefined>;

function getFormData(jsonData: FormDataCompatibleObj) {
  const formData = new FormData();
  Object.keys(jsonData || {}).forEach(
    (key) => {
      const value = jsonData?.[key];
      if (value && Array.isArray(value)) {
        value.forEach((v) => {
          formData.append(key, v instanceof Blob ? v : String(v));
        });
      } else if (isDefined(value)) {
        formData.append(key, value instanceof Blob ? value : String(value));
      } else {
        formData.append(key, '');
      }
    },
  );
  return formData;
}

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
    formData,
    isCsvRequest,
    enforceEnglish,
  } = extraOptions;

  const user = getFromLocalStorage('user');
  const currentLanguage = store.getState().lang.current;
  const token = Date.parse(user?.expires) > Date.now()
    ? user?.token
    : undefined;
  
  const defaultHeaders = {
    Authorization: token ? `Token ${token}` : '',
    'Accept-Language': (enforceEnglish || method !== 'GET') ? 'en' : currentLanguage,
  };

  if (formData) {
    const requestBody = getFormData(body as FormDataCompatibleObj);
    return {
      method,
      headers: {
        Accept: 'application/json',
          ...defaultHeaders,
        ...headers,
      },
      body: requestBody,
      ...otherOptions,
    };
  }

  const requestBody = body ? JSON.stringify(body) : undefined;
  return {
    method,
    headers: {
      Accept: isCsvRequest ? CONTENT_TYPE_CSV : CONTENT_TYPE_JSON,
      'Content-Type': isCsvRequest
        ? 'text/csv; charset=utf-8'
        : 'application/json; charset=utf-8',
      ...defaultHeaders,
      ...headers,
    },
    body: requestBody,
    ...otherOptions,
  };
};

export const processGoResponse: GoContextInterface['transformResponse'] = async (
  res,
) => {
  const resText = await res.text();

  return new Promise((resolve) => {
    if (resText.length < 1) {
      resolve(undefined);
    }
    if (res.headers.get('content-type') === CONTENT_TYPE_JSON) {
      const json = JSON.parse(resText);
      resolve(json);
    }

    return resolve(resText);
  });
};

export const processGoError: GoContextInterface['transformError2'] = async (
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
  const formErrors = alterResponse(responseBody);

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
      errors: responseBody?.errors ?? responseBody,
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

import {
  isDefined,
  mapToMap,
  isFalsyString,
} from '@togglecorp/fujs';
import { resolve as resolveUrl } from 'url';
import { get as getFromLocalStorage } from 'local-storage';
import { ContextInterface } from '@togglecorp/toggle-request';

import { api } from '#config';
import store from '#utils/store';
import { isObject } from '#utils/common';

const CONTENT_TYPE_JSON = 'application/json';
const CONTENT_TYPE_CSV = 'text/csv';

export type ResponseError = {
  status: number;
  originalReponse: Response,
  responseText: string;
}

export interface TransformedError {
  value: {
    formErrors: {
      [key: string]: string | undefined;
    },
    messageForNotification: string,
  };
  status: number | undefined;
  debugMessage: string;
}

export interface AdditionalOptions {
  formData?: boolean;
  isCsvRequest?: boolean;
  enforceEnglish?: boolean;
}


function transformError(response: ResponseError): TransformedError['value']['formErrors'] {
  const {
    originalReponse,
    responseText,
  } = response;

  let errors = {};
  if (!response) {
    return errors;
  }

  if (originalReponse.headers.get('content-type') === CONTENT_TYPE_JSON) {
    try {
      const json = JSON.parse(responseText);

      if (Array.isArray(json)) {
        return { $internal: json.join(', ') };
      }

      if (isObject(json)) {
        const errorMap = mapToMap(
          (json) as Record<string, string>,
          item => item,
          item => (Array.isArray(item) ? item.join(' ') : item),
        );

        return errorMap;
      }

      return { $internal: 'Response content type mismatch' };
    } catch(e) {
      return { $internal: responseText };
    }
  }

  return { $internal: responseText };
}

type GoContextInterface = ContextInterface<
  unknown,
  ResponseError,
  TransformedError,
  AdditionalOptions
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
  const resClone = res.clone();
  const resText = await res.text();

  if (String(res.status)[0] === '2') {
    if (res.headers.get('content-type') === CONTENT_TYPE_JSON) {
      const json = JSON.parse(resText);
      return json;
    }

    return resText;
  }

  const serverError: ResponseError = {
    status: res.status,
    originalReponse: resClone,
    responseText: resText,
  };

  return serverError;
};

export const processGoError: GoContextInterface['transformError'] = (
  responseError,
  url,
  requestOptions,
  extraOptions,
) => {
  if (responseError === 'network') {
    return {
      reason: 'network',
      value: {
        messageForNotification: 'Cannot communicate with the server! Please, make sure you have an active internet connection and try again!',
        formErrors: {
          $internal: 'Network error',
        },
      },
      status: undefined,
      debugMessage: JSON.stringify({
        url,
        status: undefined,
        requestOptions,
        error: 'Network error',
      }),
    };
  }

  if (responseError === 'parse') {
    return {
      reason: 'parse',
      value: {
        messageForNotification: 'There was a problem parsing the response from server',
        formErrors: {
          $internal: 'Response parse error',
        },
      },
      status: undefined,
      debugMessage: JSON.stringify({
        url,
        status: undefined,
        requestOptions,
        error: 'Response parse error',
      }),
    };
  }

  const { method } = requestOptions;
  const formErrors = transformError(responseError);

  let finalMessage = method === 'GET'
    ? 'Failed to load data'
    : 'Some error occurred while performing this action.';

  let messageForNotification = formErrors?.$internal ?? finalMessage;

  if (method === 'POST' && responseError?.status === 401) {
    messageForNotification = 'You do not have enough permission to perform this action';
  }

  return {
    reason: 'server',
    value: {
      formErrors,
      messageForNotification,
      errorText: responseError.responseText,
    },
    status: responseError?.status,
    debugMessage: JSON.stringify({
      url,
      status: responseError?.status,
      requestOptions,
      error: 'Request rejected by the server',
      responseText: responseError.responseText,
    }),
 };
};

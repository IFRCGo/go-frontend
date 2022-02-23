import { resolve as resolveUrl } from 'url';
import { get as getFromLocalStorage } from 'local-storage';
import {
  isDefined,
  isFalsyString,
} from '@togglecorp/fujs';
import { ContextInterface } from '@togglecorp/toggle-request';
import { internal } from '@togglecorp/toggle-form';

import {
  riskApi,
  api,
} from '#config';
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
    formErrors: Record<string, unknown> & { [internal]: string },
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


function transformError(response: ResponseError, fallbackMessage: string): TransformedError['value']['formErrors'] {
  const {
    originalReponse,
    responseText,
  } = response;

  if (!response) {
      return { [internal]: 'Empty error response from server' };
  }
  if (originalReponse.headers.get('content-type') === CONTENT_TYPE_JSON) {
    try {
      const json = JSON.parse(responseText);
      if (isObject(json)) {
        // NOTE: this case may not occur
        return {
          [internal]: fallbackMessage,
          ...json,
        };
      }
      // FIXME: rename error message
      return { [internal]: 'Response content type mismatch' };
    } catch(e) {
      return { [internal]: responseText };
    }
  }

  return { [internal]: responseText };
}

type GoContextInterface = ContextInterface<
  unknown,
  ResponseError,
  TransformedError,
  AdditionalOptions
>;

const riskPrefix = 'risk://';
export const processGoUrls: GoContextInterface['transformUrl'] = (url) => {
  if (isFalsyString(url)) {
    return '';
  }

  if (url.startsWith(riskPrefix)) {
    const cleanedUrl = url.slice(riskPrefix.length - 1);
    return resolveUrl(riskApi, cleanedUrl);
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return resolveUrl(api, url);
};

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
          [internal]: 'Network error',
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
          [internal]: 'Response parse error',
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

  // default fallback message for GET
  let fallbackMessage = 'Failed to load data';

  if (method !== 'GET') {
    switch (responseError?.status) {
      case 401:
        fallbackMessage = 'You do not have enough permission to perform this action';
        break;
      case 413:
        fallbackMessage = 'Your request was refused because the payload was too large';
        break;
      default:
        fallbackMessage = 'Some error occurred while performing this action.';
        break;
    }
  }

  const formErrors = transformError(responseError, fallbackMessage);

  return {
    reason: 'server',
    value: {
      formErrors,
      messageForNotification: formErrors[internal],
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

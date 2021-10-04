import { createContext } from 'react';

export interface ContextInterface<R, RE, E, O> {
  transformUrl: (
    url: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    options: Omit<RequestInit, 'body'> & { body?: RequestInit['body'] | object | undefined },
    requestOptions: O,
  ) => string;
  transformOptions: (
    url: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    options: Omit<RequestInit, 'body'> & { body?: RequestInit['body'] | object | undefined },
    requestOptions: O,
  ) => RequestInit;
  transformResponse: (
    res: Response,
    url: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    options: Omit<RequestInit, 'body'> & { body?: RequestInit['body'] | object | undefined },
    requestOptions: O,
  ) => R | RE;
  transformError: (
    errorType: 'server' | 'parse' | 'network',
    url: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    options: Omit<RequestInit, 'body'> & { body?: RequestInit['body'] | object | undefined },
    requestOptions: O,
    responseBody: RE | undefined,
    response: Response | undefined,
  ) => E;
  transformError2: (
      reason: any,
      url: any,
      requestOptions: any,
      extraOptions: any,
      responseBody: any,
      response: any)
      => Promise<
      { reason: string;
        errorCode: undefined;
        debugMessage: string;
        value: { messageForNotification: string; formErrors: { $internal: string } } } |
      { reason: string;
        errorCode: number | undefined;
        debugMessage: string;
        value: { messageForNotification: string; formErrors: { [p: string]: string | undefined }; errors: { [p: string]: string[] | string } | undefined } }
      >
}

const defaultContext: ContextInterface<unknown, unknown, unknown, unknown> = {
  transformUrl: url => url,
  transformOptions: (url, { body, ...otherOptions }) => ({
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
    ...otherOptions,
  }),
  transformResponse: res => res,
  transformError: res => res,
  transformError2: res => res,
};

const RequestContext = createContext(defaultContext);
export default RequestContext;

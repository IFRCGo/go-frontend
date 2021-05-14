import React, { useState, useEffect, useRef, useCallback } from 'react';
import { get as getFromLocalStorage } from 'local-storage';
import csvParse from 'csv-parse/lib/sync';
import {resolve as resolveUrl} from 'url';
import {
  isFalsyString,
  isDefined,
} from '@togglecorp/fujs';
import AbortController from 'abort-controller';
import { api } from '#config';

export function buildUrl(url, queryParams={}) {
  const queryKeys = Object.keys(queryParams);

  if (queryKeys.length === 0) {
    return url;
  }

  const queryString = queryKeys.map((key) => (
    isDefined(queryParams[key]) ? `${key}=${queryParams[key]}` : ''
  )).join('&');

  return `${url}?${queryString}`;
}


export const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
};

// Type of RequestInit
export const defaultRequestOptions = {
  headers: { ...defaultHeaders },
};

export const csvRequestOptions = {
  headers: {
    Accept: 'text/csv',
    'Content-Type': 'text/csv; charset=utf-8',
  },
};

export const postRequestOptions = {
  method: 'POST',
  headers: { ...defaultHeaders },
};

export const defaultOtherOptions = {
  onSuccess: undefined,
  onFailure: undefined,
  lazy: false,
  preserveResponse: true,
  debug: false,
};

export const otherOptionsForPost = {
  ...defaultOtherOptions,
  lazy: true,
};

export function transformServerError(
  result,
  onErrorSet,
  fatalError = 'Some unknown error occured',
) {
  if (result.responseBody) {
    onErrorSet({
      fields: { ...result.responseBody }
    });
  } else if (result.responseText) {
    onErrorSet({
      $internal: result.responseText,
    });
  } else {
    onErrorSet({
      $internal: fatalError,
    });
  }
}

function withAuthToken(options = defaultRequestOptions) {
  const user = getFromLocalStorage('user');

  if (!user) {
    return options;
  }

  const isSessionExpired = Date.parse(user.expires) <= Date.now();
  if (isSessionExpired) {
    return options;
  }

  if (!options.headers) {
    options.headers = {};
  }

  options.headers['Authorization'] = `Token ${user.token}`;

  return options;
}

function useRequest(
  url,
  requestOptions = defaultRequestOptions,
  otherOptions,
) {
  const [response, setResponse] = useState();
  const [pending, setPending] = useState(!otherOptions?.lazy && !!url);

  const otherOptionsRef = React.useRef({
    ...defaultOtherOptions,
    ...otherOptions,
  });

  React.useEffect(() => {
    otherOptionsRef.current = {
      ...defaultOtherOptions,
      ...otherOptionsRef.current,
      ...otherOptions,
    };
  }, [otherOptions]);

  const clientIdRef = useRef(-1);
  const pendingSetByRef = useRef(-1);
  const responseSetByRef = useRef(-1);

  const setPendingSafe = useCallback((value, clientId) => {
    if (clientId >= pendingSetByRef.current) {
      pendingSetByRef.current = clientId;
      if (otherOptionsRef.current.debug) {
        console.debug('setting pending', value, 'by client', clientId);
      }
      setPending(value);
    }
  }, [setPending]);

  const setResponseSafe = useCallback(
    (value, clientId) => {
      if (clientId >= responseSetByRef.current) {
        responseSetByRef.current = clientId;
        if (otherOptionsRef.current.debug) {
          console.debug('setting response', value, 'by client', clientId);
        }
        setResponse(value);
      }
    },
    [],
  );

  const fullUrl = React.useMemo(() => (
    isFalsyString(url) ? '' : /http/.test(url) ? url: resolveUrl(api, url)
  ), [url]);

  const triggerRequest = React.useCallback(
    (requestUrl, options) => {
      if (isFalsyString(requestUrl)) {
        setResponseSafe(undefined, clientIdRef.current);
        setPendingSafe(false, clientIdRef.current);
        return () => {};
      }

      if (!otherOptionsRef.current.preserveResponse) {
        setResponseSafe(undefined, clientIdRef.current);
      }

      clientIdRef.current += 1;
      setPendingSafe(true, clientIdRef.current);
      const controller = new AbortController();

      async function fetchResource(
        fetchUrl,
        fetchOptions,
        clientId,
      ) {
        const { signal } = controller;

        let res;
        try {
          res = await fetch(fetchUrl, { ...fetchOptions, signal });
        } catch (e) {
          // console.error('Errored fetch', url);
          setPendingSafe(false, clientId);

          if (!signal.aborted) {
            console.error(`An error occured while fetching ${fetchUrl}`, e);
            setResponseSafe(undefined, clientId);
            const {
              current: {
                onFailure,
              }
            } = otherOptionsRef;

            if (onFailure) {
              onFailure({
                exception: e,
              });
            }
          } else {
            // console.info('Clearing response on network error');
          }
          return;
        }

        let resBody;
        const resText = await res.text();

        const {
          current: {
            onSuccess,
            onFailure,
          }
        } = otherOptionsRef;

        if (res.ok) {
          if (fetchOptions.headers['Accept'] === 'application/json') {
            if (resText.length > 0) {
              try {
                resBody = JSON.parse(resText);
              } catch(e) {
                setResponseSafe(undefined, clientId);
                setPendingSafe(false, clientId);
                console.error(`An error occured while parsing data from ${fetchUrl}`, e);
                return;
              }
            }
          } else {
            resBody = resText;
          }

          setResponseSafe(resBody, clientId);
          setPendingSafe(false, clientId);

          if (onSuccess) {
            onSuccess({
              responseBody: resBody,
              responseText: resText,
              response: res,
            });
          }
        } else {
          setPendingSafe(false, clientId);

          if (onFailure) {
            try {
              resBody = JSON.parse(resText);
            } catch(e) {
            }

            onFailure({
              responseBody: resBody,
              response: res,
              responseText: resText,
            });
          }
        }
      }

      fetchResource(requestUrl, withAuthToken(options), clientIdRef.current);

      return () => {
        controller.abort();
      };
    },
    [setPendingSafe, setResponseSafe],
  );

  useEffect(() => {
    if (!(otherOptionsRef.current.lazy)) {
      triggerRequest(fullUrl, requestOptions);
    }
  }, [fullUrl, requestOptions, triggerRequest]);

  const triggerManually = React.useCallback((options = requestOptions) => {
    triggerRequest(fullUrl, options);
  }, [fullUrl, requestOptions, triggerRequest]);

  return [pending, response, triggerManually];
}

export function useRecursiveFetch(url) {
  const [currentUrl, setCurrentUrl] = React.useState('');
  const [data, setData] = React.useState([]);
  const [, currentResponse] = useRequest(currentUrl);
  const [pending, setPending] = React.useState(!!url);
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    if (url) {
      setCurrentUrl(url);
      setData([]);
      setPending(true);
      setTotal(0);
    }
  }, [url, setCurrentUrl, setData, setPending, setTotal]);

  React.useEffect(() => {
    if (!currentResponse) {
      return;
    }

    if (currentResponse.count) {
      setTotal(currentResponse.count);
    }

    if (currentResponse.next) {
      setCurrentUrl(currentResponse.next);
    } else {
      setPending(false);
    }

    if (currentResponse.results) {
      setData((prevData) => [...prevData, ...currentResponse.results]);
    }
  }, [currentResponse, setPending, setData, setCurrentUrl, setTotal]);

  return [pending, data, total];
}

const emptyList = [];
const PAGE_SIZE = 500;
export function useRecursiveCsvFetch(url, otherOptions) {
  const [requestOptions, setRequestOptions] = React.useState(defaultRequestOptions);
  const [currentUrl, setCurrentUrl] = React.useState('');
  const [data, setData] = React.useState([]);
  const [, currentResponse] = useRequest(currentUrl, requestOptions, otherOptions);
  const [pending, setPending] = React.useState(!!url);
  const totalRef = React.useRef(0);
  const requestCountRef = React.useRef(-1);
  const urlRef = React.useRef(url);

  React.useEffect(() => {
    if (!isFalsyString(url)) {
      setCurrentUrl(`${url}?format=json&limit=1&offset=0`);
      setData(emptyList);
      setPending(true);
      totalRef.current = 0;
      requestCountRef.current = -1;
    } else {
      setCurrentUrl(url);
      setData(emptyList);
      setPending(false);
      totalRef.current = 0;
      requestCountRef.current = -1;
    }

    urlRef.current = url;
  }, [url, setCurrentUrl, setData, setPending]);

  React.useEffect(() => {
    if (requestCountRef.current === -1) {
      ++requestCountRef.current;
      return;
    }

    if (!currentResponse) {
      return;
    }

    if (requestCountRef.current === 0) {
      if (currentResponse.count) {
        totalRef.current = currentResponse.count;
        setRequestOptions(csvRequestOptions);
        const paginatedUrl = `${url}?format=csv&offset=0&limit=${PAGE_SIZE}`;
        setCurrentUrl(paginatedUrl);
      }
    } else {
      const offset = requestCountRef.current * PAGE_SIZE;

      if (offset <= totalRef.current) {
        const paginatedUrl = `${url}?format=csv&offset=${offset}&limit=${PAGE_SIZE}`;
        setCurrentUrl(paginatedUrl);
      } else {
        setCurrentUrl('');
        setPending(false);
      }

      if (currentResponse) {
        const rows = csvParse(currentResponse, {
          columns: true,
        });

        setData((prevData) => [...prevData, ...rows]);
      }
    }
    ++requestCountRef.current;
  }, [currentResponse, url, setPending, setData, setCurrentUrl]);

  return [pending, data, totalRef.current];
}

export default useRequest;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import csvParse from 'csv-parse/lib/sync';
import {resolve as resolveUrl} from 'url';
import { isFalsyString } from '@togglecorp/fujs';
import AbortController from 'abort-controller';
import { api } from '#config';


// Type of RequestInit
export const defaultRequestOptions = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  },
};

export const csvRequestOptions = {
  headers: {
    Accept: 'text/csv',
    'Content-Type': 'text/csv; charset=utf-8',
  },
};

const defaultOtherOptions = {
  preserveResponse: true,
  debug: false,
};

function withAuthToken(options = defaultRequestOptions) {
  const user = localStorage.get('user');

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
  url: string | undefined,
  requestOptions = defaultRequestOptions,
  otherOptions,
): [boolean, T | undefined] {
  const [response, setResponse] = useState();
  const [pending, setPending] = useState(!!url);

  const {
    preserveResponse,
    debug,
  } = {...defaultOtherOptions, ...otherOptions};

  const clientIdRef = useRef(-1);
  const pendingSetByRef = useRef(-1);
  const responseSetByRef = useRef(-1);

  const setPendingSafe = useCallback(
    (value: boolean, clientId) => {
      if (clientId >= pendingSetByRef.current) {
        pendingSetByRef.current = clientId;
        if (debug) {
          console.debug('setting pending', value, 'by client', clientId);
        }
        setPending(value);
      }
    },
    [debug],
  );
  const setResponseSafe = useCallback(
    (value: T | undefined, clientId) => {
      if (clientId >= responseSetByRef.current) {
        responseSetByRef.current = clientId;
        if (debug) {
          console.debug('setting response', value, 'by client', clientId);
        }
        setResponse(value);
      }
    },
    [debug],
  );

  const fullUrl = React.useMemo(() => (
    isFalsyString(url) ? '' : /http/.test(url) ? url: resolveUrl(api, url)
  ), [url]);

  useEffect(
    () => {
      if (isFalsyString(fullUrl)) {
        setResponseSafe(undefined, clientIdRef.current);
        setPendingSafe(false, clientIdRef.current);
        return () => {};
      }
      if (!preserveResponse) {
        setResponseSafe(undefined, clientIdRef.current);
      }

      // console.info('Creating new request', url);
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
          } else {
            // console.info('Clearing response on network error');
          }
          return;
        }

        let resBody;
        try {
          const resText = await res.text();
          if (fetchOptions.headers['Accept'] === 'application/json') {
            if (resText.length > 0) {
              resBody = JSON.parse(resText);
            }
          } else {
            resBody = resText;
          }

        } catch (e) {
          // console.warn('Clearing response on parse error');
          setResponseSafe(undefined, clientId);
          setPendingSafe(false, clientId);
          console.error(`An error occured while parsing data from ${fetchUrl}`, e);
          return;
        }

        if (res.ok) {
          setResponseSafe(resBody, clientId);
          setPendingSafe(false, clientId);
        }
      }

      fetchResource(fullUrl, withAuthToken(requestOptions), clientIdRef.current);

      return () => {
        controller.abort();
      };
    },
    [fullUrl, requestOptions, preserveResponse, setPendingSafe, setResponseSafe],
  );

  return [pending, response];
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

const PAGE_SIZE = 200;
export function useRecursiveCsvFetch(url) {
  const [requestOptions, setRequestOptions] = React.useState(defaultRequestOptions);
  const [currentUrl, setCurrentUrl] = React.useState('');
  const [data, setData] = React.useState([]);
  const [, currentResponse] = useRequest(currentUrl, requestOptions);
  const [pending, setPending] = React.useState(!!url);
  const totalRef = React.useRef(0);
  const requestCountRef = React.useRef(-1);

  React.useEffect(() => {
    if (!isFalsyString(url)) {
      setCurrentUrl(`${url}?format=json&limit=1&offset=0`);
      setData([]);
      setPending(true);
      totalRef.current = 0;
      requestCountRef.current = -1;
    }
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

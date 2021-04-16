import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const defaultOtherOptions = {
  preserveResponse: false,
  debug: false,
};

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
    /http/.test(url) ? url: resolveUrl(api, url)
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
          if (resText.length > 0) {
            resBody = JSON.parse(resText);
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

      fetchResource(fullUrl, requestOptions, clientIdRef.current);

      return () => {
        controller.abort();
      };
    },
    [fullUrl, requestOptions, preserveResponse, setPendingSafe, setResponseSafe],
  );

  return [pending, response];
}
export default useRequest;

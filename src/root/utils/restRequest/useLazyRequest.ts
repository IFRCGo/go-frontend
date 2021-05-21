import {
    useState,
    useEffect,
    useRef,
    useCallback,
    useContext,
    useLayoutEffect,
    useMemo,
} from 'react';
import ReactDOM from 'react-dom';

import AbortController from 'abort-controller';

import { prepareUrlParams, isFetchable, Methods } from './utils';
import { UrlParams } from './types';
import RequestContext, { ContextInterface } from './context';
import fetchResource, { RequestOptions as BaseRequestOptions } from './fetch';


// NOTE: when context is undefined, the request will not trigger
// If there is no context, user should instead use null

type Callable<C, R> = R | ((value: C) => R);

function isCallable<C, R>(value: Callable<C, R>): value is ((value: C) => R) {
    return typeof value === 'function';
}

function resolveCallable<C, R>(value: Callable<C, R>, context: C | undefined) {
    if (isCallable(value)) {
        return context !== undefined ? value(context) : undefined;
    }
    return value;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type RequestBody = RequestInit['body'] | object;

type LazyRequestOptions<R, E, C, O> = BaseRequestOptions<R, E, C> & {
    url: Callable<C, string | undefined>;
    query?: Callable<C, UrlParams | undefined>;
    body?: Callable<C, RequestBody | undefined>;
    method?: Callable<C, Methods | undefined>;
    other?: Callable<C, Omit<RequestInit, 'body'> | undefined>;

    // NOTE: don't ever re-trigger
    delay?: number;
    mockResponse?: R;
    preserveResponse?: boolean;
} & O;

function useLazyRequest<R, RE, E, O, C = null>(
    requestOptions: LazyRequestOptions<R, E, C, O>,
) {
    const {
        transformOptions,
        transformUrl,
        transformBody,
        transformError,
    } = useContext(RequestContext as React.Context<ContextInterface<R, RE, E, O>>);

    // NOTE: forgot why the clientId is required but it is required
    const clientIdRef = useRef<number>(-1);
    const pendingSetByRef = useRef<number>(-1);
    const responseSetByRef = useRef<number>(-1);
    const errorSetByRef = useRef<number>(-1);

    const [requestOptionsFromState, setRequestOptionsFromState] = useState(requestOptions);
    const [context, setContext] = useState<C | undefined>();

    // NOTE: let's not add transformOptions as dependency
    const requestOptionsRef = useRef(requestOptions);
    const transformOptionsRef = useRef(transformOptions);
    const transformUrlRef = useRef(transformUrl);
    const transformBodyRef = useRef(transformBody);
    const transformErrorRef = useRef(transformError);

    const contextRef = useRef(context);

    const {
        url: rawUrl,
        query: rawQuery,
        method: rawMethod,
        body: rawBody,
        other: rawOther,
    } = requestOptionsFromState;

    const query = useMemo(
        () => resolveCallable(rawQuery, context),
        [rawQuery, context],
    );
    const url = useMemo(
        () => resolveCallable(rawUrl, context),
        [rawUrl, context],
    );
    const body = useMemo(
        () => resolveCallable(rawBody, context),
        [rawBody, context],
    );
    const method = useMemo(
        () => resolveCallable(rawMethod, context) ?? 'GET',
        [rawMethod, context],
    );
    const other = useMemo(
        () => resolveCallable(rawOther, context),
        [rawOther, context],
    );

    const urlQuery = query ? prepareUrlParams(query) : undefined;
    const extendedUrl = url && urlQuery ? `${url}?${urlQuery}` : url;

    const [response, setResponse] = useState<R | undefined>();
    const [error, setError] = useState<E | undefined>();

    const [runId, setRunId] = useState(-1);

    const [pending, setPending] = useState(false);

    const setPendingSafe = useCallback(
        (value: boolean, clientId: number) => {
            if (clientId >= pendingSetByRef.current) {
                pendingSetByRef.current = clientId;
                setPending(value);
            }
        },
        [],
    );
    const setResponseSafe = useCallback(
        (value: R | undefined, clientId: number) => {
            if (clientId >= responseSetByRef.current) {
                responseSetByRef.current = clientId;
                setResponse(value);
            }
        },
        [],
    );

    const setErrorSafe = useCallback(
        (value: E | undefined, clientId: number) => {
            if (clientId >= errorSetByRef.current) {
                errorSetByRef.current = clientId;
                setError(value);
            }
        },
        [],
    );

    const callSideEffectSafe = useCallback(
        (callback: () => void, clientId: number) => {
            if (clientId >= clientIdRef.current) {
                callback();
            }
        },
        [],
    );

    useLayoutEffect(
        () => {
            transformOptionsRef.current = transformOptions;
        },
        [transformOptions],
    );
    useLayoutEffect(
        () => {
            transformUrlRef.current = transformUrl;
        },
        [transformUrl],
    );
    useLayoutEffect(
        () => {
            transformBodyRef.current = transformBody;
        },
        [transformBody],
    );
    useLayoutEffect(
        () => {
            transformErrorRef.current = transformError;
        },
        [transformError],
    );
    useLayoutEffect(
        () => {
            requestOptionsRef.current = requestOptions;
        },
        [requestOptions],
    );
    useLayoutEffect(
        () => {
            contextRef.current = context;
        },
        [context],
    );

    useEffect(
        () => {
            const { mockResponse } = requestOptionsRef.current;
            if (mockResponse) {
                if (context === undefined || runId < 0 || !isFetchable(extendedUrl, method, body)) {
                    return () => {};
                }

                clientIdRef.current += 1;

                setResponseSafe(mockResponse, clientIdRef.current);
                setErrorSafe(undefined, clientIdRef.current);
                setPendingSafe(false, clientIdRef.current);

                const { onSuccess } = requestOptionsRef.current;
                if (onSuccess) {
                    callSideEffectSafe(() => {
                        onSuccess(mockResponse, context);
                    }, clientIdRef.current);
                }
                return () => {};
            }

            if (context === undefined || runId < 0 || !isFetchable(extendedUrl, method, body)) {
                setResponseSafe(undefined, clientIdRef.current);
                setErrorSafe(undefined, clientIdRef.current);
                setPendingSafe(false, clientIdRef.current);
                return () => {};
            }

            const {
                // schemaName,
                preserveResponse,
                delay = 0,
            } = requestOptionsRef.current;

            if (!preserveResponse) {
                setResponseSafe(undefined, clientIdRef.current);
                setErrorSafe(undefined, clientIdRef.current);
            }

            clientIdRef.current += 1;

            // FIXME: this may need to move up
            setPendingSafe(true, clientIdRef.current);

            /*
            if (method !== 'DELETE' && !schemaName) {
                console.error(`Schema is not defined for ${extendedUrl} ${method}`);
            }
            */

            const controller = new AbortController();

            fetchResource(
                extendedUrl,
                {
                    ...other,
                    method,
                    // FIXME: here object is explicitly cast as BodyInit
                    body: body as (BodyInit | null | undefined),
                },
                delay,

                transformUrlRef,
                transformOptionsRef,
                transformBodyRef,
                transformErrorRef,
                requestOptionsRef,
                context,

                setPendingSafe,
                setResponseSafe,
                setErrorSafe,
                callSideEffectSafe,

                controller,
                clientIdRef.current,
            );

            return () => {
                controller.abort();
            };
        },
        [
            extendedUrl, method, body, other,
            setPendingSafe, setResponseSafe, setErrorSafe, callSideEffectSafe,
            runId,
            context,
        ],
    );

    const trigger = useCallback(
        (ctx: C) => {
            ReactDOM.unstable_batchedUpdates(() => {
                setRunId(new Date().getTime());
                setContext(ctx);
                setRequestOptionsFromState(requestOptionsRef.current);
            });
        },
        [],
    );

    return {
        response,
        pending,
        error,
        trigger,
        context,
    };
}
export default useLazyRequest;

import ReactDOM from 'react-dom';
import { MutableRefObject } from 'react';
import AbortController from 'abort-controller';

import sleep from './sleep';
import { ContextInterface } from './context';

export interface RequestOptions<R, E, C> {
    shouldRetry?: (val: R, run: number, context: C) => number;
    shouldPoll?: (val: R | undefined, context: C) => number;
    onSuccess?: (val: R, context: C) => void;
    onFailure?: (val: E, context: C) => void;
}

type ExtendedRequestOptions<R, E, C, O> = RequestOptions<R, E, C> & O;

async function fetchResource<R, RE, E, C, O>(
    url: string,
    options: RequestInit,
    delay: number,

    transformUrlRef: MutableRefObject<ContextInterface<R, RE, E, ExtendedRequestOptions<R, E, C, O>>['transformUrl']>,
    transformOptionsRef: MutableRefObject<ContextInterface<R, RE, E, ExtendedRequestOptions<R, E, C, O>>['transformOptions']>,
    transformResponseRef: MutableRefObject<ContextInterface<R, RE, E, ExtendedRequestOptions<R, E, C, O>>['transformResponse']>,
    transformErrorRef: MutableRefObject<ContextInterface<R, RE, E, ExtendedRequestOptions<R, E, C, O>>['transformError']>,
    requestOptionsRef: MutableRefObject<ExtendedRequestOptions<R, E, C, O>>,
    context: C,

    setPendingSafe: (value: boolean, clientId: number) => void,
    setResponseSafe: (value: R | undefined, clientId: number) => void,
    setErrorSafe: (value: E | undefined, clientId: number) => void,
    callSideEffectSafe: (value: () => void, clientId: number) => void,

    myController: AbortController,
    clientId: number,
    run = 1,
) {
    const { signal } = myController;
    await sleep(delay, { signal });

    async function handlePoll(pollTime: number) {
        await sleep(pollTime, { signal });

        await fetchResource(
            url,
            options,
            delay,

            transformUrlRef,
            transformOptionsRef,
            transformResponseRef,
            transformErrorRef,
            requestOptionsRef,
            context,

            setPendingSafe,
            setResponseSafe,
            setErrorSafe,
            callSideEffectSafe,

            myController,
            clientId, // NOTE: may not need to increase clientId
            1, // NOTE: run should be reset
        );
    }

    async function handleError(message: E) {
        const { shouldPoll } = requestOptionsRef.current;
        const pollTime = shouldPoll ? shouldPoll(undefined, context) : -1;

        if (pollTime > 0) {
            await handlePoll(pollTime);
        } else {
            ReactDOM.unstable_batchedUpdates(() => {
                setPendingSafe(false, clientId);
                setResponseSafe(undefined, clientId);
                setErrorSafe(message, clientId);
            });
            const { onFailure } = requestOptionsRef.current;
            if (onFailure) {
                callSideEffectSafe(() => {
                    onFailure(message, context);
                }, clientId);
            }
        }
    }

    const myUrl = transformUrlRef.current(
        url,
        options,
        requestOptionsRef.current,
    );
    const myOptions = transformOptionsRef.current(
        url,
        options,
        requestOptionsRef.current,
    );

    let res;
    try {
        res = await fetch(myUrl, { ...myOptions, signal });
    } catch (e) {
        if (!signal.aborted) {
            console.error(`An error occurred while fetching ${myUrl}`, e);

            const terror = transformErrorRef.current(
                'network',
                url,
                options,
                requestOptionsRef.current,
            );
            await handleError(terror);
        }
        return;
    }

    let resBody: R | RE;
    try {
        resBody = await transformResponseRef.current(
            res,
            url,
            options,
            requestOptionsRef.current,
        );
    } catch (e) {
        console.error(`An error occurred while parsing ${myUrl}`, e);
        const terror = transformErrorRef.current(
            'parse',
            url,
            options,
            requestOptionsRef.current,
        );
        await handleError(terror);
        return;
    }

    if (!res.ok) {
        const tError = transformErrorRef.current(
            resBody as RE,
            url,
            options,
            requestOptionsRef.current,
        );
        await handleError(tError);
        return;
    }

    const { shouldRetry, shouldPoll } = requestOptionsRef.current;

    // TODO: define a default shouldRetry when there is network error
    const retryTime = shouldRetry ? shouldRetry(resBody as R, run, context) : -1;

    if (retryTime >= 0) {
        await sleep(retryTime, { signal });
        await fetchResource(
            url,
            options,
            delay,

            transformUrlRef,
            transformOptionsRef,
            transformResponseRef,
            transformErrorRef,
            requestOptionsRef,
            context,

            setPendingSafe,
            setResponseSafe,
            setErrorSafe,
            callSideEffectSafe,

            myController,
            clientId,
            run + 1,
        );
        return;
    }

    const pollTime = shouldPoll ? shouldPoll(resBody as R, context) : -1;
    ReactDOM.unstable_batchedUpdates(() => {
        if (pollTime < 0) {
            setPendingSafe(false, clientId);
        }
        setErrorSafe(undefined, clientId);
        setResponseSafe(resBody as R, clientId);
    });

    const { onSuccess } = requestOptionsRef.current;
    if (onSuccess) {
        callSideEffectSafe(() => {
            onSuccess(resBody as R, context);
        }, clientId);
    }

    if (pollTime >= 0) {
        await handlePoll(pollTime);
    }
}

export default fetchResource;

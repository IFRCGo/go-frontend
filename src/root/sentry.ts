// import { matchPath } from 'react-router-dom';
import {
    //  reactRouterV5Instrumentation,
    BrowserOptions,
} from '@sentry/react';
// import { Integrations } from '@sentry/tracing';
// import browserHistory from '#root/Multiplexer/history';
// import routes from '#base/configs/routes';
import {
    // api,
    environment,
    sentryAppDsn,
    sentryNormalizeDepth,
    sentryTraceSampleRate,
} from './config';

const sentryConfig: BrowserOptions | undefined = sentryAppDsn ? {
    dsn: sentryAppDsn,
    // FIXME: release needs to be defined
    release: undefined,
    environment: environment,
    // FIXME: debug needs to be defined
    debug: undefined,
    // sendDefaultPii: true,
    normalizeDepth: sentryNormalizeDepth,
    tracesSampleRate: sentryTraceSampleRate,
    /*
    //FIXME: In order to complete the integrations, routes must be defined first
    integrations: [
        new Integrations.BrowserTracing({
            // NOTE: api is actually the domain for the api endpoint
            tracingOrigins: ['localhost', api],
            routingInstrumentation: reactRouterV5Instrumentation(
                browserHistory,
                Object.entries(routes),
                matchPath,
            ),
        }),
    ],
    */
} : undefined;

export default sentryConfig;

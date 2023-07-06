import {
  reactRouterV5Instrumentation,
  BrowserOptions,
} from '@sentry/react';
 import { Integrations } from '@sentry/tracing';
import { isTruthyString } from '@togglecorp/fujs';
import browserHistory from '#root/Multiplexer/history';

import { APP_VERSION, GIT_HASH } from '#utils/constants';

import {
    api,
    environment,
    sentryAppDsn,
    sentryNormalizeDepth,
    sentryTraceSampleRate,
} from './config';

const sentryConfig: BrowserOptions | undefined = isTruthyString(sentryAppDsn) ? {
  dsn: sentryAppDsn,
  environment: environment,
  normalizeDepth: sentryNormalizeDepth,
  tracesSampleRate: sentryTraceSampleRate,
  debug: false,
  release: `${APP_VERSION} ${GIT_HASH}`,
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ['localhost', api],
      routingInstrumentation: reactRouterV5Instrumentation(
        browserHistory,
      ),
    }),
  ],
} : undefined;

export default sentryConfig;

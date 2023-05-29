// NOTE: for some reason, old pipeline doesn't load env.js file and window.appSettings is undefined
if (!window.appSettings) {
  window.appSettings = {
    environmentDisplayName: 'Staging site',
    apiUrl: '',
    adminUrl: '',
    fdrsAuth: '',
    mbtoken: '',
    showEnvBanner: 'false',
    riskApi: '',
    riskAdminUrl: '',
    tinyApiKey: '',
    sentryDsn: '',
    setnryTracesSampleRate: '',
    sentryNormalizeDepth: '',
  };
}

export const environment = process.env.REACT_APP_ENVIRONMENT ?? 'development';

export const api = process.env.REACT_APP_API_ENDPOINT ?? window.appSettings.apiUrl;
export const adminUrl = process.env.REACT_APP_ADMIN_URL ?? window.appSettings.adminUrl;
export const fdrsAuth = process.env.REACT_APP_FDRS_AUTH ?? window.appSettings.fdrsAuth;
export const mbtoken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ?? window.appSettings.mbtoken;
export const showEnvBanner = process.env.REACT_APP_SHOW_ENV_BANNER ?? window.appSettings.showEnvBanner;
export const riskApi = process.env.REACT_APP_RISK_API_ENDPOINT ?? window.appSettings.riskApi;
export const riskAdminUrl = process.env.REACT_APP_RISK_ADMIN_URL ?? window.appSettings.riskAdminUrl;
export const tinyApiKey = process.env.REACT_APP_TINY_API_KEY ?? window.appSettings.tinyApiKey;

// NOTE: New variables required by Sentry
export const sentryAppDsn = process.env.REACT_APP_SENTRY_DSN ?? window.appSettings.sentryDsn;
export const sentryTraceSampleRate = Number(process.env.REACT_APP_SENTRY_TRACES_SAMPLE_RATE) ?? Number(window.appSettings.sentryTracesSampleRate) ?? 0.2;
export const sentryNormalizeDepth = Number(process.env.REACT_APP_SENTRY_NORMALIZE_DEPTH) ?? Number(window.appSettings.sentryNormalizeDepth) ?? 5;

const config = {
  api,
  environment,
  fdrsAuth,
};

export default config;

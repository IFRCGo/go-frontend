// NOTE: for some reason, old pipeline doesn't load env.js file and window.appSettings is undefined
if (!window.appSettings) {
  window.appSettings = {
    environmentDisplayName: 'Staging site',
    apiUrl: 'https://dsgocdnapi.azureedge.net/',
    adminUrl: 'https://dsgocdnapi.azureedge.net/',
    fdrsAuth: '',
    mbtoken: 'pk.eyJ1IjoiZ28taWZyYyIsImEiOiJjams3b2ZhZWswMGFvM3hxeHp2ZHFhOTRrIn0._pqO9OQ2iNeDGrpopJNjpg',
    showEnvBanner: 'false',
    riskApi: 'https://go-risk-staging.northeurope.cloudapp.azure.com/',
    riskAdminUrl: 'https://go-risk-staging.northeurope.cloudapp.azure.com/',
  };
}

export const environment = process.env.REACT_APP_ENVIRONMENT ?? 'development';

export const riskApi = process.env.REACT_APP_RISK_API_ENDPOINT ?? window.appSettings.riskApi;
export const riskAdminUrl = process.env.REACT_APP_RISK_ADMIN_URL ?? window.appSettings.riskAdminUrl;
export const api = process.env.REACT_APP_API_ENDPOINT ?? window.appSettings.apiUrl;
export const adminUrl = process.env.REACT_APP_ADMIN_URL ?? window.appSettings.adminUrl;
export const fdrsAuth = process.env.REACT_APP_FDRS_AUTH ?? window.appSettings.fdrsAuth;
export const mbtoken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ?? window.appSettings.mbtoken;
export const showEnvBanner = process.env.REACT_APP_SHOW_ENV_BANNER ?? window.appSettings.showEnvBanner;


const config = {
  api,
  environment,
  fdrsAuth,
};

export default config;

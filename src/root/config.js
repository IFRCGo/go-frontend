// FIXME: We should not put up default values like this + eliminate doubling:
const defaultUrls = {
  production: {
    apiServer: 'https://goadmin.ifrc.org/',
    adminPanel: 'https://goadmin.ifrc.org/',
    riskApiServer: 'https://go-risk-staging.northeurope.cloudapp.azure.com/',
    riskAdminPanel: 'https://go-risk-staging.northeurope.cloudapp.azure.com/',
  },
  staging: {
    apiServer: 'https://dsgocdnapi.azureedge.net/',
    adminPanel: 'https://dsgocdnapi.azureedge.net/',
    riskApiServer: 'https://go-risk-staging.northeurope.cloudapp.azure.com/',
    riskAdminPanel: 'https://go-risk-staging.northeurope.cloudapp.azure.com/',
  },
  development: {
    apiServer: 'https://dsgocdnapi.azureedge.net/',
    adminPanel: 'https://dsgocdnapi.azureedge.net/',
    riskApiServer: 'https://go-risk-staging.northeurope.cloudapp.azure.com/',
    riskAdminPanel: 'https://go-risk-staging.northeurope.cloudapp.azure.com/',
  },
};

// not used: const defaultMapboxToken =  'pk.eyJ1IjoiZ28taWZyYyIsImEiOiJjams3b2ZhZWswMGFvM3hxeHp2ZHFhOTRrIn0._pqO9OQ2iNeDGrpopJNjpg';


export const riskApi = process.env.REACT_APP_RISK_API_ENDPOINT ?? window.appSettings.riskApi;
export const riskAdminUrl = process.env.REACT_APP_RISK_ADMIN_URL ?? window.appSettings.riskAdminUrl;
export const environment = window.appSettings.environmentDisplayName;
export const api = process.env.REACT_APP_API_ENDPOINT ?? window.appSettings.apiUrl;
export const adminUrl = process.env.REACT_APP_ADMIN_URL ?? window.appSettings.adminUrl;
export const fdrsAuth = process.env.REACT_APP_FDRS_AUTH ?? window.appSettings.fdrsAuth;
export const mbtoken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ?? window.appSettings.mbtoken;
export const showEnvBanner = window.appSettings.showEnvBanner;
export const tinyApiKey = process.env.REACT_APP_TINY_API_KEY ?? window.appSettings.tinyApiKey;


const config = {
  api,
  environment,
  fdrsAuth,
};

if (!Object.keys(defaultUrls).includes(environment)) {
  console.warn('Invalid environment', environment);
}

export default config;

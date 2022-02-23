// FIXME: We should not put up default values like this
const defaultUrls = {
  production: {
    apiServer: 'https://prddsgocdnapi.azureedge.net/',
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

const defaultMapboxToken =  'pk.eyJ1IjoiZ28taWZyYyIsImEiOiJjams3b2ZhZWswMGFvM3hxeHp2ZHFhOTRrIn0._pqO9OQ2iNeDGrpopJNjpg';


export const riskApi = window.riskApi;
export const riskAdminUrl = window.riskAdminUrl;
export const environment = window.environmentDisplayName;
export const api = window.api;
export const adminUrl = window.adminUrl;
export const fdrsAuth = window.fdrsAuth;
export const mbtoken = window.mbtoken;
export const showEnvBanner = window.showEnvBanner;

const defaultUrl = defaultUrls[environment];


const config = {
  api,
  environment,
  fdrsAuth,
};

if (!Object.keys(defaultUrls).includes(environment)) {
  console.warn('Invalid environment', environment);
}

export default config;

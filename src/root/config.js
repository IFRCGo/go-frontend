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

const defaultMapboxToken =  'pk.eyJ1IjoiZ28taWZyYyIsImEiOiJjams3b2ZhZWswMGFvM3hxeHp2ZHFhOTRrIn0._pqO9OQ2iNeDGrpopJNjpg';


export const riskApi = window.appSettings.riskApiUrl;
export const riskAdminUrl = window.appSettings.riskAdminUrl;
export const environment = window.appSettings.environmentDisplayName;
export const api = window.appSettings.apiUrl;
export const adminUrl = window.appSettings.adminUrl;
export const fdrsAuth = window.appSettings.fdrsAuth;
export const mbtoken = window.appSettings.mbtoken;
export const showEnvBanner = window.appSettings.showEnvBanner;


const config = {
  api,
  environment,
  fdrsAuth,
};

if (!Object.keys(defaultUrls).includes(environment)) {
  console.warn('Invalid environment', environment);
}

export default config;

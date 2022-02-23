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

export const environment = process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV || 'development';
// FIXME: this should never happen
const defaultUrl = defaultUrls[environment] ?? defaultUrls['staging'];

export const api = process.env.REACT_APP_API_ENDPOINT ?? defaultUrl?.apiServer;
export const adminUrl = process.env.REACT_APP_ADMIN_URL ?? defaultUrl?.adminPanel;
export const riskApi = process.env.REACT_APP_RISK_API_ENDPOINT ?? defaultUrl?.riskApiServer;
export const riskAdminUrl = process.env.REACT_APP_RISK_ADMIN_URL ?? defaultUrl?.riskAdminUrl;
export const fdrsAuth = process.env.REACT_APP_FDRS_AUTH ?? process.env['fdrsAuth'] ?? '';
export const mbtoken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ?? defaultMapboxToken;

const config = {
  api,
  environment,
  fdrsAuth,
};

if (!Object.keys(defaultUrls).includes(environment)) {
  console.warn('Invalid environment', environment);
}

export default config;

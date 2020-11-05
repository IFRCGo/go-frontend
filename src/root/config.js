export const environment = process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV || 'development';
export const api = process.env.REACT_APP_API_ENDPOINT ||
  (process.env.NODE_ENV === 'production' ? 'https://prddsgocdnapi.azureedge.net/' : 'https://localhost:8000/');
export const fdrsAuth = process.env.REACT_APP_FDRS_AUTH || process.env['fdrsAuth'] || '';
export const mbtoken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZ28taWZyYyIsImEiOiJjams3b2ZhZWswMGFvM3hxeHp2ZHFhOTRrIn0._pqO9OQ2iNeDGrpopJNjpg';

const config = {
  api,
  environment,
  fdrsAuth,
};

export default config;

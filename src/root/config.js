export const environment = 'development';
export const api = process.env.REACT_APP_API_ENDPOINT;
export const fdrsAuth = process.env.REACT_APP_FDRS_AUTH;
export const mbtoken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const config = {
  api,
  environment,
  fdrsAuth,
};

export default config;

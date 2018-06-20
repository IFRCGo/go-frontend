'use strict';
/*
 * App config overrides for staging.
 */
module.exports = {
  fdrsAuth: process.env['fdrs_auth'],
  environment: 'staging',
  api: 'https://dsgocdnapi.azureedge.net/',
  mbtoken: 'pk.eyJ1IjoiZGV2c2VlZCIsImEiOiJnUi1mbkVvIn0.018aLhX0Mb0tdtaT2QNe2Q'
};

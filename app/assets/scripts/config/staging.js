'use strict';
/*
 * App config overrides for staging.
 */
module.exports = {
  fdrsUser: process.env['fdrs_user'],
  fdrsPass: process.env['fdrs_pass'],
  environment: 'staging',
  api: 'https://dsgocdnapi.azureedge.net/',
  mbtoken: 'pk.eyJ1IjoiZGV2c2VlZCIsImEiOiJnUi1mbkVvIn0.018aLhX0Mb0tdtaT2QNe2Q'
};

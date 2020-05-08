'use strict';
/*
 * App config overrides for staging.
 */
module.exports = {
  fdrsAuth: process.env['fdrsAuth'],
  environment: 'staging',
  api: 'https://dsgocdnapi.azureedge.net/',
  mbtoken: 'pk.eyJ1IjoiZ28taWZyYyIsImEiOiJjams3b2ZhZWswMGFvM3hxeHp2ZHFhOTRrIn0._pqO9OQ2iNeDGrpopJNjpg'
};

import './wdyr';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from '#root';
import 'react-tooltip/dist/react-tooltip.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { init } from '@sentry/react';

import sentryConfig from './root/sentry';
import './styles/main.scss';

if (sentryConfig) {
  init(sentryConfig);
  console.info('sentry initialized');
}

var isIE = !!document.documentMode;
if (!isIE) {
  ReactDOM.render(
    <Root />,
    document.getElementById('app-container')
  );
}

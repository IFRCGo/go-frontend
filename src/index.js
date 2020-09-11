import './wdyr';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from '#root';
import browser from 'browser-detect';

import './styles/main.scss';

const brw = browser();

// Internet Explorer is the only unsupported browser (2020-Sep-11)
if (brw.name === 'ie') {
  document.getElementById('app-container').innerHTML = 'Sorry but Internet Explorer is not a supported browser. Please use Chrome (or any Chromium based browser) or Firefox.';
} else {
  ReactDOM.render(
    <Root />,
    document.getElementById('app-container')
  );  
}

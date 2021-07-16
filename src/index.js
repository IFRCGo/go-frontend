import './wdyr';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from '#root';

import './styles/main.scss';

var isIE = !!document.documentMode;
if (!isIE) {
  ReactDOM.render(
    <Root />,
    document.getElementById('app-container')
  );
}

/* eslint-disable react/prop-types */
'use strict';

import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';

import Fold from './fold';

const ErrorPanel = props => {
  return (
    <Fold title={props.title} id="errorMessage">
      <span>{props.errorMessage}</span>
    </Fold>
  );
};

if (environment !== 'production') {
  ErrorPanel.propTypes = {
    title: T.string,
    errorMessage: T.string
  };
}

export default ErrorPanel;


import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '#config';

import Fold from './fold';

const ErrorPanel = props => {
  return (
    <Fold showHeader={false} title={props.title} id="errorMessage">
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

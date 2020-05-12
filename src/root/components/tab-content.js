
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';

import ErrorPanel from './error-panel';

function TabContent ({ isError, showError, errorMessage, title, children }) {
  return (
    <div>
      {
        isError ? (
          showError ? (
            <ErrorPanel title={title} errorMessage={errorMessage} />
          ) : null
        ) : (
          children
        )
      }
    </div >
  );
}

TabContent.defaultProps = {
  isError: false,
  errorMessage: 'coming soon',
  title: 'Error'
};

if (environment !== 'production') {
  TabContent.propTypes = {
    isError: T.bool,
    showError: T.bool,
    errorMessage: T.string,
    children: T.node,
    title: T.string
  };
}

export default TabContent;

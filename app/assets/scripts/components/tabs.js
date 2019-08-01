'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';
import { Tabs, TabList, Tab, TabPanel as ReactTabPanel } from 'react-tabs';
import ErrorPanel from './error-panel';

function TabPanel ({ isError, errorMessage, title, children, ...rest }) {
  return (
    <ReactTabPanel {...rest}>
      {isError ? (
        <ErrorPanel title={title} errorMessage={errorMessage} />
      ) : (
        children
      )}
    </ReactTabPanel>
  );
}

TabPanel.defaultProps = {
  isError: false,
  errorMessage: 'coming soon',
  title: 'Error'
};

if (environment !== 'production') {
  TabPanel.propTypes = {
    isError: T.bool,
    title: T.string,
    errorMessage: T.string,
    children: T.node
  };
}

export { Tabs, Tab, TabList, TabPanel };

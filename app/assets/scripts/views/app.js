'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

import { environment } from '../config';

import Header from '../components/header';
import GlobalLoading from '../components/global-loading';
import SysAlerts from '../components/system-alerts';

class App extends React.Component {
  render () {
    return (
      <div className={c('page', this.props.className)}>
        <Header />
        <main className='page__body' role='main'>
          {this.props.children}
        </main>
        <GlobalLoading />
        <SysAlerts />
      </div>
    );
  }
}

if (environment !== 'production') {
  App.propTypes = {
    className: T.string,
    children: T.object
  };
}

export default App;

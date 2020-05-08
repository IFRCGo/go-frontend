'use strict';
import React from 'react';
import { Helmet } from 'react-helmet';

import App from './app';

export default class UhOh extends React.Component {
  render () {
    return (
      <App className='page--uhoh'>
        <Helmet>
          <title>IFRC Go - Page not found</title>
        </Helmet>
        <section className='inpage inpage--uhoh'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Page not found</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <div className='prose prose--responsive'>
                <p>The requested page does not exist or may have been removed.</p>
              </div>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

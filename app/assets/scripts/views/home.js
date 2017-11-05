'use strict';
import React from 'react';

import App from './app';

export default class Home extends React.Component {
  render () {
    return (
      <App className='page--homepage'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Welcome</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <div className='prose prose--responsive'>
                <p>In the beginning the Universe was created. This has made a lot of people very upset and been widely regarded as a bad move.</p>
              </div>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

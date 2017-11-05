'use strict';
import React from 'react';

import App from './app';

export default class Login extends React.Component {
  render () {
    return (
      <App className='page--login'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Login</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <div className='prose prose--responsive'>
                <p>Login here</p>
              </div>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

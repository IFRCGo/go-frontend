'use strict';
import React from 'react';
import App from './app';
import NewPassword from '../components/connected/new-password';
import { Helmet } from 'react-helmet';

class PasswordChange extends React.Component {
  render () {
    return (
      <App className='page--passwordchange'>
        <Helmet>
          <title>IFRC Go - Change Password</title>
        </Helmet>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Change my password</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <div className='prose prose--responsive'>
                <NewPassword verifyOldPassword={true} />
              </div>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

export default PasswordChange;

'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';

import { environment } from '../config';

import App from './app';

class Account extends React.Component {
  render () {
    return (
      <App className='page--account'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Hello {this.props.userData.username}</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <div className='prose prose--responsive'>
                <pre>{JSON.stringify(this.props.userData, null, ' ')}</pre>
              </div>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

if (environment !== 'production') {
  Account.propTypes = {
    userData: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  userData: state.user.data
});

const dispatcher = (dispatch) => ({
});

export default connect(selector, dispatcher)(Account);

'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';

import { environment } from '../config';
import { getUserProfile } from '../actions';
import { apiPropertyDisplay, apiPropertyValue } from '../utils/format';

import App from './app';

class Account extends React.Component {
  componentWillMount () {
    const { user, _getProfile } = this.props;
    _getProfile(user.username);
  }

  renderProfileAttributes (profile) {
    if (!profile.data) return null;
    const attributes = [
      'user.username',
      'user.email',
      'user.first_name',
      'user.last_name',
      'city',
      'org',
      'org_type',
      'department',
      'position',
      'phone_number'
    ];
    const profileData = profile.data.objects[0];
    return attributes.map(a => [
      <dt key={`dt-${a}`}>{apiPropertyDisplay(a)}</dt>,
      <dd key={`dl-${a}`}>{apiPropertyValue(a, profileData)}</dd>
    ]);
  }

  render () {
    return (
      <App className='page--account'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Hello {this.props.user.firstName}</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <div className='prose prose--responsive'>
                <section className='fold'>
                  <div className='inner'>
                    <div className='fold__header'>
                      <h2 className='fold__title'>Account Information</h2>
                      <button className='button '></button>
                    </div>
                    <div className='fold__body'>
                      <dl className='dl--horizontal'>
                        {this.renderProfileAttributes(this.props.profile)}
                      </dl>
                    </div>
                  </div>
                </section>
                <section className='fold'>
                  <div className='inner'>
                    <div className='fold__header'>
                      <h2 className='fold__title'>Subscription Preferences</h2>
                    </div>
                    <div className='fold__body'>
                      <div className='form__group'>
                        <div className='sources-list'>
                        </div>
                      </div>
                      <div className='form__group'>
                        <label className='form__label'>Notifications by Continent</label>
                        <div className='sources-list'>
                        </div>
                      </div>
                      <div className='form__group'>
                        <label className='form__label'>Notifications by Region</label>
                        <div className='sources-list'>
                        </div>
                      </div>
                      <div className='form__group'>
                        <label className='form__label'>Notifications by Country</label>
                        <div className='sources-list'>
                        </div>
                      </div>
                      <div className='form__group'>
                        <label className='form__label'>Notifications by Event Type</label>
                        <div className='sources-list'>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
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
    user: T.object,
    profile: T.object,
    _getProfile: T.func
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  user: state.user.data,
  profile: state.profile
});

const dispatcher = {
  _getProfile: getUserProfile
};

export default connect(selector, dispatcher)(Account);

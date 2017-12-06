'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import Select from 'react-select';
import _set from 'lodash.set';
import _cloneDeep from 'lodash.clonedeep';
import c from 'classnames';

import { environment } from '../config';
import { getUserProfile } from '../actions';
import { countries, disasterType } from '../utils/field-report-constants';
import { apiPropertyDisplay, apiPropertyValue } from '../utils/format';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';

import Fold from '../components/fold';
import { FormCheckboxGroup } from '../components/form-elements/';

import App from './app';

// exclude the first item since it's a dropdown placeholder
const disasterTypes = disasterType.slice(1);

const systemNotificationTypes = [{
  label: 'New records ',
  value: 'new'
}, {
  label: 'Modified records',
  value: 'modified'
}];

const regions = [{
  label: 'Africa',
  value: 0
}, {
  label: 'Asia Pacific',
  value: 2
}, {
  label: 'MENA',
  value: 4
}, {
  label: 'Europe',
  value: 3
}, {
  label: 'Americas',
  value: 1
}];

class Account extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isDirty: false,
      data: {
        regions: regions.map(o => ({
          value: o.value,
          checked: false
        })),
        disasterTypes: disasterTypes.map(o => ({
          value: o.value,
          checked: false
        })),
        countries: [],
        emergency: systemNotificationTypes.map(o => ({
          value: o.value,
          checked: false
        })),
        fieldReport: systemNotificationTypes.map(o => ({
          value: o.value,
          checked: false
        })),
        appeal: systemNotificationTypes.map(o => ({
          value: o.value,
          checked: false
        }))
      }
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount () {
    const { user, _getProfile } = this.props;
    _getProfile(user.username);
    showGlobalLoading();
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.profile.fetching && !nextProps.profile.fetching) {
      hideGlobalLoading();
      // TODO update state from user profile data
    }
  }

  onFieldChange (field, e) {
    let data = _cloneDeep(this.state.data);
    let val = e && e.target ? e.target.value : e;
    _set(data, field, val === '' || val === null ? undefined : val);
    this.setState({isDirty: true, data});
  }

  onSubmit (e) {
    e.preventDefault();
    console.log(this.state.data);
  }

  renderProfileAttributes (profile) {
    if (!profile.data) return null;
    const attributes = [
      'username',
      'email',
      'first_name',
      'last_name',
      'profile.city',
      'profile.org',
      'profile.org_type',
      'profile.department',
      'profile.position',
      'profile.phone_number'
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
              </div>

              <form className='form' onSubmit={this.onSubmit}>
                <Fold title='Subscription preferences'>
                  <FormCheckboxGroup
                    label='Regional notifications'
                    description={'Select one or more regions to receive notifications about.'}
                    name='regions'
                    classWrapper='action-checkboxes'
                    options={regions}
                    values={this.state.data.regions}
                    onChange={this.onFieldChange.bind(this, 'regions')} />

                  <div className='form__group'>
                    <label className='form__label'>Country-level notifications</label>
                    <p className='form__description'>Select one or more countries to receive notifications about.</p>
                    <Select
                      name='countries'
                      value={this.state.data.countries}
                      onChange={this.onFieldChange.bind(this, 'countries')}
                      options={countries}
                      multi />
                  </div>

                  <FormCheckboxGroup
                    label='Disaster types'
                    description={'Get notified about new disasters in these categories.'}
                    name='disasterTypes'
                    classWrapper='action-checkboxes'
                    options={disasterTypes}
                    values={this.state.data.disasterTypes}
                    onChange={this.onFieldChange.bind(this, 'disasterTypes')} />

                  <FormCheckboxGroup
                    label='Emergencies'
                    name='emergency'
                    classWrapper='action-checkboxes'
                    options={systemNotificationTypes}
                    values={this.state.data.emergency}
                    onChange={this.onFieldChange.bind(this, 'emergency')} />

                  <FormCheckboxGroup
                    label='Field Reports'
                    name='fieldReport'
                    classWrapper='action-checkboxes'
                    options={systemNotificationTypes}
                    values={this.state.data.fieldReport}
                    onChange={this.onFieldChange.bind(this, 'fieldReport')} />

                  <FormCheckboxGroup
                    label='Appeals'
                    name='appeal'
                    classWrapper='action-checkboxes'
                    options={systemNotificationTypes}
                    values={this.state.data.appeal}
                    onChange={this.onFieldChange.bind(this, 'appeal')} />

                  <button type='submit' className={c('button', {
                    'button--secondary-raised-dark': this.state.isDirty,
                    'button--secondary-raised-light': !this.state.isDirty
                  })} title='Save'>Save</button>

                </Fold>
              </form>
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

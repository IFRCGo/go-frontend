'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import Select from 'react-select';
import _set from 'lodash.set';
import _cloneDeep from 'lodash.clonedeep';
import c from 'classnames';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import { set } from 'object-path';

import { environment } from '../config';
import {
  getUserProfile,
  updateSubscriptions,
  getFieldReportsByUser,
  updateProfile
} from '../actions';
import { get } from '../utils/utils';
import { countries, disasterType, orgTypes } from '../utils/field-report-constants';
import { apiPropertyDisplay, apiPropertyValue } from '../utils/format';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { showAlert } from '../components/system-alerts';

import Fold from '../components/fold';
import {
  FormCheckboxGroup,
  FormInput
} from '../components/form-elements/';

import App from './app';

const Fragment = React.Fragment;

// Exclude the first item since it's a dropdown placeholder
const disasterTypes = disasterType.slice(1);

// Constants used to create form elements
const systemNotificationTypes = [{
  label: 'New records',
  value: 'new'
}, {
  label: 'Modified records',
  value: 'modified'
}];

const otherNotificationTypes = [{
  label: 'Surge alerts',
  value: 'surge'
}];

const regions = [{
  label: 'Africa',
  value: '0'
}, {
  label: 'Asia Pacific',
  value: '2'
}, {
  label: 'MENA',
  value: '4'
}, {
  label: 'Europe',
  value: '3'
}, {
  label: 'Americas',
  value: '1'
}];

// constants to translate existing subscriptions from the API
const rtypes = {
  0: 'event',
  1: 'appeal',
  2: 'fieldReport',
  3: 'surge',
  4: 'country',
  5: 'region',
  6: 'disasterType'
};

const stypes = {
  0: 'new',
  1: 'modified'
};

// helper to unmark all checkboxes in initial state
const markUnChecked = o => ({
  value: o.value,
  checked: false
});

const updateChecks = (checkboxes, value) => {
  return checkboxes.map(o => ({
    value: o.value,
    checked: o.value === value ? true : o.checked
  }));
};

const profileAttributes = [
  ['username'],
  ['email'],
  ['first_name', 'firstName'],
  ['last_name', 'lastName'],
  ['profile.city', 'city'],
  ['profile.org', 'org'],
  ['profile.org_type', 'orgType'],
  ['profile.department', 'department'],
  ['profile.position', 'position'],
  ['profile.phone_number', 'phoneNumber']
];

class Account extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isNotificationsDirty: false,
      notifications: {
        countries: [],
        regions: regions.map(markUnChecked),
        disasterTypes: disasterTypes.map(markUnChecked),
        event: systemNotificationTypes.map(markUnChecked),
        fieldReport: systemNotificationTypes.map(markUnChecked),
        appeal: systemNotificationTypes.map(markUnChecked),
        other: otherNotificationTypes.map(markUnChecked)
      },

      isProfileDirty: false,
      profileEditMode: false,
      profile: {
        firstName: null,
        lastName: null,
        city: null,
        org: null,
        orgType: null,
        department: null,
        position: null,
        phoneNumber: null
      }
    };
    this.onNotificationSubmit = this.onNotificationSubmit.bind(this);
    this.onProfileSubmit = this.onProfileSubmit.bind(this);
    this.toggleEditProfile = this.toggleEditProfile.bind(this);
  }

  componentDidMount () {
    const { user, _getProfile, _getFieldReportsByUser } = this.props;
    _getProfile(user.username);
    _getFieldReportsByUser(user.id);
    showGlobalLoading();
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.profile.fetching && !nextProps.profile.fetching) {
      hideGlobalLoading();
      if (nextProps.profile.error) {
        showAlert('danger', <p><strong>Error:</strong> Could not load user profile</p>, true, 4500);
      } else {
        this.syncNotificationState(nextProps.profile.notifications);
        this.syncProfileState(nextProps.profile.data);
      }
    }
    if (this.props.profile.updating && !nextProps.profile.updating) {
      hideGlobalLoading();
      if (nextProps.profile.updateError) {
        showAlert('danger', <p><strong>Error:</strong> {nextProps.profile.updateError.detail}</p>, true, 4500);
      } else {
        showAlert('success', <p>Profile updated</p>, true, 4500);
        this.setState({ isNotificationsDirty: false, isProfileDirty: false, profileEditMode: false });
        this.props._getProfile(this.props.user.username);
      }
    }
  }

  syncNotificationState (data) {
    const subscriptions = get(data, 'subscription', []);
    if (!subscriptions.length) {
      return;
    }
    let next = Object.assign({}, this.state.notifications);
    subscriptions.forEach(sub => {
      const rtype = rtypes[sub.rtype];
      if (rtype === 'country' && sub.country) {
        next.countries = next.countries.concat([{label: sub.country.name, value: sub.country.id.toString()}]);
      } else if (rtype === 'region' && sub.region) {
        next.regions = updateChecks(next.regions, sub.region.name.toString());
      } else if (rtype === 'disasterType' && sub.dtype) {
        next.disasterTypes = updateChecks(next.disasterTypes, sub.dtype.id.toString());
      } else if (rtype === 'appeal' || rtype === 'event' || rtype === 'fieldReport') {
        next[rtype] = updateChecks(next[rtype], stypes[sub.stype]);
      } else if (rtype === 'surge') {
        next.other = updateChecks(next.other, 'surge');
      }
    });
    this.setState({ notifications: next });
  }

  syncProfileState (data) {
    const profile = get(data, 'profile', {});
    const next = {
      firstName: data.first_name || null,
      lastName: data.last_name || null,
      city: profile.city || null,
      org: profile.org || null,
      orgType: profile.org_type || null,
      department: profile.department || null,
      position: profile.position || null,
      phoneNumber: profile.phone_number || null
    };
    this.setState({ profile: next });
  }

  onFieldChange (stateProperty, field, e) {
    let state = _cloneDeep(this.state[stateProperty]);
    let val = e && e.target ? e.target.value : e;
    _set(state, field, val === '' || val === null ? undefined : val);
    let dirtyProperty = stateProperty === 'notifications' ? 'isNotificationsDirty' : 'isProfileDirty';
    this.setState({[dirtyProperty]: true, [stateProperty]: state});
  }

  onNotificationSubmit (e) {
    e.preventDefault();
    const payload = this.serializeNotifications(this.state.notifications);
    showGlobalLoading();
    this.props._updateSubscriptions(payload);
  }

  serializeNotifications (notifications) {
    let serialized = ['regions', 'disasterTypes', 'appeal', 'event', 'fieldReport']
      .reduce((acc, currentType) => {
        const flattened = get(notifications, currentType, [])
          .filter(d => d.checked)
          .map(d => ({
            type: currentType,
            value: d.value
          }));
        return acc.concat(flattened);
      }, []);

    let otherNotifications = get(notifications, 'other', []).filter(d => d.checked).map(d => ({
      type: d.value,
      value: true
    }));
    if (otherNotifications.length) {
      serialized.push.apply(serialized, otherNotifications);
    }

    let countries = get(notifications, 'countries', []).map(d => ({
      type: 'countries',
      value: d.value
    }));
    if (countries.length) {
      serialized.push.apply(serialized, countries);
    }

    return serialized;
  }

  onProfileSubmit (e) {
    e.preventDefault();
    showGlobalLoading();
    const id = this.props.profile.data.id;
    this.props._updateProfile(id, this.serializeProfile(profileAttributes.slice(2, profileAttributes.length)));
  }

  serializeProfile (attributes) {
    const serialized = {};
    attributes.forEach(d => {
      let nextValue = this.state.profile[d[1]];
      // check if the value is actually an object, which the dropdowns return.
      nextValue = nextValue && nextValue.hasOwnProperty('value') ? nextValue.value : nextValue;
      nextValue && set(serialized, d[0], nextValue);
    });
    return serialized;
  }

  toggleEditProfile () {
    this.syncProfileState(this.props.profile.data);
    this.setState({ profileEditMode: !this.state.profileEditMode });
  }

  renderProfileAttributes () {
    const { profile } = this.props;
    return (
      <div className='inner'>
        <div className='fold__header'>
          <h2 className='fold__title'>Account Information <button className='button button--large button--secondary-filled' onClick={this.toggleEditProfile}>Edit Profile</button></h2>
        </div>
        <div className='fold__body'>
          <dl className='dl--horizontal'>
            {profile.data ? profileAttributes.map(a => (
              <Fragment key={a[0]}>
                <dt>{apiPropertyDisplay(a[0])}</dt>
                <dd>{apiPropertyValue(a[0], profile.data)}</dd>
              </Fragment>
            )) : null}
          </dl>
          <Link to='/account/password-change'>Change my password</Link>
        </div>
      </div>
    );
  }

  renderProfileForm () {
    const { profile } = this.props;
    return (
      <div className='inner'>
        <div className='fold__header'>
          <h2 className='fold__title'>Edit Profile <button className='button button--large button--secondary-filled' onClick={this.toggleEditProfile}>Cancel</button></h2>
        </div>
        <div className='fold__body'>
          <form className='form' onSubmit={this.onProfileSubmit}>
            <FormInput
              label='First Name'
              type='text'
              name='first-name'
              id='first-name'
              classWrapper='form__group--kv'
              value={profile.firstName}
              onChange={this.onFieldChange.bind(this, 'profile', 'firstName')} >
            </FormInput>
            <FormInput
              label='Last Name'
              type='text'
              name='last-name'
              id='last-name'
              classWrapper='form__group--kv'
              value={profile.lastName}
              onChange={this.onFieldChange.bind(this, 'profile', 'lastName')} >
            </FormInput>
            <FormInput
              label='City'
              type='text'
              name='city'
              id='city'
              classWrapper='form__group--kv'
              value={profile.city}
              onChange={this.onFieldChange.bind(this, 'profile', 'city')} >
            </FormInput>
            <FormInput
              label='Organization'
              type='text'
              name='organization'
              id='organization'
              classWrapper='form__group--kv'
              value={profile.org}
              onChange={this.onFieldChange.bind(this, 'profile', 'org')} >
            </FormInput>
            <div className='form__group'>
              <label className='form__label'>Organization Type</label>
              <Select
                name='organizationType'
                value={profile.orgType}
                onChange={this.onFieldChange.bind(this, 'profile', 'orgType')}
                options={orgTypes} />
            </div>
            <FormInput
              label='Department'
              type='text'
              name='department'
              id='department'
              classWrapper='form__group--kv'
              value={profile.department}
              onChange={this.onFieldChange.bind(this, 'profile', 'department')} >
            </FormInput>
            <FormInput
              label='Position'
              type='text'
              name='position'
              id='position'
              classWrapper='form__group--kv'
              value={profile.position}
              onChange={this.onFieldChange.bind(this, 'profile', 'position')} >
            </FormInput>
            <FormInput
              label='Phone Number'
              type='text'
              name='phone-number'
              id='phone-number'
              classWrapper='form__group--kv'
              value={profile.phoneNumber}
              onChange={this.onFieldChange.bind(this, 'profile', 'phoneNumber')} >
            </FormInput>
            <button type='submit' className={c('button', 'button--large', 'button--secondary-filled', {
              'disabled': !this.state.isProfileDirty
            })} title='Save'>Save</button>
          </form>
        </div>
      </div>
    );
  }

  renderFieldReports () {
    const { user, fieldReport } = this.props;
    const userReports = get(fieldReport, `user-${user.id}`, {
      fetching: false,
      fetched: false,
      error: null
    });
    if (!userReports.fetched) { return null; }
    const data = get(userReports, 'data', []);
    if (!data.length) { return null; }
    return (
      <div className='prose prose--responsive'>
        <section className='fold'>
          <div className='inner'>
            <div className='fold__header'> <h2 className='fold__title'>Submitted Field Reports</h2>
            </div>
            <div className='fold__body'>
              <ul className='report__list'>
                {data.map(o => (
                  <li key={o.id} className='report__list--item'>
                    <div className='report__list--header'>
                      <Link className='link--primary' to={`/reports/${o.id}`}>{o.summary}</Link>&nbsp;
                      <span className='report__list--updated'>Last Updated: {DateTime.fromISO(o.updated_at || o.created_at).toISODate()}</span>
                    </div>
                    <p>{o.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    );
  }

  renderSubscriptionForm () {
    return (
      <form className='form' onSubmit={this.onNotificationSubmit}>
        <Fold title='Subscription preferences'>
          <FormCheckboxGroup
            label='Regional notifications'
            description={'Select one or more regions to receive notifications about.'}
            name='regions'
            classWrapper='action-checkboxes'
            options={regions}
            values={this.state.notifications.regions}
            onChange={this.onFieldChange.bind(this, 'notifications', 'regions')} />
          <div className='form__group'>
            <label className='form__label'>Country-level notifications</label>
            <p className='form__description'>Select one or more countries to receive notifications about.</p>
            <Select
              name='countries'
              value={this.state.notifications.countries}
              onChange={this.onFieldChange.bind(this, 'notifications', 'countries')}
              options={countries}
              multi />
          </div>
          <FormCheckboxGroup
            label='Disaster types'
            description={'Get notified about new disasters in these categories.'}
            name='disasterTypes'
            classWrapper='action-checkboxes'
            options={disasterTypes}
            values={this.state.notifications.disasterTypes}
            onChange={this.onFieldChange.bind(this, 'notifications', 'disasterTypes')} />
          <FormCheckboxGroup
            label='Emergencies'
            name='event'
            classWrapper='action-checkboxes'
            options={systemNotificationTypes}
            values={this.state.notifications.event}
            onChange={this.onFieldChange.bind(this, 'notifications', 'event')} />
          <FormCheckboxGroup
            label='Field Reports'
            name='fieldReport'
            classWrapper='action-checkboxes'
            options={systemNotificationTypes}
            values={this.state.notifications.fieldReport}
            onChange={this.onFieldChange.bind(this, 'notifications', 'fieldReport')} />
          <FormCheckboxGroup
            label='Appeals'
            name='appeal'
            classWrapper='action-checkboxes'
            options={systemNotificationTypes}
            values={this.state.notifications.appeal}
            onChange={this.onFieldChange.bind(this, 'notifications', 'appeal')} />
          <FormCheckboxGroup
            label='Other Notifications'
            name='other'
            classWrapper='action-checkboxes'
            options={otherNotificationTypes}
            values={this.state.notifications.other}
            onChange={this.onFieldChange.bind(this, 'notifications', 'other')} />
          <button type='submit' className={c('button', 'button--large', 'button--secondary-filled', {
            'disabled': !this.state.isNotificationsDirty
          })} title='Save'>Save</button>
        </Fold>
      </form>
    );
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
                  {this.state.profileEditMode ? this.renderProfileForm() : this.renderProfileAttributes()}
                </section>
              </div>
              {this.renderFieldReports()}
              {this.props.profile.fetched && !this.props.profile.error ? this.renderSubscriptionForm() : null}
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
    fieldReport: T.object,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  user: state.user.data,
  profile: state.profile,
  fieldReport: state.fieldReport
});

const dispatcher = {
  _getProfile: getUserProfile,
  _updateSubscriptions: updateSubscriptions,
  _getFieldReportsByUser: getFieldReportsByUser,
  _updateProfile: updateProfile
};

export default connect(selector, dispatcher)(Account);

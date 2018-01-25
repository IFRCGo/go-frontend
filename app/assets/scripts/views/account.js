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

import { environment } from '../config';
import {
  getUserProfile,
  updateSubscriptions,
  getFieldReportsByUser
} from '../actions';
import { get } from '../utils/utils';
import { countries, disasterType } from '../utils/field-report-constants';
import { apiPropertyDisplay, apiPropertyValue } from '../utils/format';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { showAlert } from '../components/system-alerts';

import Fold from '../components/fold';
import { FormCheckboxGroup } from '../components/form-elements/';

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

class Account extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isDirty: false,
      data: {
        countries: [],
        regions: regions.map(markUnChecked),
        disasterTypes: disasterTypes.map(markUnChecked),
        event: systemNotificationTypes.map(markUnChecked),
        fieldReport: systemNotificationTypes.map(markUnChecked),
        appeal: systemNotificationTypes.map(markUnChecked),
        other: otherNotificationTypes.map(markUnChecked)
      }
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.renderSubscriptionForm = this.renderSubscriptionForm.bind(this);
    this.syncNotificationState = this.syncNotificationState.bind(this);
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
        this.syncNotificationState(nextProps.profile.data);
      }
    }
    if (this.props.profile.updating && !nextProps.profile.updating) {
      hideGlobalLoading();
      if (nextProps.profile.updateError) {
        showAlert('danger', <p><strong>Error:</strong> {nextProps.profile.updateError.error_message}</p>, true, 4500);
      } else {
        showAlert('success', <p>Subscriptions updated</p>, true, 4500);
        this.setState({ isDirty: false });
      }
    }
  }

  syncNotificationState (data) {
    const subscriptions = get(data, 'subscription', []);
    if (!subscriptions.length) {
      return;
    }
    let next = Object.assign({}, this.state.data);
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
    this.setState({ data: next });
  }

  onFieldChange (field, e) {
    let data = _cloneDeep(this.state.data);
    let val = e && e.target ? e.target.value : e;
    _set(data, field, val === '' || val === null ? undefined : val);
    this.setState({isDirty: true, data});
  }

  onSubmit (e) {
    e.preventDefault();
    const payload = this.serialize(this.state.data);
    showGlobalLoading();
    this.props._updateSubscriptions(payload);
  }

  serialize (data) {
    let serialized = ['regions', 'disasterTypes', 'appeal', 'event', 'fieldReport']
      .reduce((acc, currentType) => {
        const flattened = get(data, currentType, [])
          .filter(d => d.checked)
          .map(d => ({
            type: currentType,
            value: d.value
          }));
        return acc.concat(flattened);
      }, []);

    let otherNotifications = get(data, 'other', []).filter(d => d.checked).map(d => ({
      type: d.value,
      value: true
    }));
    if (otherNotifications.length) {
      serialized.push.apply(serialized, otherNotifications);
    }

    let countries = get(data, 'countries', []).map(d => ({
      type: 'countries',
      value: d.value
    }));
    if (countries.length) {
      serialized.push.apply(serialized, countries);
    }

    return serialized;
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
    return attributes.map(a => (
      <Fragment key={a}>
        <dt>{apiPropertyDisplay(a)}</dt>
        <dd>{apiPropertyValue(a, profile.data)}</dd>
      </Fragment>
    ));
  }

  renderFieldReports () {
    const { user, fieldReport } = this.props;
    const userReports = get(fieldReport, `user-${user.id}`, {
      fetching: false,
      fetched: false,
      error: null
    });
    if (!userReports.fetched) { return null; }
    const data = get(userReports, 'data.objects', []);
    if (!data.length) { return null; }
    return (
      <Fold title='Submitted Field Reports'>
        <ul>
          {data.map(o => (
            <li key={o.id}>
              <Link to={`/reports/${o.id}/edit`}>{o.summary} Last Updated: {DateTime.fromISO(o.updated_at).toISODate()}</Link>
            </li>
          ))}
        </ul>
      </Fold>
    );
  }

  renderSubscriptionForm () {
    return (
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
            name='event'
            classWrapper='action-checkboxes'
            options={systemNotificationTypes}
            values={this.state.data.event}
            onChange={this.onFieldChange.bind(this, 'event')} />
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
          <FormCheckboxGroup
            label='Other Notifications'
            name='other'
            classWrapper='action-checkboxes'
            options={otherNotificationTypes}
            values={this.state.data.other}
            onChange={this.onFieldChange.bind(this, 'other')} />
          <button type='submit' className={c('button', 'button--large', 'button--secondary-filled', {
            'disabled': !this.state.isDirty
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
                  <div className='inner'>
                    <div className='fold__header'>
                      <h2 className='fold__title'>Account Information</h2>
                    </div>
                    <div className='fold__body'>
                      <dl className='dl--horizontal'>
                        {this.renderProfileAttributes(this.props.profile)}
                      </dl>
                      <Link to='/account/password-change'>Change my password</Link>
                    </div>
                  </div>
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
    _getFieldReportsByUser: T.func
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
  _getFieldReportsByUser: getFieldReportsByUser
};

export default connect(selector, dispatcher)(Account);

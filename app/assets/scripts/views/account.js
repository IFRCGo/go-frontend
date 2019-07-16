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
import { Helmet } from 'react-helmet';
import { Sticky, StickyContainer } from 'react-sticky';

import { environment } from '../config';
import {
  getUserProfile,
  updateSubscriptions,
  getFieldReportsByUser,
  updateProfile,
  getPerCountries,
  getPerDraftDocument,
  getPerDocuments,
  getEventById,
  addSubscriptions,
  delSubscription,
  getPerOverviewForm
} from '../actions';
import { getRegionById } from '../utils/region-constants';
import { get } from '../utils/utils';
import { getCountryMeta } from '../utils/get-country-meta';
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

const basicTypes = [{
  label: 'Weekly Digest',
  value: 'weeklyDigest'
},
{
  label: 'New Disasters',
  value: 'newDisasters'
},
{
  label: 'New Operations',
  value: 'newOperations'
},
{
  label: 'General Announcements',
  value: 'general'
}];

const systemNotificationTypes = [{
  label: 'New records',
  value: 'new'
}, {
  label: 'Modified records',
  value: 'modified'
}];

const surgeNotificationTypes = [{
  label: 'Surge alerts',
  value: 'surge'
},
{
  label: 'Deployment Messages',
  value: 'surgeDM'
},
{
  label: 'Approaching End of Mission',
  value: 'surgeAEM'
}];

const perDueDateTypes = [{
  label: 'PER Due Dates',
  value: 'perDueDate'
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
  6: 'disasterType',
  7: 'perDueDate',
  // 8: 'followedEvent' // could be here
  9: 'surgeDM',
  10: 'surgeAEM',
  11: 'weeklyDigest',
  12: 'newDisasters',
  13: 'newOperations',
  14: 'general'
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
      chosenCountry: {id: 0, society_name: ''},
      isNotificationsDirty: false,
      notifications: {
        countries: [],
        basic: basicTypes.map(markUnChecked),
        regions: regions.map(markUnChecked),
        disasterTypes: disasterTypes.map(markUnChecked),
        event: systemNotificationTypes.map(markUnChecked),
        fieldReport: systemNotificationTypes.map(markUnChecked),
        appeal: systemNotificationTypes.map(markUnChecked),
        surg: surgeNotificationTypes.map(markUnChecked),
        per: perDueDateTypes.map(markUnChecked)
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
    this.changeChosenCountry = this.changeChosenCountry.bind(this);
    this.createRegionGroupedDocumentData = this.createRegionGroupedDocumentData.bind(this);
    this.renderPerFormDocuments = this.renderPerFormDocuments.bind(this);
    this.delSubscription = this.delSubscription.bind(this);
  }

  componentDidMount () {
    const { user, _getProfile, _getFieldReportsByUser, _getPerCountries, _getPerDocuments, _getPerDraftDocument } = this.props;
    _getProfile(user.username);
    _getFieldReportsByUser(user.id);
    _getPerCountries();
    _getPerDocuments();
    const draftQueryFilters = {user: user.id};
    _getPerDraftDocument(draftQueryFilters);
    this.props._getPerOverviewForm();
    showGlobalLoading();
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.profile.receivedAt !== nextProps.profile.receivedAt) {
      if (typeof nextProps.profile.data.subscription !== 'undefined' && nextProps.profile.data.subscription !== null) {
        nextProps.profile.data.subscription.forEach((subscription) => {
          if (typeof subscription.event !== 'undefined' && subscription.event !== null) {
            this.props._getEventById(subscription.event);
          }
        });
      }
    }
    if (this.props.profile.fetching && !nextProps.profile.fetching) {
      hideGlobalLoading();
      if (nextProps.profile.error) {
        showAlert('danger', <p><strong>Error:</strong> Could not load user profile</p>, true, 4500);
      } else {
        this.syncNotificationState(nextProps.profile.data);
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
    if (nextProps.perForm.getPerCountries.fetched && nextProps.perForm.getPerCountries.data.count > 0) {
      this.setState({chosenCountry: {id: nextProps.perForm.getPerCountries.data.results[0].id, society_name: nextProps.perForm.getPerCountries.data.results[0].society_name}});
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
        let countryMeta = getCountryMeta(sub.country);
        next.countries = next.countries.concat([{label: countryMeta.label, value: sub.country.toString()}]);
      } else if (rtype === 'region' && sub.region) {
        next.regions = updateChecks(next.regions, sub.region.toString());
      } else if (rtype === 'disasterType' && sub.dtype) {
        next.disasterTypes = updateChecks(next.disasterTypes, sub.dtype.toString());
      } else if (rtype === 'appeal' || rtype === 'event' || rtype === 'fieldReport') {
        next[rtype] = updateChecks(next[rtype], stypes[sub.stype]);
      } else if (rtype === 'surge') {
        next.surg = updateChecks(next.surg, 'surge');
      } else if (rtype === 'surgeDM') {
        next.surg = updateChecks(next.surg, 'surgeDM');
      } else if (rtype === 'surgeAEM') {
        next.surg = updateChecks(next.surg, 'surgeAEM');
      } else if (rtype === 'perDueDate') {
        next.per = updateChecks(next.per, 'perDueDate');
      } else if (rtype === 'weeklyDigest') {
        next.basic = updateChecks(next.basic, 'weeklyDigest');
      } else if (rtype === 'newDisasters') {
        next.basic = updateChecks(next.basic, 'newDisasters');
      } else if (rtype === 'newOperations') {
        next.basic = updateChecks(next.basic, 'newOperations');
      } else if (rtype === 'general') {
        next.basic = updateChecks(next.basic, 'general');
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
    showGlobalLoading();
    const payload = this.serializeNotifications(this.state.notifications);
    const id = this.props.profile.data.id;
    this.props._updateSubscriptions(id, payload);
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

    let surgeNotifications = get(notifications, 'surg', []).filter(d => d.checked).map(d => ({
      type: d.value,
      value: true
    }));
    if (surgeNotifications.length) {
      serialized.push.apply(serialized, surgeNotifications);
    }

    let perDueDates = get(notifications, 'per', []).filter(d => d.checked).map(d => ({
      type: d.value,
      value: true
    }));
    if (perDueDates.length) {
      serialized.push.apply(serialized, perDueDates);
    }

    let countries = get(notifications, 'countries', []).map(d => ({
      type: 'countries',
      value: d.value
    }));
    if (countries.length) {
      serialized.push.apply(serialized, countries);
    }

    let followedEvents = [];
    Object.keys(this.props.event.event).forEach(event => {
      followedEvents.push({
        type: 'followedEvent',
        value: event
      });
    });
    if (followedEvents.length) {
      serialized.push.apply(serialized, followedEvents);
    }

    let basicNotifications = get(notifications, 'basic', []).filter(d => d.checked).map(d => ({
      type: d.value,
      value: true
    }));
    if (basicNotifications.length) {
      serialized.push.apply(serialized, basicNotifications);
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

  changeChosenCountry (e) {
    let filteredCountry = this.props.perForm.getPerCountries.data.results.filter(country => country.id === parseInt(e.target.value));
    this.setState({chosenCountry: {id: filteredCountry[0].id, society_name: filteredCountry[0].society_name}});
  }

  delSubscription (event) {
    let eventId = event.target.id.substring('followedEvent'.length);
    this.props._clearEvents(eventId);
    this.props._delSubscription(eventId);
    this.forceUpdate();
  }

  renderProfileAttributes () {
    const { profile } = this.props;
    return (
      <div className='inner'>
        <div className='fold__header'>
          <div className='fold__actions'>
            <button className='button button--medium button--secondary-bounded' onClick={this.toggleEditProfile}>Edit Profile</button>
          </div>
          <h2 className='fold__title'>Account Information</h2>
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
        </div>
        <div className='fold__footer'>
          <Link className='link--primary' to='/account/password-change'>Change my password</Link>
        </div>
      </div>
    );
  }

  renderProfileForm () {
    const { profile } = this.state;
    return (
      <div className='inner profile__form'>
        <div className='fold__header'>
          <div className='fold__actions'>
            <button className='button button--medium button--secondary-bounded' onClick={this.toggleEditProfile}>Cancel</button>
          </div>
          <h2 className='fold__title'>Edit Profile</h2>
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
            <div className='form__group form__group--kv'>
              <div className='form__inner-header'>
                <label className='form__label'>Organization Type</label>
              </div>
              <div className='form__inner-body'>
                <Select
                  name='organizationType'
                  value={profile.orgType}
                  onChange={this.onFieldChange.bind(this, 'profile', 'orgType')}
                  options={orgTypes} />
              </div>
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
    const data = get(userReports, 'data.results', []);
    if (!data.length) { return null; }
    return (
      <div className='prose prose--responsive'>
        <div className='fold-container'>
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
              <div className='fold__footer'>
                <p>To delete a field report, contact <a href='mailto:im@ifrc.org'>the IM team</a>.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  renderSubscriptionForm () {
    this.props.profile.data.subscription.filter(subscription => subscription.event !== null);
    const events = [];
    Object.keys(this.props.event.event).forEach(event => {
      events.push(<input type='hidden' name='followedEvent' key={'followedEvent' + event} value={event} />);
    });
    return (
      <form className='form' onSubmit={this.onNotificationSubmit}>
        <div className='fold-container'>
          <Fold title='Subscription preferences'>
            <FormCheckboxGroup
              label='Notification types'
              description={'Set basic notification types.'}
              name='basic'
              classWrapper='action-checkboxes'
              options={basicTypes}
              values={this.state.notifications.basic}
              onChange={this.onFieldChange.bind(this, 'notifications', 'basic')} />
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
              label='Surge Notifications'
              name='surg'
              classWrapper='action-checkboxes'
              options={surgeNotificationTypes}
              values={this.state.notifications.surg}
              onChange={this.onFieldChange.bind(this, 'notifications', 'surg')} />
            <FormCheckboxGroup
              label='Other Notifications'
              name='per'
              classWrapper='action-checkboxes'
              options={perDueDateTypes}
              values={this.state.notifications.per}
              onChange={this.onFieldChange.bind(this, 'notifications', 'per')} />
            {events}
            <button type='submit' className={c('button', 'button--large', 'button--secondary-filled', {
              'disabled': !this.state.isNotificationsDirty
            })} title='Save'>Save</button>
          </Fold>
        </div>
      </form>
    );
  }

  createRegionGroupedDocumentData () {
    const groupedDocuments = {};
    if (this.props.perForm.getPerDocuments.fetched && !!this.props.perForm.getPerDocuments.data && !!this.props.perForm.getPerDocuments.data.results) {
      this.props.perForm.getPerDocuments.data.results.forEach(document => {
        if (document.country !== null && document.country.region !== null) {
          if (!groupedDocuments.hasOwnProperty(document.country.region)) {
            groupedDocuments[document.country.region] = {[document.country.id]: []};
            groupedDocuments[document.country.region][document.country.id].push(document);
          } else {
            if (!groupedDocuments[document.country.region].hasOwnProperty(document.country.id)) {
              groupedDocuments[document.country.region][document.country.id] = [];
            }
            groupedDocuments[document.country.region][document.country.id].push(document);
          }
        }
      });
    }
    return groupedDocuments;
  }

  renderPerFormDocuments (documents) {
    const regions = [];
    Object.keys(documents).forEach((regionKey, regionIndex) => {
      const countries = [];
      Object.keys(documents[regionKey]).forEach((countryKey, countryIndex) => {
        const perDocuments = [];
        let currentCountryName = '';
        if (this.props.perOverviewForm.fetched) {
          this.props.perOverviewForm.data.results.filter(overviewForm => overviewForm.country.id === parseInt(countryKey))
            .forEach((perOverviewForm) => {
              perDocuments.push((<React.Fragment key={'documentoverviewrow' + perOverviewForm.id}>
                <div style={{backgroundColor: '#eaeaea', float: 'left', width: '100%', marginBottom: '1rem', padding: '0.25rem 1rem'}} key={'documentov' + perOverviewForm.id}>
                  Overview - {perOverviewForm.date_of_current_capacity_assessment.substring(0, 10)} - {typeof perOverviewForm.user !== 'undefined' && perOverviewForm.user !== null ? perOverviewForm.user.first_name + ' ' + perOverviewForm.user.last_name : null}
                  <div style={{float: 'right'}}>
                    <Link className='button button--small button--secondary-bounded' to={'/view-per-forms/overview/' + perOverviewForm.id}>View</Link>
                  </div>
                </div>
              </React.Fragment>));
            });
        }
        documents[regionKey][countryKey].forEach((document) => {
          currentCountryName = document.country.name;
          perDocuments.push((<React.Fragment key={'documentrow' + document.code + 'id' + document.id}>
            <div style={{backgroundColor: '#eaeaea', float: 'left', width: '100%', marginBottom: '1rem', padding: '0.25rem 1rem'}} key={'document' + document.id}>
              {document.code.toUpperCase()} - {document.name} - {document.updated_at.substring(0, 10)} - {typeof document.user !== 'undefined' ? document.user.username : null}
              <div style={{float: 'right'}}>
                <Link className='button button--small button--secondary-bounded' to={'/view-per-forms/' + document.code + '/' + document.id}>View</Link>
              </div>
            </div>
          </React.Fragment>));
        });
        countries.push(<div key={'countryDocument' + countryKey}><span style={{fontSize: '1.25rem'}}>{currentCountryName}</span>{perDocuments}<br /></div>);
      });
      regions.push(<div key={'regionDocument' + regionKey}><span style={{fontSize: '1.5rem'}}>{getRegionById(regionKey).name}</span>{countries}<br /></div>);
    });
    return regions;
  }

  renderPerFormsComponent () {
    const countryOptions = [];
    if (this.props.perForm.getPerCountries.fetched && typeof this.props.perForm.getPerCountries.data.results !== 'undefined' && this.props.perForm.getPerCountries.data.results !== null) {
      this.props.perForm.getPerCountries.data.results.forEach(country => {
        const societyName = country.society_name !== null && country.society_name.trim() !== '' ? country.society_name : country.name + ' NS';
        countryOptions.push(<option value={country.id} key={'persociety' + country.id}>{societyName}</option>);
      });
    }
    let documents;
    if (this.props.perForm.getPerDocuments.fetched) {
      documents = this.renderPerFormDocuments(this.createRegionGroupedDocumentData());
    }
    return (<div className='fold-container'>
      <section className='fold' id='per-forms'>
        <div className='inner'>
          <h2 className='fold__title'>New PER Forms</h2>
          Click on the following links to access the PER forms, where you can select individual National Societies.
          <hr /><br />
          Choose National Society:&nbsp;
          <select onChange={this.changeChosenCountry}>
            {countryOptions}
          </select><br/><br />
          <div style={{float: 'left', width: '96%', backgroundColor: '#eaeaea', marginRight: '3%', marginBottom: '3%', textAlign: 'center'}}>
            <Link to={'/per-forms/overview/' + this.state.chosenCountry.id} className='button button--medium button--secondary-bounded'>Overview</Link><br/>
          </div>
          <div style={{float: 'left', width: '30%', backgroundColor: '#eaeaea', marginRight: '3%', marginBottom: '3%', textAlign: 'center'}}>
            <Link to={'/per-forms/policy-strategy/' + this.state.chosenCountry.id} className='button button--medium button--secondary-bounded'>Area 1: Policy and Standards</Link><br/>
          </div>
          <div style={{float: 'left', width: '30%', backgroundColor: '#eaeaea', marginRight: '3%', marginBottom: '3%', textAlign: 'center'}}>
            <Link to={'/per-forms/analysis-and-planning/' + this.state.chosenCountry.id} className='button button--medium button--secondary-bounded'>Area 2: Analysis and Planning</Link><br/>
          </div>
          <div style={{float: 'left', width: '30%', backgroundColor: '#eaeaea', marginRight: '3%', marginBottom: '3%', textAlign: 'center'}}>
            <Link to={'/per-forms/operational-capacity/' + this.state.chosenCountry.id} className='button button--medium button--secondary-bounded'>Area 3: Operation capacity</Link><br/>
          </div>
          <div style={{float: 'left', width: '30%', backgroundColor: '#eaeaea', marginRight: '3%', marginBottom: '3%', textAlign: 'center'}}>
            <Link to={'/per-forms/operational-capacity-2/' + this.state.chosenCountry.id} className='button button--medium button--secondary-bounded'>Area 3: Operational capacity 2</Link><br/>
          </div>
          <div style={{float: 'left', width: '30%', backgroundColor: '#eaeaea', marginRight: '3%', marginBottom: '3%', textAlign: 'center'}}>
            <Link to={'/per-forms/coordination/' + this.state.chosenCountry.id} className='button button--medium button--secondary-bounded'>Area 4: Coordination</Link><br/>
          </div>
          <div style={{float: 'left', width: '30%', backgroundColor: '#eaeaea', marginRight: '3%', marginBottom: '3%', textAlign: 'center'}}>
            <Link to={'/per-forms/operations-support/' + this.state.chosenCountry.id} className='button button--medium button--secondary-bounded'>Area 5: Operations support</Link><br/>
          </div>
          <div style={{clear: 'both'}}></div>
          <hr /><br/><br />
          <h2 className='fold__title'>Active PER Forms</h2>
          <span style={{fontWeight: 'bold'}}>{documents}</span>
          {this.renderDraftDocuments()}
        </div>
      </section>
    </div>);
  }

  renderDraftDocuments () {
    const draftDocuments = [];
    if (this.props.perForm.getPerDraftDocument.fetched) {
      let index = 0;
      if (typeof this.props.perForm.getPerDraftDocument.data.results !== 'undefined' && this.props.perForm.getPerDraftDocument.data.results !== null) {
        this.props.perForm.getPerDraftDocument.data.results.forEach((draftDocument) => {
          let parsedData = null;
          try {
            parsedData = JSON.parse(draftDocument.data.replace(/'/g, '"'));
          } catch (e) {
            console.log('Draft document (' + draftDocument.data + ') parsing failed!', e);
            return;
          }
          draftDocuments.push(
            <div style={{backgroundColor: '#eaeaea', float: 'left', width: '100%', marginBottom: '1rem', padding: '0.25rem 1rem', fontWeight: 'bold'}} key={'draftDocument' + index}>
              {draftDocument.code.toUpperCase()} - {typeof parsedData.name !== 'undefined' ? parsedData.name : null} - {typeof parsedData.submitted_at !== 'undefined' ? parsedData.submitted_at.substring(0, 10) : null} - {typeof draftDocument.user !== 'undefined' ? draftDocument.user.username : null} - {draftDocument.country.name}
              <div style={{float: 'right'}}>
                <Link
                  className='button button--small button--secondary-bounded'
                  to={draftDocument.code === 'overview' ? '/per-forms/overview/' + draftDocument.country.id : '/edit-per-forms/' + draftDocument.code + '/' + draftDocument.user.username + '/' + draftDocument.country.id}>
                  Edit
                </Link>
              </div>
            </div>);
          index++;
        });
      }
    }
    return (<React.Fragment>
      <hr /><br/><br />
      <h2 className='fold__title'>Active drafts</h2>
      {draftDocuments}
    </React.Fragment>);
  }

  renderAccountInformation () {
    return (<div className='prose prose--responsive'>
      <div className='fold-container'>
        <section className='fold' id='account-information'>
          {this.state.profileEditMode ? this.renderProfileForm() : this.renderProfileAttributes()}
        </section>
      </div>
    </div>);
  }

  renderOperationsFollowing () {
    const events = [];
    if (Object.keys(this.props.event.event).length > 0) {
      Object.keys(this.props.event.event).forEach((eventId) => {
        if (this.props.event.event[eventId].fetched) {
          events.push(
            <div key={'operations-component' + eventId} style={{width: '50%', float: 'left', marginBottom: '20px'}}>
              <div style={{width: '70%', float: 'left'}}>
                <Link className={'link--primary'} to={'/emergencies/' + eventId}>{this.props.event.event[eventId].data.name}</Link>
              </div>
              <div style={{width: '30%', float: 'right', textAlign: 'center'}}>
                <button className={'button button--small button--primary-bounded'} onClick={this.delSubscription} id={'followedEvent' + eventId}>Unfollow</button>
              </div>
            </div>
          );
        }
      });
    }
    return (<div className='fold-container'>
      <section className='fold' id='notifications'>
        <div className='inner'>
          <h2 className='fold__title'>Operations following</h2>
          <div>
            <div style={{width: '20%', float: 'left'}}>
              <div>
                Operations currently following
              </div>
            </div>
            <div style={{width: '80%', float: 'left'}}>
              {events}
            </div>
          </div>
        </div>
      </section>
    </div>);
  }

  render () {
    return (
      <App className='page--account'>
        <Helmet>
          <title>IFRC Go - Account</title>
        </Helmet>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Hello {this.props.user.firstName}</h1>
              </div>
            </div>
          </header>
          <StickyContainer>
            <Sticky>
              {({ style, isSticky }) => (
                <div style={style} className={c('inpage__nav', {'inpage__nav--sticky': isSticky})}>
                  <div className='inner'>
                    <ul>
                      <li><a href='#account-information' title='Go to Operations section'>Account Information</a></li>
                      <li><a href='#notifications' title='Go to notifications section'>Notifications</a></li>
                      <li><a href='#per-forms' title='Go to per section'>PER forms</a></li>
                    </ul>
                  </div>
                </div>
              )}
            </Sticky>
          </StickyContainer>
          <div className='inpage__body'>
            <div className='inner'>
              {this.renderOperationsFollowing()}
              {this.renderAccountInformation()}
              {this.renderFieldReports()}
              {this.props.profile.fetched && !this.props.profile.error ? this.renderSubscriptionForm() : null}
              {this.renderPerFormsComponent()}
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
    perForm: T.object,
    event: T.object,
    perOverviewForm: T.object,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _delSubscription: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func,
    _getPerCountries: T.func,
    _getPerDocuments: T.func,
    _getPerDraftDocument: T.func,
    _getEventById: T.func,
    _getPerOverviewForm: T.func,
    _clearEvents: T.func
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  user: state.user.data,
  profile: state.profile,
  fieldReport: state.fieldReport,
  perForm: state.perForm,
  event: state.event,
  eventDeletion: state.subscriptions.delSubscriptions,
  perOverviewForm: state.perForm.getPerOverviewForm
});

const dispatcher = (dispatch) => ({
  _getProfile: (...args) => dispatch(getUserProfile(...args)),
  _updateSubscriptions: (...args) => dispatch(updateSubscriptions(...args)),
  _getFieldReportsByUser: (...args) => dispatch(getFieldReportsByUser(...args)),
  _updateProfile: (...args) => dispatch(updateProfile(...args)),
  _getPerCountries: (...args) => dispatch(getPerCountries(...args)),
  _getPerDocuments: (...args) => dispatch(getPerDocuments(...args)),
  _getEventById: (...args) => dispatch(getEventById(...args)),
  _getPerDraftDocument: (...args) => dispatch(getPerDraftDocument(...args)),
  _addSubscriptions: (...args) => dispatch(addSubscriptions(...args)),
  _delSubscription: (...args) => dispatch(delSubscription(...args)),
  _clearEvents: (eventId) => dispatch({type: 'CLEAR_EVENTS', eventId: eventId}),
  _getPerOverviewForm: (...args) => dispatch(getPerOverviewForm(...args))
});

export default connect(selector, dispatcher)(Account);

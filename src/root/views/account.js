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
import memoize from 'memoize-one';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { environment } from '#config';
import {
  getUserProfile,
  updateSubscriptions,
  getFieldReportsByUser,
  updateProfile,
  getPerCountries,
  getPerDocuments,
  getEventById,
  addSubscriptions,
  delSubscription,
  getPerOverviewFormStrict as getPerOverviewForm,
  getPerMission
} from '#actions';

import { get } from '#utils/utils';
import { getCountryMeta } from '#utils/get-country-meta';
import { countries, orgTypes } from '#utils/field-report-constants';
import { apiPropertyDisplay, apiPropertyValue } from '#utils/format';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';
import { showAlert } from '#components/system-alerts';

import Fold from '#components/fold';
import TabContent from '#components/tab-content';
import PerAccount from '#components/per-forms/per-account';
import BreadCrumb from '../components/breadcrumb';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';
import { countriesSelector, disasterTypesSelectSelector } from '#selectors';

import {
  FormCheckboxGroup,
  FormInput
} from '#components/form-elements/';

import App from './app';

const Fragment = React.Fragment;

// helper to unmark all checkboxes in initial state
const markUnChecked = o => ({
  value: o.value.toString(),
  checked: false
});

const updateChecks = (checkboxes, value) => {
  return checkboxes.map(o => ({
    value: o.value,
    checked: o.value === value ? true : o.checked
  }));
};

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
  12: 'newEmergencies',
  13: 'newOperations',
  14: 'general'
};

const stypes = {
  0: 'new',
  1: 'modified'
};

const profileAttributes = [
  ['username'],
  ['first_name', 'firstName'],
  ['last_name', 'lastName'],
  ['email'],
  ['profile.phone_number', 'phoneNumber'],
  ['profile.city', 'city'],
  ['profile.org', 'org'],
  ['profile.org_type', 'orgType'],
  ['profile.department', 'department'],
  ['profile.position', 'position']
];

class Account extends React.Component {
  constructor (props, context) {
    super(props);

    const { strings } = context;

    // Constants used to create form elements

    this.state = {
      isNotificationsDirty: false,
      isProfileDirty: false,
      profileEditMode: false,
      notifications: {
        countries: [],
        basic: this.getBasicTypes(strings).map(markUnChecked),
        regions: this.getRegions(strings).map(markUnChecked),
        disasterTypes: this.props.disasterTypesSelect.map(markUnChecked),
        event: this.getSystemNotificationTypes(strings).map(markUnChecked),
        fieldReport: this.getSystemNotificationTypes(strings).map(markUnChecked),
        appeal: this.getSystemNotificationTypes(strings).map(markUnChecked),
        surg: this.getSurgeNotificationTypes(strings).map(markUnChecked),
        per: this.getPerDueDateTypes(strings).map(markUnChecked)
      },

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
    this.delSubscription = this.delSubscription.bind(this);
    this.componentIsLoading = true;
  }

  componentDidMount () {
    this.componentIsLoading = true;
    showGlobalLoading();
    const { user, _getProfile, _getFieldReportsByUser, _getPerCountries, _getPerDocuments } = this.props;
    _getProfile(user.username);
    _getFieldReportsByUser(user.id);
    _getPerCountries();
    _getPerDocuments();
    this.props._getPerOverviewForm();
    this.props._getPerMission();
    this.displayTabContent();
  }

  getTabDetails = memoize((strings) => [
    { title: strings.accountInformation, hash: '#account-information' },
    { title: strings.accountNotification, hash: '#notifications' },
    { title: strings.accountPerForms, hash: '#per-forms' }
  ])

  getBasicTypes = memoize((strings) => [
    {
      label: strings.accountWeeklyDigest,
      value: 'weeklyDigest',
      description: strings.accountWeeklyDigestDescription,
    },
    {
      label: strings.accountNewEmergencies,
      value: 'newEmergencies',
      description: strings.accountNewEmergenciesDescription,
    },
    {
      label: strings.accountNewOperation,
      value: 'newOperations',
      description: strings.accountNewOperationDescription,
    },
    {
      label: strings.accountGeneralAnnouncements,
      value: 'general'
    }
  ])

  getSystemNotificationTypes = memoize((strings) => [
    {
      label: strings.accountNewRecords,
      value: 'new'
    }, {
      label: strings.accountModifiedRecords,
      value: 'modified'
    }
  ])

  getSurgeNotificationTypes = memoize((strings) => [
    {
      label: strings.accountSurgeAlerts,
      value: 'surge'
    },
    {
      label: strings.accountDeplyomentMessages,
      value: 'surgeDM'
    },
    {
      label: strings.accountsurgeAEM,
      value: 'surgeAEM'
    }
  ])

  getPerDueDateTypes = memoize((strings) => [
    {
      label: strings.accountPerDueDate,
      value: 'perDueDate'
    }
  ])
  
  getRegions = memoize((strings) => [
    {
      label: strings.accountRegionAfrica,
      value: '0'
    },
    {
      label: strings.accountRegionAsia,
      value: '2'
    },
    {
      label: strings.accountRegionMENA,
      value: '4'
    },
    {
      label: strings.accountRegionEurope,
      value: '3'
    },
    {
      label: strings.accountRegionAmerica,
      value: '1'
    },
  ])


  // Sets default tab if url param is blank or incorrect
  displayTabContent () {
    const { strings } = this.context;

    const tabHashArray = this.getTabDetails(strings).map(({ hash }) => hash);
    if (!tabHashArray.find(hash => hash === this.props.location.hash)) {
      this.props.history.replace(`${this.props.location.pathname}${tabHashArray[0]}`);
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.profile.receivedAt !== nextProps.profile.receivedAt) {
      if (typeof nextProps.profile.data !== 'undefined' && nextProps.profile.data !== null && typeof nextProps.profile.data.subscription !== 'undefined' && nextProps.profile.data.subscription !== null) {
        nextProps.profile.data.subscription.forEach((subscription) => {
          if (typeof subscription.event !== 'undefined' && subscription.event !== null) {
            this.props._getEventById(subscription.event);
          }
        });
      }
    }
    if (this.props.profile.fetching && !nextProps.profile.fetching) {
      if (nextProps.profile.error) {
        showAlert('danger', <p><strong><Translate stringId='accountError'/></strong><Translate stringId='accountCouldNotLoad'/></p>, true, 4500);
      } else {
        this.syncNotificationState(nextProps.profile.data);
        this.syncProfileState(nextProps.profile.data);
      }
    }
    if (this.props.profile.updating && !nextProps.profile.updating) {
      if (nextProps.profile.updateError) {
        showAlert('danger', <p><strong><Translate stringId='accountError' /></strong> {nextProps.profile.updateError.detail}</p>, true, 4500);
      } else {
        showAlert('success', <p><Translate stringId='accountUpdated'/></p>, true, 4500);
        this.setState({ isNotificationsDirty: false, isProfileDirty: false, profileEditMode: false });
        this.props._getProfile(this.props.user.username);
      }
    }

    if (nextProps.profile.fetched === true) {
      hideGlobalLoading();
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
        let countryMeta = getCountryMeta(sub.country, this.props.allCountries);
        if (countryMeta && !next.countries.some((country) => country.value === countryMeta.value)) {
          next.countries = next.countries.concat([{ label: countryMeta.label, value: sub.country.toString() }]);
        }
      } else if (rtype === 'region' && (sub.region || sub.region === 0)) {
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
      } else if (rtype === 'newEmergencies') {
        next.basic = updateChecks(next.basic, 'newEmergencies');
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
    this.setState({ [dirtyProperty]: true, [stateProperty]: state });
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
    this.props._updateProfile(id, this.serializeProfile(profileAttributes.slice(1, profileAttributes.length)));
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

  delSubscription (event) {
    let eventId = event.target.id.substring('followedEvent'.length);
    this.props._clearEvents(eventId);
    this.props._delSubscription(eventId);
    this.forceUpdate();
  }

  isPerPermission () {
    return (typeof this.props.user.username !== 'undefined' && this.props.user.username !== null) &&
      (this.props.getPerMission !== 'undefined' && this.props.getPerMission.fetched && this.props.getPerMission.data.count > 0);
  }

  renderProfileAttributes () {
    const { profile } = this.props;
    return (
      <div className='inner'>
        <div className='fold__header'>
          <div className='fold__actions'>
            <button className='button button--small button--secondary-bounded' onClick={this.toggleEditProfile}>
              <Translate stringId='accountEditProfile'/>
            </button>
          </div>
          <h2 className='fold__title'>
            <Translate stringId='accountInformation'/>
          </h2>
        </div>
        <div className='fold__body'>
          <dl className='dl--horizontal'>
            {profile.data ? profileAttributes.map(a => (
              <Fragment key={a[0]}>
                <dt className='form__label__uppercase'>{apiPropertyDisplay(a[0])}</dt>
                <dd>{apiPropertyValue(a[0], profile.data)}</dd>
              </Fragment>
            )) : null}
          </dl>
        </div>
        <div className='fold__footer text-right'>
          <Link className='button button--small button--secondary-light' to='/account/password-change'>
            <Translate stringId='accountChangePassword'/>
          </Link>
        </div>
      </div>
    );
  }

  renderProfileForm () {
    const { profile } = this.state;
    const { strings } = this.context;
    return (
      <div className='inner profile__form container-xs margin-reset'>
        <div className='fold__header'>
          <div className='fold__actions'>
            <button className='button button--small button--secondary-bounded' onClick={this.toggleEditProfile}>
              <Translate stringId='accountCancel'/>
            </button>
          </div>
          <h2 className='fold__title'>
            <Translate stringId='accountEditProfile'/>
          </h2>
        </div>
        <div className='fold__body'>
          <form className='form' onSubmit={this.onProfileSubmit}>
            <FormInput
              label={strings.accountFirstName}
              type='text'
              name='first-name'
              id='first-name'
              classWrapper='form__group__fr'
              value={profile.firstName}
              onChange={this.onFieldChange.bind(this, 'profile', 'firstName')} >
            </FormInput>
            <FormInput
              label={strings.accountLastName}
              type='text'
              name='last-name'
              id='last-name'
              classWrapper='form__group__fr'
              value={profile.lastName}
              onChange={this.onFieldChange.bind(this, 'profile', 'lastName')} >
            </FormInput>
            <FormInput
              label={strings.accountPhoneNumber}
              type='text'
              name='phone-number'
              id='phone-number'
              classWrapper='form__group__fr'
              value={profile.phoneNumber}
              onChange={this.onFieldChange.bind(this, 'profile', 'phoneNumber')} >
            </FormInput>
            <FormInput
              label={strings.accountCity}
              type='text'
              name='city'
              id='city'
              classWrapper='form__group__fr'
              value={profile.city}
              onChange={this.onFieldChange.bind(this, 'profile', 'city')} >
            </FormInput>
            <FormInput
              label={strings.accountOrganization}
              type='text'
              name='organization'
              id='organization'
              classWrapper='form__group__fr'
              value={profile.org}
              onChange={this.onFieldChange.bind(this, 'profile', 'org')} >
            </FormInput>
            <div className='form__group form__group__fr'>
              <div className='form__group__wrap'>
                <div className='form__inner-header'>
                  <label className='form__label'>
                    <Translate stringId='accountOrganizationType'/>
                  </label>
                </div>
                <div className='form__inner-body'>
                  <Select
                    name='organizationType'
                    value={profile.orgType}
                    onChange={this.onFieldChange.bind(this, 'profile', 'orgType')}
                    options={orgTypes} />
                </div>
              </div>
            </div>
            <FormInput
              label={strings.accountDepartment}
              type='text'
              name='department'
              id='department'
              classWrapper='form__group__fr'
              value={profile.department}
              onChange={this.onFieldChange.bind(this, 'profile', 'department')} >
            </FormInput>
            <FormInput
              label={strings.accountPosition}
              type='text'
              name='position'
              id='position'
              classWrapper='form__group__fr'
              value={profile.position}
              onChange={this.onFieldChange.bind(this, 'profile', 'position')} >
            </FormInput>
            <div className='text-center'>
              <button type='submit' className={c('button', 'button--large', 'button--secondary-filled', {
                'disabled': !this.state.isProfileDirty
              })} title={strings.accountProfileFormSubmitButtonTooltip}>
                <Translate stringId='accountSave'/>
              </button>
            </div>
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
      <div className='prose'>
        <div className='fold-container'>
          <section className='fold fold--main'>
            <div className='container-lg'>
              <div className='fold__header'>
                <h2 className='fold__title margin-reset'>
                  <Translate stringId='accountSubmittedReports'/>
                </h2>
                <hr />
              </div>
              <div className='fold__body'>
                <ul className='report__list'>
                  {data.map(o => (
                    <li key={o.id} className='report__list--item'>
                      <div className='report__list--header list__each__block flex'>
                        <div>
                          <Link className='link-underline' to={`/reports/${o.id}`}>{o.summary}</Link>&nbsp;
                          <div className='report__list--updated global-margin-t'>
                            <Translate
                              stringId='accountReportListLastUpdated'
                              params={{
                                on: DateTime.fromISO(o.updated_at || o.created_at).toISODate(),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <p>{o.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='fold__footer'>
                <p><Translate stringId='accountDeleteContact'/> <a href='mailto:im@ifrc.org'><Translate stringId='accountDeleteInfo'/></a></p>
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
    const { strings } = this.context;
    Object.keys(this.props.event.event).forEach(event => {
      events.push(<input type='hidden' name='followedEvent' key={'followedEvent' + event} value={event} />);
    });
    return (
      <form className='form' onSubmit={this.onNotificationSubmit}>
        <div className='fold-container'>
          <Fold title={strings.accountSubscriptionPreferences} foldTitleClass='margin-reset' foldWrapperClass='fold--main'>
            <FormCheckboxGroup
              label={strings.accountSubscriptionTypes}
              description={strings.accountSubscriptionTypesDescription}
              name='basic'
              classWrapper='action-checkboxes'
              options={this.getBasicTypes(strings)}
              values={this.state.notifications.basic}
              onChange={this.onFieldChange.bind(this, 'notifications', 'basic')} />
            <FormCheckboxGroup
              label={strings.accountRegionalNotification}
              description={strings.accountRegionalNotificationDescription}
              name='regions'
              classWrapper='action-checkboxes'
              options={this.getRegions(strings)}
              values={this.state.notifications.regions}
              onChange={this.onFieldChange.bind(this, 'notifications', 'regions')} />
            <div className='form__group'>
              <label className='form__label'>
                <Translate stringId='accountCountryLevel'/>
              </label>
              <p className='form__description'>
                <Translate stringId='accountCountryLevelDescription'/>
              </p>
              <Select
                name='countries'
                value={this.state.notifications.countries}
                onChange={this.onFieldChange.bind(this, 'notifications', 'countries')}
                options={countries(this.props.allCountries)}
                multi />
            </div>
            <FormCheckboxGroup
              label={strings.accountDisasterCategory}
              description={strings.accountDisasterCategoryDescription}
              name='disasterTypes'
              classWrapper='action-checkboxes'
              options={this.props.disasterTypesSelect.map(dt => ({ value: dt.value.toString(), label: dt.label }))}
              values={this.state.notifications.disasterTypes}
              onChange={this.onFieldChange.bind(this, 'notifications', 'disasterTypes')} />
            {/*
               <FormCheckboxGroup
               label='Emergencies'
               name='event'
               classWrapper='action-checkboxes'
               options={getSystemNotificationTypes(strings)}
               values={this.state.notifications.event}
               onChange={this.onFieldChange.bind(this, 'notifications', 'event')} />
               <FormCheckboxGroup
               label='Field Reports'
               name='fieldReport'
               classWrapper='action-checkboxes'
               options={getSystemNotificationTypes(strings)}
               values={this.state.notifications.fieldReport}
               onChange={this.onFieldChange.bind(this, 'notifications', 'fieldReport')} />
               <FormCheckboxGroup
               label='Appeals'
               name='appeal'
               classWrapper='action-checkboxes'
               options={getSystemNotificationTypes(strings)}
               values={this.state.notifications.appeal}
               onChange={this.onFieldChange.bind(this, 'notifications', 'appeal')} />
             */}
            <FormCheckboxGroup
              label={strings.accountSurgeNotification}
              name='surg'
              classWrapper='action-checkboxes'
              options={this.getSurgeNotificationTypes(strings)}
              values={this.state.notifications.surg}
              onChange={this.onFieldChange.bind(this, 'notifications', 'surg')} />
            {this.isPerPermission()
             ? <FormCheckboxGroup
                 label={strings.acccountOtherNotification}
                 name='per'
                 classWrapper='action-checkboxes'
                 options={this.getPerDueDateTypes(strings)}
                 values={this.state.notifications.per}
                 onChange={this.onFieldChange.bind(this, 'notifications', 'per')} />
             : null}
            {events}
            <div className="text-center">
              <button type='submit' className={c('button', 'button--large', 'button--secondary-filled', {
                'disabled': !this.state.isNotificationsDirty
              })} title={strings.accountSave}><Translate stringId='accountSave'/></button>
            </div>
          </Fold>
        </div>
      </form>
    );
  }

  renderAccountInformation () {
    return (<div className='prose'>
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
            <div key={'operations-component' + eventId} className='account__op__block col col-6-mid'>
              <div className='row flex-sm'>
                <div className='account__op__each__link col col-8-sm'>
                  <Link className={'link-underline'} to={'/emergencies/' + eventId}>{this.props.event.event[eventId].data.name}</Link>
                </div>
                <div className='account__op__each__button col col-4-sm'>
                  <button className={'button button--small button--primary-bounded btn--span-clickthrough'} onClick={this.delSubscription} id={'followedEvent' + eventId}>
                    <Translate stringId='accountUnfollow'/>
                  </button>
                </div>
              </div>
            </div>
          );
        }
      });
    }
    return (
      <div className='fold-container'>
        <section className='fold' id='notifications'>
          <div className='inner'>
            <h2 className='fold__title spacing-b'>
              <Translate stringId='accountOperationFollowing'/>
            </h2>
            <div className='row flex-sm'>
              <div className='account__op__title col col-3-sm'>
                <div className='text-uppercase'>
                  <Translate stringId='accountCurrentlyFollowing'/>
                </div>
              </div>
              <div className='account__op__links col col-9-sm row flex-mid'>
                {events}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  handleTabChange (index) {
    const { strings } = this.context;
    const tabHashArray = this.getTabDetails(strings).map(({ hash }) => hash);
    const url = this.props.location.pathname;
    this.props.history.replace(`${url}${tabHashArray[index]}`);
  }

  render () {
    const { strings } = this.context;
    return (
      <App className='page--account'>
        <Helmet>
          <title>
            {strings.accountTitle}
          </title>
        </Helmet>
        <BreadCrumb crumbs={[
          {link: '/account', name: strings.breadCrumbAccount},
          {link: '/', name: strings.breadCrumbHome}
        ]} />
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>
                  <Translate
                    stringId="accountUserGreeting"
                    params={{
                      user: this.props.user.firstName,
                    }}
                  />
                </h1>
              </div>
            </div>
          </header>
          <div className='tab__wrap'>
            <Tabs
              selectedIndex={this.getTabDetails(strings).map(({ hash }) => hash).indexOf(this.props.location.hash)}
              onSelect={index => this.handleTabChange(index)}
            >
              <TabList>
                {this.getTabDetails(strings).map(tab => (
                  <Tab key={tab.title}>{tab.title}</Tab>
                ))}
              </TabList>

              <div className='inpage__body'>
                <div className='inner'>
                  <TabPanel>
                    <TabContent>
                      <div className='container-lg'>
                        {this.renderOperationsFollowing()}
                      </div>
                      <div className='container-lg'>
                        {this.renderAccountInformation()}
                      </div>
                    </TabContent>
                  </TabPanel>
                  <TabPanel>
                    <TabContent>
                      <div className='container-lg'>
                        {this.renderFieldReports()}
                      </div>
                    </TabContent>
                    <TabContent isError={this.props.profile.fetched && this.props.profile.error} errorMessage={strings.accountSubscriptionError} title={strings.accountSubscriptionTitle}>
                      <div className='container-lg'>
                        {this.props.profile.fetched && this.renderSubscriptionForm()}
                      </div>
                    </TabContent>
                  </TabPanel>
                  <TabPanel>
                    <TabContent isError={!this.isPerPermission()} errorMessage={strings.accountPerError} title={strings.accountPerTitle}>
                      <PerAccount user={this.props.user} />
                    </TabContent>
                  </TabPanel>
                </div>
              </div>
            </Tabs>
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
    history: T.object,
    location: T.object,
    perOverviewForm: T.object,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _delSubscription: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func,
    _getPerCountries: T.func,
    _getPerDocuments: T.func,
    _getEventById: T.func,
    _getPerOverviewForm: T.func,
    _clearEvents: T.func,
    _getPerMission: T.func,
    getPerMission: T.object
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
  perOverviewForm: state.perForm.getPerOverviewForm,
  getPerMission: state.perForm.getPerMission,
  allCountries: countriesSelector(state),
  disasterTypesSelect: disasterTypesSelectSelector(state),
  disasterTypes: state.disasterTypes
});

const dispatcher = (dispatch) => ({
  _getProfile: (...args) => dispatch(getUserProfile(...args)),
  _updateSubscriptions: (...args) => dispatch(updateSubscriptions(...args)),
  _getFieldReportsByUser: (...args) => dispatch(getFieldReportsByUser(...args)),
  _updateProfile: (...args) => dispatch(updateProfile(...args)),
  _getPerCountries: (...args) => dispatch(getPerCountries(...args)),
  _getPerDocuments: (...args) => dispatch(getPerDocuments(...args)),
  _getEventById: (...args) => dispatch(getEventById(...args)),
  _addSubscriptions: (...args) => dispatch(addSubscriptions(...args)),
  _delSubscription: (...args) => dispatch(delSubscription(...args)),
  _clearEvents: (eventId) => dispatch({ type: 'CLEAR_EVENTS', eventId: eventId }),
  _getPerOverviewForm: (...args) => dispatch(getPerOverviewForm(...args)),
  _getPerMission: (...args) => dispatch(getPerMission(...args))
});

Account.contextType = LanguageContext;
export default connect(selector, dispatcher)(Account);

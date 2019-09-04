'use strict';
import * as url from 'url';
import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';
import _toNumber from 'lodash.tonumber';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Helmet } from 'react-helmet';

import { api, environment } from '../config';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import {
  getEventById,
  getEventSnippets,
  getSitrepsByEventId,
  getSitrepTypes,
  getAppealDocsByAppealIds,
  addSubscriptions,
  delSubscription,
  getUserProfile
} from '../actions';
import {
  commaSeparatedNumber as n,
  separateUppercaseWords as separate,
  nope,
  isoDate,
  timestamp,
  noSummary
} from '../utils/format';
import {
  get,
  mostRecentReport,
  dateOptions,
  datesAgo,
  getRecordsByType
} from '../utils/utils/';

import App from './app';
import Fold from '../components/fold';
import TabContent from '../components/tab-content';
import ErrorPanel from '../components/error-panel';
import Expandable from '../components/expandable';
import { FilterHeader } from '../components/display-table';
import { Snippets } from '../components/admin-area-elements';
import SurgeAlertsTable from '../components/connected/alerts-table';
import PersonnelTable from '../components/connected/personnel-table';
import EruTable from '../components/connected/eru-table';
import EmergencyMap from '../components/map/emergency-map';
import { NO_DATA } from '../utils/constants';

const TAB_DETAILS = [
  { title: 'Emergency Details', hash: '#details' },
  { title: 'Additional Information', hash: '#additional-info' }
];

class Emergency extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      selectedAppeal: null,
      sitrepFilters: {
        date: 'all',
        type: 'all'
      },
      subscribed: false
    };
    this.handleSitrepFilter = this.handleSitrepFilter.bind(this);
    this.addSubscription = this.addSubscription.bind(this);
    this.delSubscription = this.delSubscription.bind(this);
    this.isSubscribed = this.isSubscribed.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.location.hash !== nextProps.location.hash) {
      const top = window.pageYOffset !== undefined ? window.pageYOffset : window.scrollTop;
      window.scrollTo(0, top - 90);
    }

    if (this.props.match.params.id !== nextProps.match.params.id) {
      return this.getEvent(nextProps.match.params.id);
    }

    if (this.props.event.fetching && !nextProps.event.fetching) {
      hideGlobalLoading();
      this.getAppealDocuments(nextProps.event);
    }

    if (!this.props.profile.fetched && nextProps.profile.fetched) {
      this.setState({ subscribed: this.isSubscribed(nextProps) });
    }
  }

  componentDidMount () {
    this.getEvent(this.props.match.params.id);
    this.props._getSitrepTypes();
    if (this.props.isLogged) {
      this.props._getUserProfile(this.props.user.data.username);
    }
    this.displayTabContent();
  }

  // Sets default tab if url param is blank or incorrect
  displayTabContent () {
    const tabHashArray = TAB_DETAILS.map(({ hash }) => hash);
    if (!tabHashArray.find(hash => hash === this.props.location.hash)) {
      this.props.history.replace(`${this.props.location.pathname}${tabHashArray[0]}`);
    }
  }

  getEvent (id) {
    showGlobalLoading();
    this.props._getEventById(id);
    this.props._getEventSnippets(id);
    this.props._getSitrepsByEventId(id);
  }

  getAppealDocuments (event) {
    const appealIds = get(event, 'data.appeals', []).map(o => o.id);
    if (appealIds.length) {
      this.props._getAppealDocsByAppealIds(appealIds, event.data.id);
    }
  }

  onAppealClick (id, e) {
    e.preventDefault();
    this.setState({ selectedAppeal: id });
  }

  handleSitrepFilter (state, value) {
    const next = Object.assign({}, this.state.sitrepFilters, {
      [state]: value
    });

    const { date, type } = next;
    let filters = {};
    if (date !== 'all') {
      filters.created_at__gte = datesAgo[date]();
    }
    if (type !== 'all') {
      filters.type = type;
    }
    this.props._getSitrepsByEventId(this.props.match.params.id, filters);
    this.setState({ sitrepFilters: next });
  }

  isSubscribed (nextProps) {
    if (nextProps.profile.fetched) {
      const filtered = nextProps.profile.data.subscription.filter(subscription => subscription.event === parseInt(this.props.match.params.id));
      if (filtered.length > 0) {
        return true;
      }
    }
    return false;
  }

  renderMustLogin () {
    return (
      <React.Fragment>
        <p>You must be logged in to view this. <Link key='login' to={{ pathname: '/login', state: { from: this.props.location } }} className='link--primary' title='Login'>Login</Link></p>
      </React.Fragment>
    );
  }

  renderFieldReportStats () {
    const report = mostRecentReport(get(this.props, 'event.data.field_reports'));
    const hideIt = get(this.props, 'event.data.hide_attached_field_reports');
    if (!report || hideIt) return null;
    const numAffected = parseInt(get(report, 'num_affected')) || parseInt(get(report, 'gov_num_affected')) || parseInt(get(report, 'other_num_affected'));
    const numInjured = parseInt(get(report, 'num_injured')) || parseInt(get(report, 'gov_num_injured')) || parseInt(get(report, 'other_num_injured'));
    const numDead = parseInt(get(report, 'num_dead')) || parseInt(get(report, 'gov_num_dead')) || parseInt(get(report, 'other_num_dead'));
    const numMissing = parseInt(get(report, 'num_missing')) || parseInt(get(report, 'gov_num_missing')) || parseInt(get(report, 'other_num_missing'));
    const numDisplaced = parseInt(get(report, 'num_displaced')) || parseInt(get(report, 'gov_num_displaced')) || parseInt(get(report, 'other_num_displaced'));
    const numAssisted = parseInt(get(report, 'num_assisted')) || parseInt(get(report, 'gov_num_assisted')) || parseInt(get(report, 'other_num_assisted'));
    return (
      <div className='inpage__header-col'>
        <h3>Emergency Overview</h3>
        <div className='content-list-group'>
          <ul className='content-list'>
            <li>Affected<span className='content-highlight'>{n(numAffected)}</span></li>
            <li>Injured<span className='content-highlight'>{n(numInjured)}</span></li>
            <li>Dead<span className='content-highlight'>{n(numDead)}</span></li>
            <li>Missing<span className='content-highlight'>{n(numMissing)}</span></li>
            <li>Displaced<span className='content-highlight'>{n(numDisplaced)}</span></li>
          </ul>
          <ul className='content-list'>
            <li>Assisted<span className='content-highlight'>{n(numAssisted)}</span></li>
            <li>Local staff<span className='content-highlight'>{n(get(report, 'num_localstaff'))}</span></li>
            <li>Volunteers<span className='content-highlight'>{n(get(report, 'num_volunteers'))}</span></li>
            <li>Expat delegates<span className='content-highlight'>{n(get(report, 'num_expats_delegates'))}</span></li>
          </ul>
        </div>
        <p className='emergency__source'>Source: <Link to={`/reports/${report.id}`}>{report.summary}, {timestamp(report.updated_at || report.created_at)}</Link></p>
      </div>
    );
  }

  renderHeaderStats () {
    const { appeals } = this.props.event.data;
    const selected = this.state.selectedAppeal;

    let stats = {
      beneficiaries: 0,
      funded: 0,
      requested: 0
    };
    stats = appeals.filter(o => {
      return selected ? o.id === selected : true;
    }).reduce((acc, o) => {
      acc.beneficiaries += _toNumber(o.num_beneficiaries);
      acc.funded += _toNumber(o.amount_funded);
      acc.requested += _toNumber(o.amount_requested);
      return acc;
    }, stats);

    return (
      <div className="inpage__introduction">
        <ul className='introduction-nav'>
          <li className={c('introduction-nav-item', { 'introduction-nav-item--active': selected === null })}>
            <a href='#' title='Show stats for all appeals' onClick={this.onAppealClick.bind(this, null)}>All Appeals</a>
          </li>
          {appeals.map(o => (
            <li key={o.id} className={c('introduction-nav-item', { 'introduction-nav-item--active': o.id === selected })}>
              <a href='#' title={`Show stats for appeal ${o.name}`} onClick={this.onAppealClick.bind(this, o.id)}>{o.name}</a>
            </li>
          ))}
        </ul>
        <div className='inpage__header-col'>
          <div className='inpage__headline-stats'>
            <ul className='stats-list'>
              <li className='stats-list__item stats-emergencies'>
                {n(stats.beneficiaries)}<small>People Targeted</small>
              </li>
              <li className='stats-list__item stats-funding stat-borderless stat-double'>
                {n(stats.requested)}<small>Funding Requirements (CHF)</small>
              </li>
              <li className='stats-list__item stat-double'>
                {n(stats.funded)}<small>Funding (CHF)</small>
              </li>
            </ul>
          </div>
        </div>
        {this.renderFieldReportStats()}
        <div className='funding-chart'>
        </div>
      </div>
    );
  }

  renderFieldReports () {
    const { data } = this.props.event;
    if (!this.props.isLogged) {
      return (
        <Fold id='field-reports' title='Field Reports' wrapperClass='event-field-reports' >
          {this.renderMustLogin()}
        </Fold>
      );
    } else if (data.field_reports && data.field_reports.length) {
      return (
        <Fold id='field-reports' title={`Field Reports (${data.field_reports.length})`} wrapperClass='event-field-reports' >
          <table className='table table--zebra'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Countries</th>
                <th>Regions</th>
              </tr>
            </thead>
            <tbody>
              {data.field_reports.map(o => (
                <tr key={o.id}>
                  <td>{isoDate(o.created_at)}</td>
                  <td><Link to={`/reports/${o.id}`} className='link--primary' title='View Field Report'>{o.summary || noSummary}</Link></td>
                  <td>
                    {Array.isArray(o.countries) ? o.countries.map(c => (
                      <Link to={`/countries/${c.id}`} key={c.id} className='link--primary'>{c.name} </Link>
                    )) : nope}
                  </td>
                  <td>
                    {Array.isArray(o.regions) ? o.regions.map(r => (
                      <Link to={`/regions/${r.id}`} key={r.id} className='link--primary'>{r.name} </Link>
                    )) : nope}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Fold>
      );
    }
    return null;
  }

  renderReports (className, reportTypes) {
    Object.keys(reportTypes).map(reportTypeId => console.log(reportTypes[reportTypeId].items));
    return (
      <div className='response__doc__block'>
        <div className='clearfix'>
          {
            Object.keys(reportTypes).map(reportTypeId => { return (
              <div className='response__doc__col'>
                <div className='response__doc__each'>
                  <div className='response__doc__title'>{reportTypes[reportTypeId].title}</div>
                  <div className='response__doc__inner scrollbar__custom'>
                    {reportTypes[reportTypeId].hasOwnProperty('items') && reportTypes[reportTypeId].items.length > 0 ? reportTypes[reportTypeId].items.map(item => {
                      return (
                        <div className='response__doc__item'>
                          {item.name}
                          <a className='collecticon-download response__doc__item__link' target='_blank' href={item.document}>
                          </a>
                        </div>                        
                      );
                    }) : <div className='response__doc__item'>No documents added</div> }
                  </div>
                </div>
              </div> 
            )})
          }
        </div>
      </div>
    );
  }


  renderResponseDocuments () {
    const data = get(this.props.situationReports, 'data.results', []);
    const { date, type } = this.state.sitrepFilters;
    // return empty when no data, only on default filters.
    if (!data.length && date === 'all' && type === 'all') return null;
    const { id } = this.props.match.params;
    const addReportLink = url.resolve(api, `admin/api/event/${id}/change`);
    const types = this.props.situationReportTypes;
    if (!types.fetched) { return null; }
    const reportsByType = getRecordsByType(types, data);
    console.log('reports by type', reportsByType);
    return (
      <Fold id='response-documents'
        header={() => (
          <div className='fold__headline'>
            <div className='fold__actions'>
              <a className='button button--primary-bounded' href={addReportLink} target='_blank'>Add a Report</a>
            </div>
            <h2 className='fold__title'>Response Documents</h2>
          </div>
        )} >
        <div>
          {/*
          <div className='fold__filters'>
            <FilterHeader id='sitrep-date' title='Created At'
              options={dateOptions}
              filter={date}
              onSelect={this.handleSitrepFilter.bind(this, 'date')} />
            {types.fetched && !types.error ? <FilterHeader id='sitrep-type' title='Document Type'
              options={[{ value: 'all', label: 'All' }].concat(types.data.results.map(d => ({ value: d.id, label: d.type })))}
              filter={type}
              onSelect={this.handleSitrepFilter.bind(this, 'type')} /> : null}
          </div>
          */}
          {this.renderReports('situation-reports-list', reportsByType)}
        </div>
      </Fold>
    );
  }

  renderAppealDocuments () {
    const data = get(this.props.appealDocuments, 'data.results', []);
    if (!data.length) return null;
    return (
      <Fold id='documents' title='Appeal Documents'>
        {this.renderReports('public-docs-list', data)}
      </Fold>
    );
  }

  renderKeyFigures () {
    const { data } = this.props.event;
    const kf = get(data, 'key_figures');
    if (!Array.isArray(kf) || !kf.length) return null;

    return (
      <Fold
        title='Key Figures'
        wrapperClass='key-figures' >
        <ul className='key-figures-list'>
          {kf.map(o => (
            <li key={o.deck}>
              <h3>{isNaN(o.number) ? o.number : n(o.number)}</h3>
              <p className='key-figure-label'>{o.deck}</p>
              <p className='key-figure-source emergency__source'>Source: {o.source}</p>
            </li>
          ))}
        </ul>
      </Fold>
    );
  }

  addSubscription () {
    this.props._addSubscriptions(this.props.match.params.id);
    this.setState({ subscribed: true });
  }

  delSubscription () {
    this.props._delSubscription(this.props.match.params.id);
    this.setState({ subscribed: false });
  }

  renderContent () {
    const {
      fetched,
      error,
      data
    } = this.props.event;

    if (!fetched || error) return null;
    const report = mostRecentReport(get(this.props, 'event.data.field_reports')) || {};
    const summary = data.summary || report.description || null;
    let source = null;
    if (data.summary) {
      source = data.name;
    } else if (report.description) {
      source = <Link to={`/reports/${report.id}`}>{report.summary}, {timestamp(report.updated_at || report.created_at)}</Link>;
    }
    const contacts = Array.isArray(data.contacts) && data.contacts.length ? data.contacts
      : Array.isArray(report.contacts) && report.contacts.length ? report.contacts : null;
    const subscribeButton = this.state.subscribed
      ? (<React.Fragment><button className='button button--primary-filled float-right' onClick={this.delSubscription}>Unsubscribe</button><br /><br /></React.Fragment>)
      : (<React.Fragment><button className='button button--primary-filled float-right' onClick={this.addSubscription}>Subscribe</button><br /><br /></React.Fragment>);

    const showExportMap = () => {
      // Show the export map if exactly one country is selected, and at least 1 district is selected.
      if (data.countries.length === 1 && data.countries[0].record_type === 1 && data.districts.length > 0) {
        return (<EmergencyMap countries={data.countries} districts={data.districts} name={data.name} date={data.updated_at} disasterTypeCode={data.dtype} />);
      } else {
        return null;
      }
    };

    const handleTabChange = index => {
      const tabHashArray = TAB_DETAILS.map(({ hash }) => hash);
      const url = this.props.location.pathname;
      this.props.history.replace(`${url}${tabHashArray[index]}`);
    };
    const hashes = TAB_DETAILS.map(t => t.hash);
    const selectedIndex = hashes.indexOf(this.props.location.hash) !== -1 ? hashes.indexOf(this.props.location.hash) : 0;
    return (
      <section className='inpage'>
        <Helmet>
          <title>IFRC Go - {get(data, 'name', 'Emergency')}</title>
        </Helmet>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <div className='inpage__headline-content'>
                <div className='inpage__headline-actions'>
                  {
                    this.props.isLogged ? subscribeButton : null
                  }
                  <a href={url.resolve(api, `admin/api/event/${data.id}/change/`)}
                    className='button button--primary-bounded float-right'>Edit Event</a><br />
                </div>
                <h1 className='inpage__title'>{data.name}</h1>
                {this.renderHeaderStats()}
              </div>
            </div>
          </div>
        </header>
        <Tabs
          selectedIndex={ selectedIndex }
          onSelect={index => handleTabChange(index)}
        >
          <TabList>
            {TAB_DETAILS.map(tab => (
              <Tab key={tab.title}>{tab.title}</Tab>
            ))}
          </TabList>

          <div className='inpage__body'>
            <div className='inner'>
              <TabPanel>
                <TabContent isError={!get(this.props.snippets, 'data.results.length')} errorMessage={ NO_DATA } title="Key Figures">
                  <Snippets data={this.props.snippets} />
                  {this.renderKeyFigures()}
                </TabContent>
                {showExportMap()}
                <TabContent isError={!summary} errorMessage={ NO_DATA } title="Overview">
                  <Fold id='overview'
                    title='Situational Overview'
                    wrapperClass='situational-overview' >
                    <Expandable limit={360} text={summary} />
                    {source ? <p className='emergency__source'>Source: {source}</p> : null}
                  </Fold>
                </TabContent>
                <TabContent isError={!get(this.props.event, 'data.field_reports.length')} errorMessage={ NO_DATA } title="Field Reports">
                  {this.renderFieldReports()}
                </TabContent>
                <TabContent isError={!get(this.props.surgeAlerts, 'data.results.length')} errorMessage={ NO_DATA } title="Alerts">
                  <SurgeAlertsTable id='alerts'
                    title='Alerts'
                    emergency={this.props.match.params.id}
                    returnNullForEmpty={true}
                  />)
                </TabContent>
                <TabContent isError={!get(this.props.situationReports, 'data.results.length')} errorMessage={ NO_DATA } title="Response Documents">
                  {this.renderResponseDocuments()}
                </TabContent>

                {contacts && contacts.length ? (
                  <Fold id='contacts' title='Contacts' wrapperClass='contacts'>
                    <table className='table'>
                      <thead className='visually-hidden'>
                        <tr>
                          <th>Name</th>
                          <th>Title</th>
                          <th>Type</th>
                          <th>Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map(o => (
                          <tr key={o.id}>
                            <td>{o.name}</td>
                            <td>{o.title}</td>
                            <td>{separate(o.ctype)}</td>
                            <td>
                              {o.email.indexOf('@') !== -1
                                ? <a className='link--primary' href={`mailto:${o.email}`} title='Contact'>{o.email}</a>
                                : <a className='link--primary' href={`tel:${o.email}`} title='Contact'>{o.email}</a>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Fold>
                ) : <ErrorPanel title="Contacts" errorMessage="No current contacts" />}
              </TabPanel>

              <TabPanel>
                <TabContent isError={!get(this.props.eru, 'data.results.length')} errorMessage={ NO_DATA } title="ERUs">
                  <EruTable id='erus'
                    emergency={this.props.match.params.id}
                  />
                </TabContent>
                <TabContent isError={!get(this.props.personnel, 'data.results.length')} errorMessage={ NO_DATA } title="Personnel">
                  <PersonnelTable id='personnel'
                    emergency={this.props.match.params.id}
                  />
                </TabContent>
                <TabContent isError={!get(this.props.appealDocuments, 'data.results.length')} errorMessage={ NO_DATA } title="Appeal Documents">
                  {this.renderAppealDocuments()}
                </TabContent>
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </section>
    );
  }

  render () {
    return (
      <App className='page--emergency'>
        <Helmet>
          <title>IFRC Go - Emergency</title>
        </Helmet>
        {this.renderContent()}
      </App>
    );
  }
}

if (environment !== 'production') {
  Emergency.propTypes = {
    _getEventById: T.func,
    _getEventSnippets: T.func,
    _getSitrepsByEventId: T.func,
    _getSitrepTypes: T.func,
    _getAppealDocsByAppealIds: T.func,
    _addSubscriptions: T.func,
    _delSubscription: T.func,
    _getUserProfile: T.func,
    snippets: T.object,
    match: T.object,
    location: T.object,
    history: T.object,
    event: T.object,
    situationReports: T.object,
    situationReportTypes: T.object,
    appealDocuments: T.object,
    surgeAlerts: T.object,
    eru: T.object,
    personnel: T.object,
    isLogged: T.bool,
    profile: T.object,
    user: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  event: get(state.event.event, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false
  }),
  snippets: get(state.event.snippets, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false
  }),
  situationReports: get(state.situationReports, ['reports', ownProps.match.params.id], {
    data: {},
    fetching: false,
    fetched: false
  }),
  situationReportTypes: state.situationReports.types,
  appealDocuments: get(state.appealDocuments, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false
  }),
  surgeAlerts: state.surgeAlerts,
  eru: state.deployments.eru,
  personnel: state.deployments.personnel,
  isLogged: !!state.user.data.token,
  user: state.user,
  profile: state.profile
});

const dispatcher = (dispatch) => ({
  _getEventById: (...args) => dispatch(getEventById(...args)),
  _getEventSnippets: (...args) => dispatch(getEventSnippets(...args)),
  _getSitrepsByEventId: (...args) => dispatch(getSitrepsByEventId(...args)),
  _getSitrepTypes: (...args) => dispatch(getSitrepTypes(...args)),
  _getAppealDocsByAppealIds: (...args) => dispatch(getAppealDocsByAppealIds(...args)),
  _addSubscriptions: (...args) => dispatch(addSubscriptions(...args)),
  _delSubscription: (...args) => dispatch(delSubscription(...args)),
  _getUserProfile: (...args) => dispatch(getUserProfile(...args))
});

export default withRouter(connect(selector, dispatcher)(Emergency));

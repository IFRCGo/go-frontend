'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import c from 'classnames';
import { Helmet } from 'react-helmet';

import { environment } from '../config';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { get } from '../utils/utils/';
import {
  commaSeparatedNumber as n,
  nope
} from '../utils/format';
import {
  getAdmAreaById,
  getAdmAreaAppealsList,
  getAdmAreaAggregateAppeals,
  getRegionPersonnel,
  getAdmAreaKeyFigures,
  getAdmAreaSnippets,
  getCountries
} from '../actions';
import { getRegionBoundingBox } from '../utils/region-bounding-box';
import {
  countriesByRegion,
  getRegionId,
  regions as regionMeta
} from '../utils/region-constants';
import { getCountryMeta } from '../utils/get-country-meta';

import App from './app';
import Fold from '../components/fold';
import ErrorPanel from '../components/error-panel';
import RegionMap from '../components/map/region-map';
import BlockLoading from '../components/block-loading';
import EmergenciesTable from '../components/connected/emergencies-table';
import AppealsTable from '../components/connected/appeals-table';
import {
  Snippets,
  KeyFigures,
  Contacts,
  Links
} from '../components/admin-area-elements';
import { SFPComponent } from '../utils/extendables';

const TAB_DETAILS = [
  { title: 'Key Figures', hash: '#key-figures' },
  { title: 'Operations', hash: '#operations-map' },
  { title: 'Emergencies', hash: '#emergencies' },
  { title: 'Appeals', hash: '#appeals' },
  { title: 'Graphics', hash: '#graphics' },
  { title: 'Links', hash: '#links' },
  { title: 'Contacts', hash: '#contacts' }
];

class AdminArea extends SFPComponent {
  constructor(props) {
    super(props);

    this.state = {
      maskLayer: this.getMaskLayer(getRegionId(props.match.params.id))
    };
  }

  componentWillReceiveProps(nextProps) {
    if (getRegionId(this.props.match.params.id) !== getRegionId(nextProps.match.params.id)) {
      this.getData(nextProps);
      this.setState({ maskLayer: this.getMaskLayer(getRegionId(nextProps.match.params.id)) });
      return this.getAdmArea(nextProps.type, getRegionId(nextProps.match.params.id));
    }

    if (this.props.adminArea.fetching && !nextProps.adminArea.fetching) {
      hideGlobalLoading();
      if (nextProps.adminArea.error) {
        this.props.history.push('/uhoh');
      }
    }
  }

  componentDidMount() {
    this.getData(this.props);
    this.getAdmArea(this.props.type, getRegionId(this.props.match.params.id));
  }

  getData(props) {
    const id = getRegionId(props.match.params.id);
    this.props._getAdmAreaAppealsList(props.type, id);
    this.props._getAdmAreaAggregateAppeals(props.type, id, DateTime.local().minus({ years: 10 }).startOf('month').toISODate(), 'year');
    this.props._getRegionPersonnel(id);
    this.props._getAdmAreaKeyFigures(props.type, id);
    this.props._getAdmAreaSnippets(props.type, id);
    this.props._getCountries(id);
  }

  getMaskLayer(regionId) {
    const countries = countriesByRegion[regionId.toString()];
    const isoCodes = countries.map(getCountryMeta)
      .filter(Boolean)
      .map(d => d.iso.toUpperCase());
    return {
      id: 'country-mask',
      type: 'fill',
      source: 'ifrc',
      'source-layer': 'country',
      paint: {
        'fill-color': 'rgba(33, 33, 33, 0.7)'
      },
      filter: [
        '!in',
        'ISO2'
      ].concat(isoCodes)
    };
  }

  getAdmArea(type, id) {
    showGlobalLoading();
    this.props._getAdmAreaById(type, id);
  }

  renderStats() {
    const {
      fetched,
      error,
      data: { stats }
    } = this.props.appealStats;

    if (!fetched || error) {
      return null;
    }

    return (
      <div className='inpage__headline-stats'>
        <div className='header-stats'>
          <ul className='stats-list'>
            <li className='stats-list__item stats-people'>
              {n(stats.numBeneficiaries)}<small>Affected People in the last 30 days</small>
            </li>
            <li className='stats-list__item stats-funding stat-borderless stat-double'>
              {n(stats.amountRequested)}<small>Requested Amount (CHF)</small>
            </li>
            <li className='stats-list__item stat-double'>
              {n(stats.amountFunded)}<small>Funding (CHF)</small>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  renderOperations10Years() {
    const {
      data,
      fetched,
      fetching,
      error
    } = this.props.aggregateYear;

    const zone = 'utc';
    const tickFormatter = (date) => DateTime.fromISO(date, { zone }).toFormat('yyyy');

    const contentFormatter = (payload) => {
      if (!payload.payload || !payload.payload[0]) { return null; }

      const item = payload.payload[0].payload;
      return (
        <article className='chart-tooltip'>
          <div className='chart-tooltip__contents'>
            <dl>
              <dd>Date</dd>
              <dt>{tickFormatter(item.timespan)}</dt>
              <dd>Total</dd>
              <dt>{item.count}</dt>
            </dl>
          </div>
        </article>
      );
    };

    return error ? (
      <p>Operations data not available.</p>
    ) : (
        <figure className='chart'>
          <figcaption>Operations over the past 10 years</figcaption>
          <div className='chart__container'>
            {!fetched || fetching ? (
              <BlockLoading />
            ) : (
                <ResponsiveContainer>
                  <LineChart data={data}>
                    <XAxis tickFormatter={tickFormatter} dataKey='timespan' axisLine={false} padding={{ left: 16, right: 16 }} />
                    <YAxis axisLine={false} tickLine={false} width={32} padding={{ bottom: 16 }} />
                    <Line type='monotone' dataKey='count' stroke='#C02C2C' />
                    <Tooltip content={contentFormatter} />
                  </LineChart>
                </ResponsiveContainer>
              )}
          </div>
        </figure>
      );
  }

  renderPersonnelBySociety() {
    const {
      data,
      fetched,
      fetching,
      error
    } = this.props.personnel;

    const contentFormatter = (payload) => {
      if (!payload.payload || !payload.payload[0]) { return null; }

      const item = payload.payload[0].payload;
      return (
        <article className='chart-tooltip'>
          <div className='chart-tooltip__contents'>
            <dl>
              <dd>Society</dd>
              <dt>{item.name}</dt>
              <dd>Total</dd>
              <dt>{item.count}</dt>
            </dl>
          </div>
        </article>
      );
    };

    return error ? (
      <p>No active deployments to show.</p>
    ) : (
        <figure className='chart'>
          <figcaption>Active deployments by participating National Societies</figcaption>
          <div className='chart__container'>
            {!fetched || fetching ? (
              <BlockLoading />
            ) : (
                data.personnelBySociety.length ? (
                  <ResponsiveContainer>
                    <BarChart data={data.personnelBySociety}>
                      <XAxis dataKey='name' axisLine={false} padding={{ left: 16, right: 16 }} />
                      <YAxis axisLine={false} tickLine={false} width={32} padding={{ bottom: 16 }} />
                      <Bar dataKey='count' fill='#C02C2C' />
                      <Tooltip content={contentFormatter} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                    <p>No data to show.</p>
                  )
              )}
          </div>
        </figure>
      );
  }

  renderCountries() {
    const {
      fetched,
      error,
      data
    } = this.props.countries;
    if (!fetched || error) { return null; }
    let countries = data.results;
    if (this.props.appealStats.fetched && !this.props.appealStats.error) {
      const activeOperations = get(this.props.appealStats, 'data.results', []);
      countries = countries.map(d => {
        const numOperations = activeOperations.filter(o => o.country && o.country.id === d.id).length;
        return Object.assign({ numOperations }, d);
      });
    }
    return (
      <Fold title={countries.length + ' Countries in this Region'}>
        <ul className='region-countries__list'>
          {countries.map(d => (
            <li key={d.id} className='region-countries__item'>
              <Link to={`/countries/${d.id}`} className='link--primary'>{d.name}</Link>
              {d.numOperations ? <span><strong>{d.numOperations}</strong> Active Operation{d.numOperations > 1 ? 's' : ''}</span> : null}
            </li>
          ))}
        </ul>
      </Fold>
    );
  }

  renderContent() {
    const {
      fetched,
      error,
      data
    } = this.props.adminArea;

    if (!fetched || error) return null;

    const bbox = getRegionBoundingBox(data.id);
    const mapContainerClass = 'region__map';
    const regionName = get(regionMeta, [data.id, 'name'], nope);
    const activeOperations = get(this.props.appealStats, 'data.results.length', false);

    return (
      <section className='inpage'>
        <Helmet>
          <title>IFRC Go - {regionName}</title>
        </Helmet>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>{regionName}</h1>
              <div className='inpage__introduction'>
                {this.renderStats()}
              </div>
            </div>
          </div>
        </header>
        <ul>
          <li><a href='#key-figures' title='Go to Key Figures section'>Key Figures</a></li>
          <li><a href='#operations-map' title='Go to Operations section'>Operations</a></li>
          <li><a href='#emergencies' title='Go to Emergencies section'>Emergencies</a></li>
          <li><a href='#appeals' title='Go to Appeals section'>Appeals</a></li>
          <li><a href='#graphics' title='Go to Graphics section'>Graphics</a></li>
          <li><a href='#links' title='Go to Links section'>Links</a></li>
          <li><a href='#contacts' title='Go to Contacts section'>Contacts</a></li>
        </ul>
        <div className='inpage__body'>
          <div className='inner'>
            {get(this.props.keyFigures, 'data.results.length') ? (
              <KeyFigures data={this.props.keyFigures} />
            ) : <ErrorPanel title="Key Figures" errorMessage="Key figures coming soon" />}
            <div className='fold' id='operations-map'>
              <div className='inner'>
                <h2 className='fold__title'>{activeOperations === null || isNaN(activeOperations) ? null : `Active IFRC Operations (${activeOperations})`}</h2>
                <div className={mapContainerClass}>
                  <RegionMap
                    operations={this.props.appealStats}
                    bbox={bbox}
                    layers={[this.state.maskLayer]}
                    noExport={true}
                    noRenderEmergencyTitle={true}
                  />
                </div>
              </div>
            </div>
            <EmergenciesTable
              id='emergencies'
              title='Recent Emergencies'
              limit={5}
              region={getRegionId(this.props.match.params.id)}
              showRecent={true}
              viewAll={'/emergencies/all?region=' + data.id}
              viewAllText={`View all Emergencies for ${regionName} region`}
            />
            {this.renderCountries()}
            <Fold title='Statistics' headerClass='visually-hidden' id='stats'>
              <div className='stats-chart'>
                {this.renderOperations10Years()}
                {this.renderPersonnelBySociety()}
              </div>
            </Fold>
            <AppealsTable
              title={'Active IFRC Operations'}
              region={getRegionId(this.props.match.params.id)}
              showActive={true}
              id={'appeals'}
              viewAll={'/appeals/all?region=' + data.id}
              viewAllText={`View all IFRC operations for ${regionName} region`}
            />
            {get(this.props.snippets, 'data.results.length') ? (
              <Snippets data={this.props.snippets} />
            ) : <ErrorPanel title="Graphics" errorMessage="Graphics coming soon" />}
            {get(data, 'links.length') ? <Links data={data} /> : <ErrorPanel title="Links" errorMessage="Links coming soon" />}
            {get(data, 'contacts.length') ? <Contacts data={data} /> : <ErrorPanel title="Contacts" errorMessage="Contacts coming soon" />}
          </div>
        </div>
      </section>
    );
  }

  render() {
    return (
      <App className={`page--${this.props.type}`}>
        <Helmet>
          <title>IFRC Go - Region</title>
        </Helmet>
        {this.renderContent()}
      </App>
    );
  }
}

if (environment !== 'production') {
  AdminArea.propTypes = {
    _getAdmAreaById: T.func,
    _getAdmAreaAppealsList: T.func,
    _getAdmAreaAggregateAppeals: T.func,
    _getRegionPersonnel: T.func,
    _getCountries: T.func,
    type: T.string,
    match: T.object,
    history: T.object,
    adminArea: T.object,
    appealStats: T.object,
    aggregateYear: T.object,
    personnel: T.object,
    keyFigures: T.object,
    snippets: T.object,
    countries: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  adminArea: get(state.adminArea.aaData, getRegionId(ownProps.match.params.id), {
    data: {},
    fetching: false,
    fetched: false
  }),
  appeals: state.adminArea.appeals,
  drefs: state.adminArea.drefs,
  appealStats: state.adminArea.appealStats,
  aggregateYear: get(state.adminArea.aggregate, 'year', {
    data: {},
    fetching: false,
    fetched: false
  }),
  personnel: state.adminArea.personnel,
  keyFigures: state.adminArea.keyFigures,
  snippets: state.adminArea.snippets,
  countries: state.countries
});

const dispatcher = (dispatch) => ({
  _getAdmAreaById: (...args) => dispatch(getAdmAreaById(...args)),
  _getAdmAreaAppealsList: (...args) => dispatch(getAdmAreaAppealsList(...args)),
  _getAdmAreaAggregateAppeals: (...args) => dispatch(getAdmAreaAggregateAppeals(...args)),
  _getRegionPersonnel: (...args) => dispatch(getRegionPersonnel(...args)),
  _getAdmAreaKeyFigures: (...args) => dispatch(getAdmAreaKeyFigures(...args)),
  _getAdmAreaSnippets: (...args) => dispatch(getAdmAreaSnippets(...args)),
  _getCountries: (...args) => dispatch(getCountries(...args))
});

export default connect(selector, dispatcher)(AdminArea);

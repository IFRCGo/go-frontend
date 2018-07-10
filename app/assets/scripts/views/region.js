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
import { Sticky, StickyContainer } from 'react-sticky';
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
  getAdmAreaERU,
  getAdmAreaKeyFigures,
  getAdmAreaSnippets,
  GET_AA_APPEALS,
  GET_AA_DREFS,
  getCountries
} from '../actions';
import { getRegionBoundingBox } from '../utils/region-bounding-box';
import { countriesByRegion, regions as regionMeta } from '../utils/region-constants';
import { getCountryMeta } from '../utils/get-country-meta';

import App from './app';
import Fold from '../components/fold';
import Homemap from '../components/homemap';
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

class AdminArea extends SFPComponent {
  constructor (props) {
    super(props);
    this.state = {
      maskLayer: this.getMaskLayer(props.match.params.id)
    };
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.getData(nextProps);
      this.setState({ maskLayer: this.getMaskLayer(nextProps.match.params.id) });
      return this.getAdmArea(nextProps.type, nextProps.match.params.id);
    }

    if (this.props.adminArea.fetching && !nextProps.adminArea.fetching) {
      hideGlobalLoading();
      if (nextProps.adminArea.error) {
        this.props.history.push('/uhoh');
      }
    }
  }

  componentDidMount () {
    this.getData(this.props);
    this.getAdmArea(this.props.type, this.props.match.params.id);
  }

  getData (props) {
    this.props._getAdmAreaAppealsList(props.type, props.match.params.id);
    this.props._getAdmAreaAggregateAppeals(props.type, props.match.params.id, DateTime.local().minus({years: 10}).startOf('month').toISODate(), 'year');
    this.props._getAdmAreaERU(props.type, props.match.params.id);
    this.props._getAdmAreaKeyFigures(props.type, props.match.params.id);
    this.props._getAdmAreaSnippets(props.type, props.match.params.id);
    this.props._getCountries(props.match.params.id);
  }

  getMaskLayer (regionId) {
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
        'ISO_A2'
      ].concat(isoCodes)
    };
  }

  getAdmArea (type, id) {
    showGlobalLoading();
    this.props._getAdmAreaById(type, id);
  }

  renderStats () {
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

  renderOperations10Years () {
    const {
      data,
      fetched,
      fetching,
      error
    } = this.props.aggregateYear;

    const zone = 'utc';
    const tickFormatter = (date) => DateTime.fromISO(date, {zone}).toFormat('yyyy');

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
        <figcaption>Operations for the past 10 years</figcaption>
        <div className='chart__container'>
          {!fetched || fetching ? (
            <BlockLoading />
          ) : (
            <ResponsiveContainer>
              <LineChart data={data}>
                <XAxis tickFormatter={tickFormatter} dataKey='timespan' axisLine={false} padding={{ left: 16, right: 16 }} />
                <YAxis axisLine={false} tickLine={false} width={32} padding={{ bottom: 16 }} />
                <Line type='monotone' dataKey='count' stroke='#C22A26' />
                <Tooltip content={contentFormatter}/>
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </figure>
    );
  }

  renderERUBySociety () {
    const {
      data,
      fetched,
      fetching,
      error
    } = this.props.eru;

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
        <figcaption>Active Deployments By Support National Societies</figcaption>
        <div className='chart__container'>
          {!fetched || fetching ? (
            <BlockLoading />
          ) : (
            data.eruBySociety.length ? (
              <ResponsiveContainer>
                <BarChart data={data.eruBySociety}>
                  <XAxis dataKey='name' axisLine={false} padding={{ left: 16, right: 16 }} />
                  <YAxis axisLine={false} tickLine={false} width={32} padding={{ bottom: 16 }} />
                  <Bar dataKey='count' fill='#C22A26' />
                  <Tooltip content={contentFormatter}/>
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

  renderCountries () {
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
        return Object.assign({numOperations}, d);
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

  renderContent () {
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
        <StickyContainer>
          <Sticky>
            {({ style, isSticky }) => (
              <div style={style} className={c('inpage__nav', {'inpage__nav--sticky': isSticky})}>
                <div className='inner'>
                  <ul>
                    {get(this.props.keyFigures, 'data.results.length') ? <li><a href='#key-figures' title='Go to Key Figures section'>Key Figures</a></li> : null}
                    <li><a href='#operations-map' title='Go to Operations section'>Operations</a></li>
                    <li><a href='#stats' title='Go to Stats section'>Stats</a></li>
                    <li><a href='#appeals' title='Go to Appeals section'>Appeals</a></li>
                    <li><a href='#drefs' title='Go to DREFs section'>DREFs</a></li>
                    {get(this.props.snippets, 'data.results.length') ? <li><a href='#graphics' title='Go to Graphics section'>Graphics</a></li> : null}
                    {get(data, 'links.length') ? <li><a href='#links' title='Go to Links section'>Links</a></li> : null}
                    {get(data, 'contacts.length') ? <li><a href='#contacts' title='Go to Contacts section'>Contacts</a></li> : null}
                  </ul>
                </div>
              </div>
            )}
          </Sticky>
          <div className='inpage__body'>
            <div className='inner'>
              <KeyFigures data={this.props.keyFigures} />
              <div className='fold' id='operations-map'>
                <div className= 'inner'>
                  <h2 className='fold__title'>{activeOperations === null || isNaN(activeOperations) ? null : activeOperations + ' Active Operations'}</h2>
                  <div className={mapContainerClass}>
                    <Homemap operations={this.props.appealStats} bbox={bbox} layers={[this.state.maskLayer]}/>
                  </div>
                </div>
              </div>
              <EmergenciesTable
                title='Recent Emergencies'
                limit={5}
                region={this.props.match.params.id}
                showRecent={true}
                viewAll={'/emergencies/all?region=' + data.id}
                viewAllText={`View All Emergencies For ${regionName} Region`}
              />
              {this.renderCountries()}
              <Fold title='Statistics' headerClass='visually-hidden' id='stats'>
                <div className='stats-chart'>
                  {this.renderOperations10Years()}
                  {this.renderERUBySociety()}
                </div>
              </Fold>
              <AppealsTable
                title={'Active Appeals'}
                region={this.props.match.params.id}
                atype={'appeal'}
                showActive={true}
                action={GET_AA_APPEALS}
                statePath={'adminArea.appeals'}
                id={'appeals'}
                viewAll={'/appeals/all?atype=appeal&region=' + data.id}
                viewAllText={`View All Appeals for ${regionName} Region`}
              />
              <AppealsTable
                title={'Active DREFs'}
                region={this.props.match.params.id}
                atype={'dref'}
                showActive={true}
                action={GET_AA_DREFS}
                statePath={'adminArea.drefs'}
                id={'drefs'}
                viewAll={'/appeals/all?atype=dref&region=' + data.id}
                viewAllText={`View All DREFs for ${regionName} Region`}
              />
              <Snippets data={this.props.snippets} />
              <Links data={data} />
              <Contacts data={data} />
            </div>
          </div>
        </StickyContainer>
      </section>
    );
  }

  render () {
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
    _getAdmAreaERU: T.func,
    _getCountries: T.func,
    type: T.string,
    match: T.object,
    history: T.object,
    adminArea: T.object,
    appealStats: T.object,
    aggregateYear: T.object,
    eru: T.object,
    keyFigures: T.object,
    snippets: T.object,
    countries: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  adminArea: get(state.adminArea.aaData, ownProps.match.params.id, {
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
  eru: state.adminArea.eru,
  keyFigures: state.adminArea.keyFigures,
  snippets: state.adminArea.snippets,
  countries: state.countries
});

const dispatcher = (dispatch) => ({
  _getAdmAreaById: (...args) => dispatch(getAdmAreaById(...args)),
  _getAdmAreaAppealsList: (...args) => dispatch(getAdmAreaAppealsList(...args)),
  _getAdmAreaAggregateAppeals: (...args) => dispatch(getAdmAreaAggregateAppeals(...args)),
  _getAdmAreaERU: (...args) => dispatch(getAdmAreaERU(...args)),
  _getAdmAreaKeyFigures: (...args) => dispatch(getAdmAreaKeyFigures(...args)),
  _getAdmAreaSnippets: (...args) => dispatch(getAdmAreaSnippets(...args)),
  _getCountries: (...args) => dispatch(getCountries(...args))
});

export default connect(selector, dispatcher)(AdminArea);

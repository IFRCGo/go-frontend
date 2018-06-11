'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
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

import { environment } from '../config';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { get, dateOptions, datesAgo, dTypeOptions } from '../utils/utils/';
import { getDtypeMeta } from '../utils/get-dtype-meta';
import {
  commaSeparatedNumber as n,
  nope
} from '../utils/format';
import {
  getAdmAreaById,
  getAdmAreaAppeals,
  getAdmAreaDrefs,
  getAdmAreaFieldReports,
  getAdmAreaAppealsList,
  getAdmAreaAggregateAppeals,
  getAdmAreaERU,
  getAdmAreaKeyFigures,
  getAdmAreaSnippets
} from '../actions';
import { getRegionBoundingBox } from '../utils/region-bounding-box';
import { regions as regionMeta } from '../utils/region-constants';

import App from './app';
import Fold from '../components/fold';
import Homemap from '../components/homemap';
import BlockLoading from '../components/block-loading';
import DisplayTable, { SortHeader, FilterHeader } from '../components/display-table';
import {
  Snippets,
  KeyFigures,
  Contacts,
  Links
} from '../components/admin-area-elements';
import { SFPComponent } from '../utils/extendables';

class AdminArea extends SFPComponent {
  // Methods form SFPComponent:
  // handlePageChange (what, page)
  // handleFilterChange (what, field, value)
  // handleSortChange (what, field)

  constructor (props) {
    super(props);
    this.state = {
      appeals: {
        page: 1,
        limit: 5,
        sort: {
          field: '',
          direction: 'asc'
        },
        filters: {
          date: 'all',
          dtype: 'all'
        }
      },
      drefs: {
        page: 1,
        limit: 5,
        sort: {
          field: '',
          direction: 'asc'
        },
        filters: {
          date: 'all',
          dtype: 'all'
        }
      },
      fieldReports: {
        page: 1,
        limit: 5,
        sort: {
          field: '',
          direction: 'asc'
        },
        filters: {
          date: 'all',
          dtype: 'all'
        }
      }
    };
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.getData(nextProps);
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
    this.props._getAdmAreaAppeals(props.type, props.match.params.id, 1, { ordering: '-start_date' });
    this.props._getAdmAreaDrefs(props.type, props.match.params.id, 1, { ordering: '-start_date' });
    this.props._getAdmAreaFieldReports(props.type, props.match.params.id, 1, { ordering: '-created_at' });
    this.props._getAdmAreaAppealsList(props.type, props.match.params.id);
    this.props._getAdmAreaAggregateAppeals(props.type, props.match.params.id, DateTime.local().minus({years: 10}).startOf('month').toISODate(), 'year');
    this.props._getAdmAreaERU(props.type, props.match.params.id);
    this.props._getAdmAreaKeyFigures(props.type, props.match.params.id);
    this.props._getAdmAreaSnippets(props.type, props.match.params.id);
  }

  getAdmArea (type, id) {
    showGlobalLoading();
    this.props._getAdmAreaById(type, id);
  }

  computeFilters (what) {
    let state = this.state[what];
    let qs = { limit: state.limit };

    switch (what) {
      case 'appeals':
      case 'drefs':
        if (state.sort.field) {
          qs.ordering = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
        } else {
          qs.ordering = '-start_date';
        }

        if (state.filters.date !== 'all') {
          qs.start_date__gte = datesAgo[state.filters.date]();
        }
        if (state.filters.dtype !== 'all') {
          qs.dtype = state.filters.dtype;
        }

        break;
      case 'fieldReports':
        qs.ordering = '-created_at';
        if (state.filters.date !== 'all') {
          qs.created_at__gte = datesAgo[state.filters.date]();
        }
        if (state.filters.dtype !== 'all') {
          qs.dtype = state.filters.dtype;
        }
        break;
    }
    return qs;
  }

  updateData (what) {
    let fn;
    switch (what) {
      case 'appeals':
        fn = this.props._getAdmAreaAppeals;
        break;
      case 'drefs':
        fn = this.props._getAdmAreaDrefs;
        break;
      case 'fieldReports':
        fn = this.props._getAdmAreaFieldReports;
        break;
    }

    fn(this.props.type, this.props.match.params.id, this.state[what].page, this.computeFilters(what));
  }

  renderAppeals () {
    const {
      fetched,
      fetching,
      error,
      data
    } = this.props.appeals;

    if (fetching) {
      return (
        <Fold title='Appeals' id='appeals'>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title='Appeals' id='appeals'>
          <p>Emergency appeals not available.</p>
        </Fold>
      );
    }

    if (fetched) {
      const now = Date.now();
      const headings = [
        {
          id: 'date',
          label: <FilterHeader id='date' title='Start Date' options={dateOptions} filter={this.state.appeals.filters.date} onSelect={this.handleFilterChange.bind(this, 'appeals', 'date')} />
        },
        {
          id: 'name',
          label: <SortHeader id='name' title='Name' sort={this.state.appeals.sort} onClick={this.handleSortChange.bind(this, 'appeals', 'name')} />
        },
        { id: 'event', label: 'Emergency' },
        {
          id: 'dtype',
          label: <FilterHeader id='dtype' title='Disaster Type' options={dTypeOptions} filter={this.state.appeals.filters.dtype} onSelect={this.handleFilterChange.bind(this, 'appeals', 'dtype')} />
        },
        {
          id: 'requestAmount',
          label: <SortHeader id='amount_requested' title='Requested Amount (CHF)' sort={this.state.appeals.sort} onClick={this.handleSortChange.bind(this, 'appeals', 'amount_requested')} />
        },
        {
          id: 'fundedAmount',
          label: <SortHeader id='amount_funded' title='Funding (CHF)' sort={this.state.appeals.sort} onClick={this.handleSortChange.bind(this, 'appeals', 'amount_funded')} />
        },
        { id: 'active', label: 'Active' }
      ];

      const rows = data.results.map(o => ({
        id: o.id,
        date: DateTime.fromISO(o.start_date).toISODate(),
        name: o.name,
        event: o.event ? <Link to={`/emergencies/${o.event.id}`} className='link--primary' title='View Emergency'>{o.event.name}</Link> : nope,
        dtype: get(getDtypeMeta(o.dtype), 'label', nope),
        requestAmount: n(o.amount_requested),
        fundedAmount: n(o.amount_funded),
        active: (new Date(o.end_date)).getTime() > now ? 'Active' : 'Inactive'
      }));

      return (
        <Fold title={`Appeals (${n(data.count)})`} id='appeals'>
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.count / this.state.appeals.limit}
            page={this.state.appeals.page - 1}
            onPageChange={this.handlePageChange.bind(this, 'appeals')}
          />
        </Fold>
      );
    }

    return null;
  }

  renderDrefs () {
    const {
      fetched,
      fetching,
      error,
      data
    } = this.props.drefs;

    if (fetching) {
      return (
        <Fold title='Drefs' id='drefs'>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title='Drefs' id='drefs'>
          <p>DREFs not available.</p>
        </Fold>
      );
    }

    if (fetched) {
      const now = Date.now();
      const headings = [
        {
          id: 'date',
          label: <FilterHeader id='date' title='Start Date' options={dateOptions} filter={this.state.drefs.filters.date} onSelect={this.handleFilterChange.bind(this, 'drefs', 'date')} />
        },
        {
          id: 'name',
          label: <SortHeader id='name' title='Name' sort={this.state.drefs.sort} onClick={this.handleSortChange.bind(this, 'drefs', 'name')} />
        },
        { id: 'event', label: 'Emergency' },
        {
          id: 'dtype',
          label: <FilterHeader id='dtype' title='Disaster Type' options={dTypeOptions} filter={this.state.drefs.filters.dtype} onSelect={this.handleFilterChange.bind(this, 'drefs', 'dtype')} />
        },
        {
          id: 'requestAmount',
          label: <SortHeader id='amount_requested' title='Requested Amount (CHF)' sort={this.state.drefs.sort} onClick={this.handleSortChange.bind(this, 'drefs', 'amount_requested')} />
        },
        {
          id: 'fundedAmount',
          label: <SortHeader id='amount_funded' title='Funding (CHF)' sort={this.state.drefs.sort} onClick={this.handleSortChange.bind(this, 'drefs', 'amount_funded')} />
        },
        { id: 'active', label: 'Active' }
      ];

      const rows = data.results.map(o => ({
        id: o.id,
        date: DateTime.fromISO(o.start_date).toISODate(),
        name: o.name,
        event: o.event ? <Link to={`/emergencies/${o.event.id}`} className='link--primary' title='View Emergency'>{o.event.name}</Link> : nope,
        dtype: get(getDtypeMeta(o.dtype), 'label', nope),
        requestAmount: n(o.amount_requested),
        fundedAmount: n(o.amount_funded),
        active: (new Date(o.end_date)).getTime() > now ? 'Active' : 'Inactive'
      }));

      return (
        <Fold title={`Drefs (${n(data.count)})`} id='drefs'>
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.count / this.state.drefs.limit}
            page={this.state.drefs.page - 1}
            onPageChange={this.handlePageChange.bind(this, 'drefs')}
          />
        </Fold>
      );
    }

    return null;
  }

  renderFieldReports () {
    const {
      fetched,
      fetching,
      error,
      data
    } = this.props.fieldReports;

    if (fetching) {
      return (
        <Fold title='Field Reports' id='field-reports'>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title='Field Reports' id='field-reports'>
          <p>You must be logged in to view field reports. <Link key='login' to='/login' className='link--primary' title='Login'>Login</Link></p>
        </Fold>
      );
    }

    if (fetched) {
      const headings = [
        {
          id: 'date',
          label: <FilterHeader id='date' title='Created At' options={dateOptions} filter={this.state.fieldReports.filters.date} onSelect={this.handleFilterChange.bind(this, 'fieldReports', 'date')} />
        },
        { id: 'name', label: 'Name' },
        { id: 'event', label: 'Emergency' },
        {
          id: 'dtype',
          label: <FilterHeader id='dtype' title='Disaster Type' options={dTypeOptions} filter={this.state.fieldReports.filters.dtype} onSelect={this.handleFilterChange.bind(this, 'fieldReports', 'dtype')} />
        },
        { id: 'countries', label: 'Countries' }
      ];

      const rows = data.results.map(o => ({
        id: o.id,
        date: DateTime.fromISO(o.created_at).toISODate(),
        name: <Link to={`/reports/${o.id}`} className='link--primary' title='View Field Report'>{o.summary}</Link>,
        event: o.event ? <Link to={`/emergencies/${o.event}`} className='link--primary' title='View Emergency'>Link</Link> : nope,
        dtype: get(getDtypeMeta(o.dtype), 'label', nope),
        countries: <ul>{o.countries.map(country => <li key={country.id}><Link to={`/countries/${country.id}`} className='link--primary' title='View Country'>{country.name}</Link></li>)}</ul>
      }));

      return (
        <Fold title={`Field Reports (${n(data.count)})`} id='field-reports'>
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.count / this.state.fieldReports.limit}
            page={this.state.fieldReports.page}
            onPageChange={this.handlePageChange.bind(this, 'fieldReports')}
          />
        </Fold>
      );
    }

    return null;
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

    return (
      <section className='inpage'>
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
                    <li><a href='#key-figures' title='Go to Key Figures section'>Key Figures</a></li>
                    <li><a href='#operations-map' title='Go to Operations section'>Operations</a></li>
                    <li><a href='#stats' title='Go to Stats section'>Stats</a></li>
                    <li><a href='#appeals' title='Go to Appeals section'>Appeals</a></li>
                    <li><a href='#drefs' title='Go to Drefs section'>Drefs</a></li>
                    <li><a href='#field-reports' title='Go to Field Reports section'>Field Reports</a></li>
                    <li><a href='#graphics' title='Go to Graphics section'>Graphics</a></li>
                    <li><a href='#links' title='Go to Links section'>Links</a></li>
                    <li><a href='#contacts' title='Go to Contacts section'>Contacts</a></li>
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
                  <h2 className='fold__title'>14 Emergencies</h2>
                  <div className={mapContainerClass}>
                    <Homemap appealsList={this.props.appealStats} bbox={bbox} />
                  </div>
                </div>
              </div>

              <Fold title='Statistics' headerClass='visually-hidden' id='stats'>
                <div className='stats-chart'>
                  {this.renderOperations10Years()}
                  {this.renderERUBySociety()}
                </div>

              </Fold>
              {this.renderAppeals()}
              {this.renderDrefs()}
              {this.renderFieldReports()}
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
        {this.renderContent()}
      </App>
    );
  }
}

if (environment !== 'production') {
  AdminArea.propTypes = {
    _getAdmAreaById: T.func,
    _getAdmAreaAppeals: T.func,
    _getAdmAreaDrefs: T.func,
    _getAdmAreaFieldReports: T.func,
    _getAdmAreaAppealsList: T.func,
    _getAdmAreaAggregateAppeals: T.func,
    _getAdmAreaERU: T.func,
    type: T.string,
    match: T.object,
    history: T.object,
    adminArea: T.object,
    appeals: T.object,
    drefs: T.object,
    fieldReports: T.object,
    appealStats: T.object,
    aggregateYear: T.object,
    eru: T.object,
    keyFigures: T.object,
    snippets: T.object
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
  fieldReports: state.adminArea.fieldReports,
  appealStats: state.adminArea.appealStats,
  aggregateYear: get(state.adminArea.aggregate, 'year', {
    data: {},
    fetching: false,
    fetched: false
  }),
  eru: state.adminArea.eru,
  keyFigures: state.adminArea.keyFigures,
  snippets: state.adminArea.snippets
});

const dispatcher = (dispatch) => ({
  _getAdmAreaById: (...args) => dispatch(getAdmAreaById(...args)),
  _getAdmAreaAppeals: (...args) => dispatch(getAdmAreaAppeals(...args)),
  _getAdmAreaDrefs: (...args) => dispatch(getAdmAreaDrefs(...args)),
  _getAdmAreaFieldReports: (...args) => dispatch(getAdmAreaFieldReports(...args)),
  _getAdmAreaAppealsList: (...args) => dispatch(getAdmAreaAppealsList(...args)),
  _getAdmAreaAggregateAppeals: (...args) => dispatch(getAdmAreaAggregateAppeals(...args)),
  _getAdmAreaERU: (...args) => dispatch(getAdmAreaERU(...args)),
  _getAdmAreaKeyFigures: (...args) => dispatch(getAdmAreaKeyFigures(...args)),
  _getAdmAreaSnippets: (...args) => dispatch(getAdmAreaSnippets(...args))
});

export default connect(selector, dispatcher)(AdminArea);

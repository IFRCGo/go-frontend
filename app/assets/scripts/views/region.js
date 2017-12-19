'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import ReactPaginate from 'react-paginate';
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

import { environment } from '../config';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { get } from '../utils/utils/';
import {
  commaSeparatedNumber as n
} from '../utils/format';
import {
  getRegionById,
  getRegionAppeals,
  getRegionDrefs,
  getRegionFieldReports,
  getRegionAppealsStats,
  getRegionAggregateAppeals,
  getRegionERU
} from '../actions';

import App from './app';
import Fold from '../components/fold';
import Homemap from '../components/homemap';
import BlockLoading from '../components/block-loading';

class Region extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      pageAppeals: 1,
      pageDrefs: 1,
      pageReports: 1
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.getData(nextProps);
      return this.getRegion(nextProps.match.params.id);
    }

    if (this.props.region.fetching && !nextProps.region.fetching) {
      hideGlobalLoading();
      if (nextProps.region.error) {
        this.props.history.push('/uhoh');
      }
    }
  }

  componentDidMount () {
    this.getData(this.props);
    this.getRegion(this.props.match.params.id);
  }

  getData (props) {
    this.props._getRegionAppeals(props.match.params.id);
    this.props._getRegionDrefs(props.match.params.id);
    this.props._getRegionFieldReports(props.match.params.id);
    this.props._getRegionAppealsStats(props.match.params.id);
    this.props._getRegionAggregateAppeals(props.match.params.id, DateTime.local().minus({years: 10}).startOf('month').toISODate(), 'year');
    this.props._getRegionERU(props.match.params.id);
  }

  getRegion (id) {
    showGlobalLoading();
    this.props._getRegionById(id);
  }

  handlePageChange (what, page) {
    let pageKey;
    let fn;
    switch (what) {
      case 'appeals':
        pageKey = 'pageAppeals';
        fn = this.props._getRegionAppeals;
        break;
      case 'drefs':
        pageKey = 'pageDrefs';
        fn = this.props._getRegionDrefs;
        break;
      case 'fieldReports':
        pageKey = 'pageReports';
        fn = this.props._getRegionFieldReports;
        break;
    }
    this.setState({ [pageKey]: page.selected + 1 }, () => {
      fn(this.props.match.params.id, this.state[pageKey]);
    });
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
        <Fold title='Appeals'>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title='Appeals'>
          <p>Oh no! An error ocurred getting the data.</p>
        </Fold>
      );
    }

    if (fetched) {
      const now = Date.now();
      if (data && data.objects.length) {
        const headings = [
          { id: 'date', label: 'Date' },
          { id: 'name', label: 'Name' },
          { id: 'event', label: 'Event' },
          { id: 'dtype', label: 'Disaster Type' },
          { id: 'requestAmount', label: 'Appeal Amount (CHF)' },
          { id: 'fundedAmount', label: 'Funding (CHF)' },
          { id: 'active', label: 'Active' }
        ];

        const rows = data.objects.map(o => ({
          id: o.id,
          date: DateTime.fromISO(o.end_date).toISODate(),
          name: o.name,
          event: <Link to={`/emergencies/${o.event.id}`} className='link--primary' title='View Emergency'>{o.event.name}</Link>,
          dtype: o.dtype.name,
          requestAmount: n(o.amount_requested),
          fundedAmount: n(o.amount_funded),
          active: (new Date(o.end_date)).getTime() > now ? 'Active' : 'Inactive'
        }));

        return (
          <Fold title={`Appeals (${data.meta.total_count})`}>
            <DisplayTable
              headings={headings}
              rows={rows}
              pageCount={data.meta.total_count / data.meta.limit}
              page={data.meta.offset / data.meta.limit}
              onPageChange={this.handlePageChange.bind(this, 'appeals')}
            />
          </Fold>
        );
      } else {
        return (
          <Fold title='Appeals'>
            <p>There are no Appeals to show</p>
          </Fold>
        );
      }
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
        <Fold title='Drefs'>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title='Drefs'>
          <p>Oh no! An error ocurred getting the data.</p>
        </Fold>
      );
    }

    if (fetched) {
      const now = Date.now();
      if (data && data.objects.length) {
        const headings = [
          { id: 'date', label: 'Date' },
          { id: 'name', label: 'Name' },
          { id: 'event', label: 'Event' },
          { id: 'dtype', label: 'Disaster Type' },
          { id: 'requestAmount', label: 'Appeal Amount (CHF)' },
          { id: 'fundedAmount', label: 'Funding (CHF)' },
          { id: 'active', label: 'Active' }
        ];

        const rows = data.objects.map(o => ({
          id: o.id,
          date: DateTime.fromISO(o.end_date).toISODate(),
          name: o.name,
          event: <Link to={`/emergencies/${o.event.id}`} className='link--primary' title='View Emergency'>{o.event.name}</Link>,
          dtype: o.dtype.name,
          requestAmount: n(o.amount_requested),
          fundedAmount: n(o.amount_funded),
          active: (new Date(o.end_date)).getTime() > now ? 'Active' : 'Inactive'
        }));

        return (
          <Fold title={`Drefs (${data.meta.total_count})`}>
            <DisplayTable
              headings={headings}
              rows={rows}
              pageCount={data.meta.total_count / data.meta.limit}
              page={data.meta.offset / data.meta.limit}
              onPageChange={this.handlePageChange.bind(this, 'drefs')}
            />
          </Fold>
        );
      } else {
        return (
          <Fold title='Drefs'>
            <p>There are no Drefs to show</p>
          </Fold>
        );
      }
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
        <Fold title='Field Reports'>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title='Field Reports'>
          <p>Oh no! An error ocurred getting the data.</p>
        </Fold>
      );
    }

    if (fetched) {
      if (data && data.objects.length) {
        const headings = [
          { id: 'date', label: 'Date' },
          { id: 'name', label: 'Name' },
          { id: 'event', label: 'Event' },
          { id: 'dtype', label: 'Disaster Type' },
          { id: 'countries', label: 'Countries' }
        ];

        const rows = data.objects.map(o => ({
          id: o.id,
          date: DateTime.fromISO(o.created_at).toISODate(),
          name: <Link to={`/reports/${o.id}`} className='link--primary' title='View Field Report'>{o.summary}</Link>,
          event: o.event ? <Link to={`/emergencies/${o.event.id}`} className='link--primary' title='View Emergency'>{o.event.name}</Link> : 'n/a',
          dtype: o.dtype.name,
          countries: <ul>{o.countries.map(country => <li key={country.id}><Link to={`/countries/${country.id}`} className='link--primary' title='View Country'>{country.name}</Link></li>)}</ul>
        }));

        return (
          <Fold title={`Field Reports (${data.meta.total_count})`}>
            <DisplayTable
              headings={headings}
              rows={rows}
              pageCount={data.meta.total_count / data.meta.limit}
              page={data.meta.offset / data.meta.limit}
              onPageChange={this.handlePageChange.bind(this, 'fieldReports')}
            />
          </Fold>
        );
      } else {
        return (
          <Fold title='Field Reports'>
            <p>There are no Field Reports to show</p>
          </Fold>
        );
      }
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
              {n(stats.amountRequested)}<small>Appeal Amount (CHF)</small>
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

    const tickFormatter = (date) => DateTime.fromISO(date).toFormat('yyyy');

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
      <p>Oh no! An error ocurred getting the stats.</p>
    ) : (
      <figure className='chart'>
        <figcaption>Operations for the past 10 years</figcaption>
        <div className='chart__container'>
          {!fetched || fetching ? (
            <BlockLoading />
          ) : (
            <ResponsiveContainer>
              <LineChart data={data}>
                <XAxis tickFormatter={tickFormatter} dataKey='timespan' axisLine={false} padding={{ left: 16 }} />
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
      <p>Oh no! An error ocurred getting the stats.</p>
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
                  <XAxis dataKey='name' axisLine={false} padding={{ left: 16 }} />
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
    } = this.props.region;

    if (!fetched || error) return null;

    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>{data.name} Region</h1>
              <div className='inpage__introduction'>
                {this.renderStats()}
              </div>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <Homemap appealsList={this.props.appealStats} />
          <div className='inner'>
            <Fold title='Statistics' headerClass='visually-hidden'>
              <div className='stats-chart'>
                {this.renderOperations10Years()}
                {this.renderERUBySociety()}
              </div>
            </Fold>
            {this.renderAppeals()}
            {this.renderDrefs()}
            {this.renderFieldReports()}
          </div>
        </div>
      </section>
    );
  }

  render () {
    return (
      <App className='page--region'>
        {this.renderContent()}
      </App>
    );
  }
}

if (environment !== 'production') {
  Region.propTypes = {
    _getRegionById: T.func,
    _getRegionAppeals: T.func,
    _getRegionDrefs: T.func,
    _getRegionFieldReports: T.func,
    _getRegionAppealsStats: T.func,
    _getRegionAggregateAppeals: T.func,
    _getRegionERU: T.func,
    match: T.object,
    history: T.object,
    region: T.object,
    appeals: T.object,
    drefs: T.object,
    fieldReports: T.object,
    appealStats: T.object,
    aggregateYear: T.object,
    eru: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  region: get(state.region.regionData, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false
  }),
  appeals: state.region.appeals,
  drefs: state.region.drefs,
  fieldReports: state.region.fieldReports,
  appealStats: state.region.appealStats,
  aggregateYear: get(state.region.aggregate, 'year', {
    data: {},
    fetching: false,
    fetched: false
  }),
  eru: state.region.eru
});

const dispatcher = (dispatch) => ({
  _getRegionById: (...args) => dispatch(getRegionById(...args)),
  _getRegionAppeals: (...args) => dispatch(getRegionAppeals(...args)),
  _getRegionDrefs: (...args) => dispatch(getRegionDrefs(...args)),
  _getRegionFieldReports: (...args) => dispatch(getRegionFieldReports(...args)),
  _getRegionAppealsStats: (...args) => dispatch(getRegionAppealsStats(...args)),
  _getRegionAggregateAppeals: (...args) => dispatch(getRegionAggregateAppeals(...args)),
  _getRegionERU: (...args) => dispatch(getRegionERU(...args))
});

export default connect(selector, dispatcher)(Region);

class DisplayTable extends React.Component {
  render () {
    return (
      <React.Fragment>
        <table className='table table--zebra'>
          <thead>
            <tr>
              {this.props.headings.map(h => <th key={h.id}>{h.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {this.props.rows.map(row => (
              <tr key={row.id}>
                {this.props.headings.map(h => <td key={`${row.id}-${h.id}`}>{row[h.id]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <div className='pagination-wrapper'>
          <ReactPaginate
            previousLabel={<span>previous</span>}
            nextLabel={<span>next</span>}
            breakLabel={<span className='pages__page'>...</span>}
            pageCount={Math.ceil(this.props.pageCount)}
            forcePage={this.props.page}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.props.onPageChange}
            containerClassName={'pagination'}
            subContainerClassName={'pages'}
            pageClassName={'pages__wrapper'}
            pageLinkClassName={'pages__page'}
            activeClassName={'active'} />
        </div>
      </React.Fragment>
    );
  }
}

if (environment !== 'production') {
  DisplayTable.propTypes = {
    onPageChange: T.func,
    headings: T.array,
    rows: T.array,
    pageCount: T.number,
    page: T.number
  };
}

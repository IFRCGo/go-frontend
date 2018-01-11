'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { DateTime } from 'luxon';

import { getEruOwners } from '../actions';
import { finishedFetch } from '../utils/utils';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { environment } from '../config';
import {
  commaSeparatedNumber as n
} from '../utils/format';
import { dateOptions, datesAgo } from '../utils/utils/';

import App from './app';
import Fold from '../components/fold';
import Progress from '../components/progress';
import BlockLoading from '../components/block-loading';
import { SFPComponent } from '../utils/extendables';
import DisplayTable, { SortHeader, FilterHeader } from '../components/display-table';
import Map from '../components/deployments/map';
import Readiness from '../components/deployments/readiness';

// TODO: Use correct ids.
const deployTypes = [
  { value: 'all', label: 'All' },
  { value: 'X', label: 'ERU' },
  { value: 'Xx', label: 'FACT' },
  { value: 'Xxx', label: 'RT-RIT' },
  { value: 'Xxxx', label: 'HeOps' }
];

class Deployments extends SFPComponent {
  // Methods form SFPComponent:
  // handlePageChange (what, page)
  // handleFilterChange (what, field, value)
  // handleSortChange (what, field)

  constructor (props) {
    super(props);
    this.state = {
      deployments: {
        page: 1,
        sort: {
          field: '',
          direction: 'asc'
        },
        filters: {
          date: 'all',
          type: 'all'
        }
      }
    };
  }

  componentDidMount () {
    showGlobalLoading();
    this.props._getEruOwners();
  }

  componentWillReceiveProps (nextProps) {
    if (finishedFetch(this.props, nextProps, 'eruOwners')) {
      hideGlobalLoading();
    }
  }

  requestResults () {
    let qs = {};
    let state = this.state.deployments;
    if (state.sort.field) {
      qs.order_by = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    }

    if (state.filters.date !== 'all') {
      qs.created_at__gte = datesAgo[state.filters.date]();
    }

    // TODO: type filter
    if (state.filters.type !== 'all') {
      // qs.SOMETHING = state.filters.type;
    }

    // TODO: Implement function
    // this.props._fn(this.state.deployments.page, qs);
  }

  updateData (what) {
    this.requestResults();
  }

  renderHeaderCharts (data, title) {
    const max = Math.max.apply(Math, data.map(o => +o.items));
    const items = data.length > 6 ? data.slice(0, 6) : data;
    return (
      <div>
        <h2>{title}</h2>
        <div className='emergencies__container'>
          <ul className='emergencies__list'>
            {items.map(o => (
              <li key={o.name}
                className='emergencies__item'>
                <span className='key'>{o.name}</span>
                <span className='value'><Progress value={o.items} max={max}><span>100</span></Progress></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  renderHeaderStats () {
    const { data } = this.props.eruOwners;
    return (
      <div className='inpage__introduction'>
        <div className='header-stats'>
          <ul className='stats-list'>
            <li className='stats-list__item stats-eru'>
              {n(data.deployed)}<small>Deployed ERU Units</small>
            </li>
            <li className='stats-list__item stats-fact'>
              1245<small>Deployed FACTs</small>
            </li>
            <li className='stats-list__item stats-people'>
              1231<small>Deployed RDRTs</small>
            </li>
            <li className='stats-list__item stats-heops'>
              1231<small>Deployed Heops</small>
            </li>
          </ul>
        </div>
        <div className='inpage__headline-charts'>
          <div className='chart'>
            {this.renderHeaderCharts(data.types, 'ERU Deployment Types')}
          </div>
          <div className='chart'>
            {this.renderHeaderCharts(data.owners, 'Number of Deployments by NS')}
          </div>
        </div>
      </div>
    );
  }

  renerDeploymentsTable () {
    // const {
    //   fetched,
    //   fetching,
    //   error,
    //   data
    // // TODO: Get correct property
    // } = this.props.SOMETHING;
    const fetched = true;
    const fetching = false;
    const error = false;
    const data = {
      meta: {
        total_count: 10,
        limit: 5,
        offset: 0
      }
    };

    if (fetching) {
      return (
        <Fold title='Current Deployments'>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title='Current Deployments'>
          <p>Oh no! An error ocurred getting the data.</p>
        </Fold>
      );
    }

    if (fetched) {
      const headings = [
        {
          id: 'date',
          label: <FilterHeader id='date' title='Star Date' options={dateOptions} filter={this.state.deployments.filters.date} onSelect={this.handleFilterChange.bind(this, 'deployments', 'date')} />
        },
        {
          id: 'name',
          label: <SortHeader id='name' title='Name' sort={this.state.deployments.sort} onClick={this.handleSortChange.bind(this, 'deployments', 'name')} />
        },
        { id: 'country', label: 'Country' },
        {
          id: 'type',
          label: <FilterHeader id='type' title='Type' options={deployTypes} filter={this.state.deployments.filters.type} onSelect={this.handleFilterChange.bind(this, 'deployments', 'type')} />
        },
        { id: 'personnel', label: 'Number of Personnel', className: 'right-align' }
      ];

      // const rows = data.objects.map(o => ({
      //   id: o.id,
      //   date: DateTime.fromISO(o.created_at).toISODate(),
      //   name: <Link to={`/reports/${o.id}`} className='link--primary' title='View Field Report'>{o.summary}</Link>,
      //   event: o.event ? <Link to={`/emergencies/${o.event.id}`} className='link--primary' title='View Emergency'>{o.event.name}</Link> : 'n/a',
      //   dtype: o.dtype.name,
      //   countries: <ul>{o.countries.map(country => <li key={country.id}><Link to={`/countries/${country.id}`} className='link--primary' title='View Country'>{country.name}</Link></li>)}</ul>
      // }));
      const rows = [
        {
          id: 'test',
          date: DateTime.local().toISODate(),
          name: 'Test entry',
          country: 'Portugal',
          type: 'X',
          personnel: {
            value: 1000,
            className: 'right-align'
          }
        }
      ];

      return (
        <Fold title={`Current Deployments (${data.meta.total_count})`}>
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.meta.total_count / data.meta.limit}
            page={data.meta.offset / data.meta.limit}
            onPageChange={this.handlePageChange.bind(this, 'deployments')}
          />
        </Fold>
      );
    }

    return null;
  }

  renderContent () {
    const {
      fetched,
      error
    } = this.props.eruOwners;

    if (!fetched || error) return null;

    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <div className='inpage__headline-content'>
                <h1 className='inpage__title'>Deployments</h1>
                {this.renderHeaderStats()}
              </div>
            </div>
          </div>
        </header>
        <div>
          <Map eruOwners={this.props.eruOwners} />
        </div>
        <div className='inpage__body'>
          <div className='inner'>
            {this.renerDeploymentsTable()}
            <div className='readiness__container'>
              <Readiness eruOwners={this.props.eruOwners} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  render () {
    return (
      <App className='page--deployments'>
        {this.renderContent()}
      </App>
    );
  }
}

if (environment !== 'production') {
  Deployments.propTypes = {
    _getEruOwners: T.func,
    eruOwners: T.object
  };
}

const selector = (state) => ({
  eruOwners: state.eruOwners
});

const dispatcher = (dispatch) => ({
  _getEruOwners: () => dispatch(getEruOwners())
});

export default connect(selector, dispatcher)(Deployments);

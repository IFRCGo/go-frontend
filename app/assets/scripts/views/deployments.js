'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { PropTypes as T } from 'prop-types';
import { DateTime } from 'luxon';

import {
  getDeploymentERU,
  getDeploymentFACT,
  getDeploymentHEOP,
  getDeploymentRDRT,
  getAllDeploymentERU,
  getAllDeploymentFACT,
  getAllDeploymentHEOP,
  getAllDeploymentRDRT,
  getEruOwners
} from '../actions';
import { finishedFetch, get, dateOptions, datesAgo } from '../utils/utils';
import { getEruType } from '../utils/eru-types';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { environment } from '../config';
import {
  commaSeparatedNumber as n,
  nope,
  na
} from '../utils/format';

import App from './app';
import Fold from '../components/fold';
import Progress from '../components/progress';
import BlockLoading from '../components/block-loading';
import { SFPComponent } from '../utils/extendables';
import DisplayTable, { SortHeader, FilterHeader } from '../components/display-table';
import Map from '../components/deployments/map';
import Readiness from '../components/deployments/readiness';

class Deployments extends SFPComponent {
  // Methods form SFPComponent:
  // handlePageChange (what, page)
  // handleFilterChange (what, field, value)
  // handleSortChange (what, field)

  constructor (props) {
    super(props);
    this.state = {
      eru: {
        page: 1
      },
      fact: {
        page: 1,
        sort: {
          field: '',
          direction: 'asc'
        },
        filters: {
          date: 'all'
        }
      },
      heop: {
        page: 1,
        sort: {
          field: '',
          direction: 'asc'
        },
        filters: {
          date: 'all'
        }
      },
      rdrt: {
        page: 1,
        sort: {
          field: '',
          direction: 'asc'
        },
        filters: {
          date: 'all'
        }
      }
    };
  }

  componentDidMount () {
    showGlobalLoading();
    this.props._getEruOwners();

    this.props._getDeploymentERU();
    this.props._getDeploymentFACT();
    this.props._getDeploymentHEOP();
    this.props._getDeploymentRDRT();

    this.props._getAllDeploymentERU();
    this.props._getAllDeploymentFACT();
    this.props._getAllDeploymentHEOP();
    this.props._getAllDeploymentRDRT();
  }

  componentWillReceiveProps (nextProps) {
    if (finishedFetch(this.props, nextProps, 'eruOwners')) {
      hideGlobalLoading();
    }
  }

  requestResults (what) {
    let qs = {};
    let state = this.state[what];
    if (state.sort && state.sort.field) {
      qs.order_by = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    }

    if (state.filters && state.filters.date !== 'all') {
      qs.created_at__gte = datesAgo[state.filters.date]();
    }

    const fn = {
      eru: this.props._getDeploymentERU,
      fact: this.props._getDeploymentFACT,
      heop: this.props._getDeploymentHEOP,
      rdrt: this.props._getDeploymentRDRT
    };

    fn[what](state.page, qs);
  }

  updateData (what) {
    this.requestResults(what);
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
    const fact = get(this.props.deployments.fact, 'data.meta.total_count', 0);
    const heop = get(this.props.deployments.heop, 'data.meta.total_count', 0);
    const rdrt = get(this.props.deployments.rdrt, 'data.meta.total_count', 0);

    return (
      <div className='inpage__introduction'>
        <div className='header-stats'>
          <ul className='stats-list'>
            <li className='stats-list__item stats-eru'>
              {n(data.deployed)}<small>Deployed ERU Units</small>
            </li>
            <li className='stats-list__item stats-fact'>
              {n(fact)}<small>Deployed FACTs</small>
            </li>
            <li className='stats-list__item stats-people'>
              {n(rdrt)}<small>Deployed RDRTs</small>
            </li>
            <li className='stats-list__item stats-heops'>
              {n(heop)}<small>Deployed Heops</small>
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

  renderERUTable () {
    const {
      fetched,
      fetching,
      error,
      data
    } = this.props.deployments.eru;

    if (fetching) {
      return (
        <Fold title='ERU'>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title='ERU'>
          <p>Oh no! An error ocurred getting the data.</p>
        </Fold>
      );
    }

    if (fetched) {
      const headings = [
        {
          id: 'name',
          label: 'Name'
        },
        { id: 'country', label: 'Country' },
        { id: 'type', label: 'Type' },
        { id: 'emer', label: 'Emergency' },
        { id: 'personnel', label: 'Personnel Units' },
        { id: 'equipment', label: 'Equipment Units' }
      ];

      const rows = data.objects.map(o => ({
        id: o.id,
        name: o.eru_owner.country.society_name,
        country: <ul>{o.countries.map(country => <li key={country.id}><Link to={`/countries/${country.id}`} className='link--primary' title='View Country'>{country.name}</Link></li>)}</ul>,
        type: getEruType(o.type),
        emer: o.event ? <Link to={`/emergencies/${o.event.id}`} className='link--primary' title='View Emergency'>{o.event.name}</Link> : nope,
        personnel: o.units,
        equipment: o.equipment_units
      }));

      return (
        <Fold title={`ERU (${data.meta.total_count})`}>
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.meta.total_count / data.meta.limit}
            page={data.meta.offset / data.meta.limit}
            onPageChange={this.handlePageChange.bind(this, 'eru')}
          />
        </Fold>
      );
    }

    return null;
  }

  renderHeopsTable () {
    const {
      fetched,
      fetching,
      error,
      data
    } = this.props.deployments.heop;

    if (fetching) {
      return (
        <Fold title='HeOps'>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title='HeOps'>
          <p>Oh no! An error ocurred getting the data.</p>
        </Fold>
      );
    }

    if (fetched) {
      const headings = [
        {
          id: 'date',
          label: <FilterHeader id='date' title='Start Date' options={dateOptions} filter={this.state.heop.filters.date} onSelect={this.handleFilterChange.bind(this, 'heop', 'date')} />
        },
        {
          id: 'name',
          label: <SortHeader id='name' title='Name' sort={this.state.heop.sort} onClick={this.handleSortChange.bind(this, 'heop', 'name')} />
        },
        { id: 'country', label: 'Country' },
        { id: 'emer', label: 'Emergency' }
      ];

      const rows = data.objects.map(o => ({
        id: o.id,
        date: DateTime.fromISO(o.start_date).toISODate(),
        name: o.person || na,
        country: <Link to={`/countries/${o.country.id}`} className='link--primary' title='View Country'>{o.country.name}</Link>,
        emer: o.event ? <Link to={`/emergencies/${o.event.id}`} className='link--primary' title='View Emergency'>{o.event.name}</Link> : nope
      }));

      return (
        <Fold title={`HeOps (${data.meta.total_count})`}>
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.meta.total_count / data.meta.limit}
            page={data.meta.offset / data.meta.limit}
            onPageChange={this.handlePageChange.bind(this, 'heop')}
          />
        </Fold>
      );
    }

    return null;
  }

  // Render for FATC, RDRT
  renderDeploymentsTable (what) {
    const title = {
      fact: 'FACT',
      rdrt: 'RDRT/RIT'
    };

    const {
      fetched,
      fetching,
      error,
      data
    } = this.props.deployments[what];

    if (fetching) {
      return (
        <Fold title={title[what]}>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title={title[what]}>
          <p>Oh no! An error ocurred getting the data.</p>
        </Fold>
      );
    }

    if (fetched) {
      const headings = [
        {
          id: 'date',
          label: <FilterHeader id='date' title='Start Date' options={dateOptions} filter={this.state[what].filters.date} onSelect={this.handleFilterChange.bind(this, what, 'date')} />
        },
        { id: 'people', label: 'People' },
        { id: 'country', label: 'Country' },
        { id: 'emer', label: 'Emergency' }
      ];

      const rows = data.objects.map(o => ({
        id: o.id,
        date: DateTime.fromISO(o.start_date).toISODate(),
        people: n(o.people.length),
        country: <Link to={`/countries/${o.country.id}`} className='link--primary' title='View Country'>{o.country.name}</Link>,
        emer: o.event ? <Link to={`/emergencies/${o.event.id}`} className='link--primary' title='View Emergency'>{o.event.name}</Link> : nope
      }));

      return (
        <Fold title={`${title[what]} (${data.meta.total_count})`}>
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.meta.total_count / data.meta.limit}
            page={data.meta.offset / data.meta.limit}
            onPageChange={this.handlePageChange.bind(this, what)}
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
          <Map data={this.props.deployments.geojson} />
        </div>
        <div className='inpage__body'>
          <div className='inner'>
            {this.renderERUTable()}
          </div>
          <div className='inner'>
            {this.renderDeploymentsTable('fact')}
          </div>
          <div className='inner'>
            {this.renderDeploymentsTable('rdrt')}
          </div>
          <div className='inner'>
            {this.renderHeopsTable()}
          </div>
          <div className='inner'>
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
    eruOwners: T.object,
    deployments: T.object
  };
}

const selector = (state) => ({
  eruOwners: state.eruOwners,
  deployments: state.deployments
});

const dispatcher = (dispatch) => ({
  _getEruOwners: () => dispatch(getEruOwners()),
  _getDeploymentERU: (...args) => dispatch(getDeploymentERU(...args)),
  _getDeploymentFACT: (...args) => dispatch(getDeploymentFACT(...args)),
  _getDeploymentHEOP: (...args) => dispatch(getDeploymentHEOP(...args)),
  _getDeploymentRDRT: (...args) => dispatch(getDeploymentRDRT(...args)),
  _getAllDeploymentERU: (...args) => dispatch(getAllDeploymentERU(...args)),
  _getAllDeploymentFACT: (...args) => dispatch(getAllDeploymentFACT(...args)),
  _getAllDeploymentHEOP: (...args) => dispatch(getAllDeploymentHEOP(...args)),
  _getAllDeploymentRDRT: (...args) => dispatch(getAllDeploymentRDRT(...args))
});

export default connect(selector, dispatcher)(Deployments);

'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { PropTypes as T } from 'prop-types';
import { DateTime } from 'luxon';
import c from 'classnames';

import {
  enterFullscreen,
  exitFullscreen,
  isFullscreen,
  addFullscreenListener,
  removeFullscreenListener
} from '../utils/fullscreen';
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
      fullscreen: false,
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
          startDate: 'all'
        }
      },
      heop: {
        page: 1,
        sort: {
          field: '',
          direction: 'asc'
        },
        filters: {
          startDate: 'all'
        }
      },
      rdrt: {
        page: 1,
        sort: {
          field: '',
          direction: 'asc'
        },
        filters: {
          startDate: 'all'
        }
      }
    };
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.onFullscreenChange = this.onFullscreenChange.bind(this);
  }

  componentDidMount () {
    addFullscreenListener(this.onFullscreenChange);
    showGlobalLoading();
    this.props._getEruOwners();

    this.props._getDeploymentERU();
    this.props._getDeploymentFACT(1, { order_by: '-start_date' });
    this.props._getDeploymentHEOP(1, { order_by: '-start_date' });
    this.props._getDeploymentRDRT(1, { order_by: '-start_date' });

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

  componentWillUnmount () {
    removeFullscreenListener(this.onFullscreenChange);
  }

  onFullscreenChange () {
    this.setState({fullscreen: isFullscreen()});
  }

  toggleFullscreen () {
    if (isFullscreen()) {
      exitFullscreen();
      this.setState({fullscreen: false});
    } else {
      enterFullscreen(document.querySelector('#presentation'));
      this.setState({fullscreen: true});
    }
  }

  requestResults (what) {
    let qs = {};
    let state = this.state[what];
    if (state.sort && state.sort.field) {
      qs.order_by = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    } else if (what !== 'eru') {
      qs.order_by = '-start_date';
    }

    if (state.filters && state.filters.startDate !== 'all') {
      qs.start_date__gte = datesAgo[state.filters.startDate]();
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
                <span className='key'>{o.name} ({o.items})</span>
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
      </div>
    );
  }

  renderCharts () {
    const { data } = this.props.eruOwners;
    return (
      <div className='fold'>
        <div className='inner'>
          <div className='inpage__body-charts'>
            <div className='chart'>
              {this.renderHeaderCharts(data.types, 'ERU Deployment Types')}
            </div>
            <div className='chart'>
              {this.renderHeaderCharts(data.owners, 'Number of Deployments by NS')}
            </div>
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
        <div className='inner'>
          <Fold title='Deployed ERU'>
            <BlockLoading/>
          </Fold>
        </div>
      );
    }

    if (error || !get(data, 'objects.length')) {
      return null;
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
        name: get(o, 'eru_owner.national_society_country.society_name') || get(o, 'eru_owner.national_society_country.name', nope),
        country: o.deployed_to ? <Link to={`/countries/${o.deployed_to.id}`} className='link--primary' title='View Country'>{o.deployed_to.name}</Link> : nope,
        type: getEruType(o.type),
        emer: o.event ? <Link to={`/emergencies/${o.event.id}`} className='link--primary' title='View Emergency'>{o.event.name}</Link> : nope,
        personnel: o.units,
        equipment: o.equipment_units
      }));

      return (
        <div className='inner'>
          <Fold title={`Deployed ERU (${n(data.meta.total_count)})`}>
            <DisplayTable
              headings={headings}
              rows={rows}
              pageCount={data.meta.total_count / data.meta.limit}
              page={data.meta.offset / data.meta.limit}
              onPageChange={this.handlePageChange.bind(this, 'eru')}
            />
          </Fold>
        </div>
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
        <div className='inner'>
          <Fold title='HeOps'>
            <BlockLoading/>
          </Fold>
        </div>
      );
    }

    if ((error || !get(data, 'objects.length')) && this.state.heop.filters.startDate === 'all') {
      return null;
    }

    if (fetched) {
      const headings = [
        {
          id: 'startDate',
          label: <FilterHeader id='startDate' title='Start Date' options={dateOptions} filter={this.state.heop.filters.startDate} onSelect={this.handleFilterChange.bind(this, 'heop', 'startDate')} />
        },
        { id: 'endDate', label: 'End Date' },
        {
          id: 'name',
          label: <SortHeader id='name' title='Name' sort={this.state.heop.sort} onClick={this.handleSortChange.bind(this, 'heop', 'name')} />
        },
        { id: 'country', label: 'Country' },
        { id: 'emer', label: 'Emergency' }
      ];

      const rows = data.objects.map(o => ({
        id: o.id,
        startDate: DateTime.fromISO(o.start_date).toISODate(),
        endDate: DateTime.fromISO(o.end_date).toISODate() || nope,
        name: o.person || na,
        country: <Link to={`/countries/${o.country.id}`} className='link--primary' title='View Country'>{o.country.name}</Link>,
        emer: o.event ? <Link to={`/emergencies/${o.event.id}`} className='link--primary' title='View Emergency'>{o.event.name}</Link> : nope
      }));

      return (
        <div className='inner'>
          <Fold title={`HeOps (${n(data.meta.total_count)})`}>
            <DisplayTable
              headings={headings}
              rows={rows}
              pageCount={data.meta.total_count / data.meta.limit}
              page={data.meta.offset / data.meta.limit}
              onPageChange={this.handlePageChange.bind(this, 'heop')}
            />
          </Fold>
        </div>
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
        <div className='inner'>
          <Fold title={title[what]}>
            <BlockLoading/>
          </Fold>
        </div>
      );
    }

    if ((error || !get(data, 'objects.length')) && this.state[what].filters.startDate === 'all') {
      return null;
    }

    if (fetched) {
      const headings = [
        {
          id: 'startDate',
          label: <FilterHeader id='startDate' title='Start Date' options={dateOptions} filter={this.state[what].filters.startDate} onSelect={this.handleFilterChange.bind(this, what, 'startDate')} />
        },
        { id: 'endDate', label: 'End Date' },
        { id: 'name', label: 'Name' },
        { id: 'role', label: 'Role' },
        { id: 'country', label: 'Country' },
        { id: 'emer', label: 'Emergency' },
        { id: 'society', label: 'National Society' }
      ];

      const rows = data.objects.map(o => ({
        id: o.id,
        startDate: DateTime.fromISO(o.start_date).toISODate(),
        endDate: DateTime.fromISO(o.end_date).toISODate(),
        name: o.name,
        role: get(o, 'role', nope),
        country: o[what].country ? <Link to={`/countries/${o[what].country.id}`} className='link--primary' title='View Country'>{o[what].country.name}</Link> : nope,
        emer: o[what].event ? <Link to={`/emergencies/${o[what].event.id}`} className='link--primary' title='View Emergency'>{o[what].event.name}</Link> : nope,
        society: get(o, 'society_deployed_from', nope)
      }));

      return (
        <div className='inner'>
          <Fold title={`${title[what]} (${n(data.meta.total_count)})`}>
            <DisplayTable
              headings={headings}
              rows={rows}
              pageCount={data.meta.total_count / data.meta.limit}
              page={data.meta.offset / data.meta.limit}
              onPageChange={this.handlePageChange.bind(this, what)}
            />
          </Fold>
        </div>
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
      <section>
        <section className={c('inpage', {presenting: this.state.fullscreen})} id='presentation'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <div className='inpage__headline-content'>
                  <h1 className='inpage__title'>Deployments</h1>
                  <div className='presentation__actions'>
                    <div className='inner'>
                      <button className='button button--base-plain button--fullscreen' onClick={this.toggleFullscreen} title='View in fullscreen'><span>FullScreen</span></button>
                    </div>
                  </div>
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
              {this.renderCharts()}
            </div>
          </div>
        </section>
        <div className='inpage__body'>
          {this.renderERUTable()}
          {this.renderDeploymentsTable('fact')}
          {this.renderDeploymentsTable('rdrt')}
          {this.renderHeopsTable()}
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

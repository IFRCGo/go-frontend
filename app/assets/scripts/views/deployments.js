'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';
import { Helmet } from 'react-helmet';

import {
  enterFullscreen,
  exitFullscreen,
  isFullscreen,
  addFullscreenListener,
  removeFullscreenListener
} from '../utils/fullscreen';
import {
  getAllDeploymentERU,
  getActivePersonnel,
  getEruOwners
} from '../actions';
import { finishedFetch, datesAgo } from '../utils/utils';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { environment } from '../config';
import {
  commaSeparatedNumber as n,
  nope
} from '../utils/format';

import App from './app';
import Progress from '../components/progress';
import PersonnelTable from '../components/connected/personnel-table';
import EruTable from '../components/connected/eru-table';
import { SFPComponent } from '../utils/extendables';
import DeploymentsMap from '../components/map/deployments-map';
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
        limit: 5,
        page: 1
      }
    };
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.onFullscreenChange = this.onFullscreenChange.bind(this);
  }

  componentDidMount () {
    addFullscreenListener(this.onFullscreenChange);
    showGlobalLoading();
    this.props._getEruOwners();
    this.props._getAllDeploymentERU();
    this.props._getActivePersonnel();
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
    let state = this.state[what];
    let qs = { limit: state.limit };
    if (state.sort && state.sort.field) {
      qs.ordering = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    } else if (what !== 'eru') {
      qs.ordering = '-start_date';
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
    const { types } = this.props.activePersonnel;
    const fact = types.fact || nope;
    const heop = types.heop || nope;
    const rdrt = types.rdrt || nope;

    return (
      <div className='inpage__introduction'>
        <div className='header-stats'>
          <ul className='stats-list'>
            <li className='stats-list__item stats-eru'>
              {n(data.deployed)}<small>Deployed ERUs</small>
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
                  { /* <div className='presentation__actions'>
                    <div className='inner'>
                      <button className='button button--base-plain button--fullscreen' onClick={this.toggleFullscreen} title='View in fullscreen'><span>FullScreen</span></button>
                    </div>
                  </div> */ }
                  {this.renderHeaderStats()}
                </div>
              </div>
            </div>
          </header>
          <div>
            <DeploymentsMap data={this.props.locations} />
          </div>
          <div className='inpage__body'>
            <div className='inner'>
              {this.renderCharts()}
            </div>
          </div>
        </section>
        <div className='inpage__body'>
          <div className='inner'>
            <EruTable limit={5} viewAll={'/deployments/erus/all'} />
          </div>
          <div className='inner'>
            <PersonnelTable limit={20} viewAll={'/deployments/personnel/all'} />
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
        <Helmet>
          <title>IFRC Go - Deployments</title>
        </Helmet>
        {this.renderContent()}
      </App>
    );
  }
}

if (environment !== 'production') {
  Deployments.propTypes = {
    _getEruOwners: T.func,
    _getActivePersonnel: T.func,
    _getAllDeploymentERU: T.func,
    eruOwners: T.object,
    eru: T.object,
    activePersonnel: T.object,
    locations: T.object
  };
}

const selector = (state) => ({
  eruOwners: state.eruOwners,
  activePersonnel: state.deployments.activePersonnel,
  locations: state.deployments.locations
});

const dispatcher = (dispatch) => ({
  _getEruOwners: () => dispatch(getEruOwners()),
  _getAllDeploymentERU: (...args) => dispatch(getAllDeploymentERU(...args)),
  _getActivePersonnel: (...args) => dispatch(getActivePersonnel(...args))
});

export default connect(selector, dispatcher)(Deployments);

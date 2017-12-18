'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';

import { getEruOwners } from '../actions';
import { finishedFetch } from '../utils/utils';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { environment } from '../config';
import {
  commaSeparatedNumber as n
} from '../utils/format';

import App from './app';
import AlertsTable from '../components/connected/alerts-table';
import Progress from '../components/progress';
import Map from '../components/deployments/map';
import Readiness from '../components/deployments/readiness';

class Deployments extends React.Component {
  componentDidMount () {
    showGlobalLoading();
    this.props._getEruOwners();
  }

  componentWillReceiveProps (nextProps) {
    if (finishedFetch(this.props, nextProps, 'eruOwners')) {
      hideGlobalLoading();
    }
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
            <li className='stats-list__item stats-emergencies'>
              {n(data.deployed)}<small>Deployed ERUs</small>
            </li>
            <li className='stats-list__item stats-funding stat-borderless stat-double'>
              {n(data.ready)}<small>Ready ERUs</small>
            </li>
          </ul>
        </div>
        <div className='inpage__headline-charts'>
          <div className='stats-chart'>
            {this.renderHeaderCharts(data.types, 'ERU Deployment Types')}
            {this.renderHeaderCharts(data.owners, 'Number of Deployments by NS')}
          </div>
        </div>
      </div>
    );
  }

  renderContent () {
    const {
      fetched,
      error,
      data
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
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
        <div>
          <AlertsTable />
        </div>
        <div>
          <Readiness eruOwners={this.props.eruOwners} />
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

'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import { PropTypes as T } from 'prop-types';

import App from './app';
import EmergenciesDash from '../components/connected/emergencies-dash';
import EmergenciesTable from '../components/connected/emergencies-table';

import { getLastMonthsEmergencies, getAggregateEmergencies } from '../actions';
import { finishedFetch } from '../utils/utils';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { environment } from '../config';

class Emergencies extends React.Component {
  componentDidMount () {
    showGlobalLoading(2);
    this.props._getLastMonthsEmergencies();
    this.props._getAggregateEmergencies(DateTime.local().minus({months: 11}).startOf('day').toISODate(), 'month');
  }

  componentWillReceiveProps (nextProps) {
    if (finishedFetch(this.props, nextProps, 'aggregate.month')) {
      hideGlobalLoading();
    }
    if (finishedFetch(this.props, nextProps, 'lastMonth')) {
      hideGlobalLoading();
    }
  }

  render () {
    return (
      <App className='page--emergencies'>
        <section className='inpage'>
          <EmergenciesDash />
          <div className='inpage__body'>
            <div className='inner'>
              <EmergenciesTable />
            </div>
          </div>
        </section>
      </App>
    );
  }
}

if (environment !== 'production') {
  Emergencies.propTypes = {
    _getLastMonthsEmergencies: T.func,
    _getAggregateEmergencies: T.func,
    lastMonth: T.object,
    aggregate: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  lastMonth: state.emergencies.lastMonth,
  aggregate: state.emergencies.aggregate
});

const dispatcher = (dispatch) => ({
  _getAggregateEmergencies: (...args) => dispatch(getAggregateEmergencies(...args)),
  _getLastMonthsEmergencies: () => dispatch(getLastMonthsEmergencies())
});

export default connect(selector, dispatcher)(Emergencies);

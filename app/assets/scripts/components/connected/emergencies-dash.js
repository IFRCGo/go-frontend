'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { DateTime } from 'luxon';

import { environment } from '../../config';
import { getEmergenciesList, getAggregateEmergencies } from '../../actions';
import { finishedFetch } from '../../utils/utils';

import { showGlobalLoading, hideGlobalLoading } from '../global-loading';

import Stats from '../emergencies/stats';

class EmergenciesDash extends React.Component {
  componentDidMount () {
    showGlobalLoading(2);
    this.props._getEmergenciesList();
    this.props._getAggregateEmergencies(DateTime.local().minus({months: 11}).startOf('day').toISODate(), 'month');
  }

  componentWillReceiveProps (nextProps) {
    if (finishedFetch(this.props, nextProps, 'aggregate.month')) {
      hideGlobalLoading();
    }
    if (finishedFetch(this.props, nextProps, 'list')) {
      hideGlobalLoading();
    }
  }

  render () {
    const {
      list,
      aggregate
    } = this.props;

    console.log(list);
    return (
      <header className='inpage__header'>
        <div className='inner'>
          <div className='inpage__headline'>
            <div className='inpage__headline-content'>
              <h1 className='inpage__title'>Emergencies</h1>
              <div className="inpage__introduction--small">
                <Stats list={list} />
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

if (environment !== 'production') {
  EmergenciesDash.propTypes = {
    _getEmergenciesList: T.func,
    _getAggregateEmergencies: T.func,
    list: T.object,
    aggregate: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  list: state.emergencies.list,
  aggregate: state.emergencies.aggregate
});

const dispatcher = (dispatch) => ({
  _getAggregateEmergencies: (...args) => dispatch(getAggregateEmergencies(...args)),
  _getEmergenciesList: () => dispatch(getEmergenciesList())
});

export default connect(selector, dispatcher)(EmergenciesDash);

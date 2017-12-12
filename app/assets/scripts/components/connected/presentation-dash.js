'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { DateTime } from 'luxon';

import { environment } from '../../config';
import { getAppealsList, getAggregateAppeals } from '../../actions';
import { finishedFetch } from '../../utils/utils';

import { showGlobalLoading, hideGlobalLoading } from '../global-loading';

import Homestats from '../homestats';
import Homemap from '../homemap';
import HomeCharts from '../homecharts';

class PresentationDash extends React.Component {
  componentDidMount () {
    showGlobalLoading(3);
    this.props._getAppealsList();
    this.props._getAggregateAppeals(DateTime.local().minus({months: 11}).startOf('day').toISODate(), 'month');
    this.props._getAggregateAppeals('1990-01-01', 'year');
  }

  componentWillReceiveProps (nextProps) {
    if (finishedFetch(this.props, nextProps, 'appealsList')) {
      hideGlobalLoading();
    }
    if (finishedFetch(this.props, nextProps, 'aggregate.month')) {
      hideGlobalLoading();
    }
    if (finishedFetch(this.props, nextProps, 'aggregate.year')) {
      hideGlobalLoading();
    }
  }

  render () {
    const {
      appealsList,
      aggregate
    } = this.props;

    return (
      <section className='fold--stats'>
        <h1 className='visually-hidden'>Statistics</h1>
        <div className='inner'>
          <Homestats
            appealsList={appealsList} />
        </div>
        <Homemap
          appealsList={appealsList} />
        <div className='inner'>
          <HomeCharts
            aggregate={aggregate} />
        </div>
      </section>
    );
  }
}

if (environment !== 'production') {
  PresentationDash.propTypes = {
    _getAppealsList: T.func,
    _getAggregateAppeals: T.func,
    appealsList: T.object,
    aggregate: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  appealsList: state.overallStats.appealsList,
  aggregate: state.overallStats.aggregate
});

const dispatcher = (dispatch) => ({
  _getAppealsList: (...args) => dispatch(getAppealsList(...args)),
  _getAggregateAppeals: (...args) => dispatch(getAggregateAppeals(...args))
});

export default connect(selector, dispatcher)(PresentationDash);

'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { DateTime } from 'luxon';
import { LineChart, Line } from 'recharts';

import { environment } from '../../config';
import { getAggregateAppeals } from '../../actions';
import { finishedFetch } from '../../utils/utils';

import { showGlobalLoading, hideGlobalLoading } from '../global-loading';

class HomeCharts extends React.Component {
  componentDidMount () {
    showGlobalLoading(2);
    this.props._getAggregateAppeals(DateTime.local().minus({months: 12}).startOf('day').toISODate(), 'month');
    this.props._getAggregateAppeals('1990-01-01', 'year');
  }

  componentWillReceiveProps (nextProps) {
    if (finishedFetch(this.props, nextProps, 'aggregate.month')) {
      hideGlobalLoading();
    }
    if (finishedFetch(this.props, nextProps, 'aggregate.year')) {
      hideGlobalLoading();
    }
  }

  renderByMonth () {
    if (!this.props.aggregate.month) return null;

    const {
      data,
      fetched,
      error
    } = this.props.aggregate.month;

    if (!fetched) return null;

    return error ? (
      <p>Oh no! An error ocurred getting the stats.</p>
    ) : (
      <figure className='chart'>
        <figcaption>DREFS and Appeals Over the Last Year</figcaption>
        <div className='chart__container'>
          <LineChart width={400} height={200} data={data}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </div>
      </figure>
    );
  }

  renderByYear () {
    if (!this.props.aggregate.year) return null;

    const {
      data,
      fetched,
      error
    } = this.props.aggregate.year;

    if (!fetched) return null;

    return error ? (
      <p>Oh no! An error ocurred getting the stats.</p>
    ) : (
      <figure className='chart'>
        <figcaption>DREFS and Appeals by Year</figcaption>
        <div className='chart__container'>
          <LineChart width={400} height={200} data={data}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </div>
      </figure>
    );
  }

  render () {
    return (
      <React.Fragment>
        <h1 className='visually-hidden'>DREFS and Appeals over time</h1>
        <div>
          {this.renderByMonth()}
          {this.renderByYear()}
        </div>
      </React.Fragment>
    );
  }
}

if (environment !== 'production') {
  HomeCharts.propTypes = {
    _getAggregateAppeals: T.func,
    aggregate: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  aggregate: state.overallStats.aggregate
});

const dispatcher = (dispatch) => ({
  _getAggregateAppeals: (...args) => dispatch(getAggregateAppeals(...args))
});

export default connect(selector, dispatcher)(HomeCharts);

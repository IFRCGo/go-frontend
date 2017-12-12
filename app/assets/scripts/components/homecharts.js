'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { DateTime } from 'luxon';

import { environment } from '../config';

export default class HomeCharts extends React.Component {
  renderChart (data, unit) {
    let tickFormatter;

    switch (unit) {
      case 'month':
        tickFormatter = (date) => DateTime.fromISO(date).toFormat('MMM');
        break;
      case 'year':
        tickFormatter = (date) => DateTime.fromISO(date).toFormat('yyyy');
        break;
    }

    return (
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis tickFormatter={tickFormatter} dataKey='timespan' axisLine={false} padding={{ left: 16 }} />
          <YAxis axisLine={false} tickLine={false} width={32} padding={{ bottom: 16 }} />
          <Line type="monotone" dataKey="count" stroke="#C22A26" />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    );
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
          {this.renderChart(data, 'month')}
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
          {this.renderChart(data, 'year')}
        </div>
      </figure>
    );
  }

  render () {
    return (
      <div className='stats-chart'>
        <h1 className='visually-hidden'>DREFS and Appeals over time</h1>
        <div>
          {this.renderByMonth()}
          {this.renderByYear()}
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  HomeCharts.propTypes = {
    _getAggregateAppeals: T.func,
    aggregate: T.object
  };
}

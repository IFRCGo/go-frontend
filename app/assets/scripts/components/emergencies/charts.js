'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { DateTime } from 'luxon';

import { environment } from '../../config';
import Progress from '../progress';

export default class HomeCharts extends React.Component {
  renderEmergencies () {
    const { lastMonth } = this.props;
    if (!lastMonth.fetched) return;
    const emerg = lastMonth.data.emergenciesByType;
    const max = Math.max.apply(Math, emerg.map(o => o.items.length));

    return (
      <div className='emergencies'>
        <h2>Emergencies by Type</h2>
        <div className='emergencies__container'>
          <ul className='emergencies__list'>
            {emerg.map(o => (
              <li className='emergencies__item' key={o.id}>
                <span className='key'>{o.name}</span>
                <span className='value'><Progress value={o.items.length} max={max}><span>100</span></Progress></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  renderChart (data, unit) {
    const tickFormatter = (date) => DateTime.fromISO(date).toFormat('MMM');
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
      fetched,
      data
    } = this.props.aggregate.month;

    if (!fetched) return null;

    return (
      <figure className='chart'>
        <figcaption>Emergencies Over the Last Year</figcaption>
        <div className='chart__container'>
          {this.renderChart(data, 'month')}
        </div>
      </figure>
    );
  }

  render () {
    return (
      <div className='stats-chart'>
        <h1 className='visually-hidden'>DREFS and Appeals over time</h1>
        {this.renderByMonth()}
        {this.renderEmergencies()}
      </div>
    );
  }
}

if (environment !== 'production') {
  HomeCharts.propTypes = {
    aggregate: T.object,
    lastMonth: T.object
  };
}

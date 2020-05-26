import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { DateTime } from 'luxon';

import { environment } from '#config';
import Stats from '#components/emergencies/stats';
import EmergenciesMap from '#components/map/emergencies-map';
import Progress from '#components/progress';
import BlockLoading from '#components/block-loading';

class EmergenciesDash extends React.Component {
  renderEmergencies () {
    const { lastMonth } = this.props;
    if (!lastMonth.fetched && !lastMonth.error) return <BlockLoading />;
    else if (lastMonth.error) return <p>An error occurred</p>;
    const emerg = lastMonth.data.emergenciesByType.slice(0, 6);
    const max = Math.max.apply(Math, emerg.map(o => o.items.length));
    return (
      <div className='emergencies'>
        <h2>Emergencies by Type</h2>
        <div className='emergencies__container'>
          <ul className='emergencies__list emergenciest__list--static'>
            {emerg.map(o => (
              <li key={o.id}
                className='emergencies__item'>
                <span className='key'>{o.name} ({o.items.length})</span>
                <span className='value'><Progress value={o.items.length} max={max}><span>100</span></Progress></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  renderChart (data, unit) {
    const zone = 'utc';
    const tickFormatter = (date) => DateTime.fromISO(date, {zone}).toFormat('MMM');
    const contentFormatter = (payload) => {
      if (!payload.payload[0]) { return null; }

      const item = payload.payload[0].payload;
      return (
        <article className='chart-tooltip'>
          <div className='chart-tooltip__contents'>
            <dl>
              <dd>Date</dd>
              <dt>{DateTime.fromISO(item.timespan, {zone}).toFormat('MMMM yyyy')}</dt>
              <dd>Total</dd>
              <dt>{item.count}</dt>
            </dl>
          </div>
        </article>
      );
    };

    return (
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis tickFormatter={tickFormatter} dataKey='timespan' axisLine={false} padding={{ left: 16, right: 16 }} />
          <YAxis axisLine={false} tickLine={false} width={32} padding={{ bottom: 16 }} />
          <Line type="monotone" dataKey="count" stroke="#f5333f" />
          <Tooltip content={contentFormatter}/>
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
    const { lastMonth } = this.props;

    return (
      <div>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <div className='inpage__headline-content'>
                <h1 className='inpage__title'>Emergencies in the last 30 days</h1>
                <div className='inpage__introduction'>
                  <div className='inpage__headline-stats'>
                    <Stats lastMonth={lastMonth} />
                  </div>
                  <div className='inpage__headline-charts'>
                    <div className='stats-chart'>
                      <h1 className='visually-hidden'>DREFS and Appeals over time</h1>
                      {this.renderByMonth()}
                      {this.renderEmergencies()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <section className='map-section__container'>
          <EmergenciesMap lastMonth={lastMonth} />
        </section>
      </div>
    );
  }
}

if (environment !== 'production') {
  EmergenciesDash.propTypes = {
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

export default connect(selector)(EmergenciesDash);

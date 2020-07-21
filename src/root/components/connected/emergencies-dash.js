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
import Translate from '#components/Translate';

class EmergenciesDash extends React.Component {
  renderEmergencies () {
    const { lastMonth } = this.props;
    if (!lastMonth.fetched && !lastMonth.error) return <BlockLoading />;
    else if (lastMonth.error) return <p>An error occurred</p>;
    const emerg = lastMonth.data.emergenciesByType.slice(0, 6);
    const max = Math.max.apply(Math, emerg.map(o => o.items.length));
    return (
      <div className='col col-6-mid spacing-v'>
        <div className='chart emergencies'>
          <figcaption>
            <h2 className='fold__title'>
              <Translate stringId='emergenciesDashHeading' />
            </h2>
          </figcaption>
          <div className='emergencies__container spacing-2'>
            <ul className='emergencies__list emergenciest__list--static'>
              {emerg.map(o => (
                <li key={o.id}
                  className='emergencies__item'>
                  <span className='key'>{o.name}</span>
                  <span className='value'>
                    <Progress value={o.items.length} max={max}><span>100</span></Progress>
                    <span className='key__value__emergency'>{o.items.length}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
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
              <dd>
                <Translate stringId='emergenciesDashDate' />
              </dd>
              <dt>{DateTime.fromISO(item.timespan, {zone}).toFormat('MMMM yyyy')}</dt>
              <dd>
                <Translate stringId='emergenciesDashTotal' />
              </dd>
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
      <div className='col col-6-mid spacing-v'>
        <figure className='chart'>
          <figcaption>
            <h2 className='fold__title'><Translate stringId='emergenciesDashOverLastYear' /></h2>
          </figcaption>
          <div className='chart__container'>
            {this.renderChart(data, 'month')}
          </div>
        </figure>
      </div>
    );
  }

  render () {
    const { lastMonth } = this.props;

    return (
      <div>
        <header className='inpage__header'>
          <div className='inner'>
            <div>
              <div className='inpage__headline-content'>
                <div className='container-lg'>
                  <h1 className='inpage__title'>
                    <Translate stringId='emergenciesDashLast30Days' />
                  </h1>
                </div>
                <div className='inpage__headline-stats'>
                  <Stats lastMonth={lastMonth} />
                </div>
                <div className='box__content'>
                  <div className='container-lg'>
                    <div className='inpage__headline-charts'>
                      <h1 className='visually-hidden'>
                        <Translate stringId='emergenciesDashOverTime'/>
                      </h1>
                      <div className='stats-chart'>
                        <div className='row flex-mid stats-chart-row'>
                          {this.renderEmergencies()}
                          {this.renderByMonth()}
                        </div>
                      </div>
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

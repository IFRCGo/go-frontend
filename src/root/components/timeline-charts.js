import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { ResponsiveContainer, LineChart, Line, Legend, XAxis, YAxis, Tooltip } from 'recharts';
import { DateTime } from 'luxon';

import { environment } from '#config';
import BlockLoading from './block-loading';
import { commaSeparatedLargeNumber } from '#utils/format';
import { getAggregateAppeals } from '#actions';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

class TimelineCharts extends React.Component {
  componentDidMount () {
    const lastYear = DateTime.local().minus({months: 11}).startOf('day').toISODate();
    const lastDecade = DateTime.local().minus({years: 10}).startOf('day').toISODate();

    this.props._getAggregateAppeals(lastYear, 'month', 'drefs', this.props.region);
    this.props._getAggregateAppeals(lastYear, 'month', 'appeals', this.props.region);
    this.props._getAggregateAppeals(lastDecade, 'year', 'drefs', this.props.region);
    this.props._getAggregateAppeals(lastDecade, 'year', 'appeals', this.props.region);
  }

  renderChart (data, unit) {
    let tickFormatter;
    let contentDateFormatter;

    const { strings } = this.context;
    const zone = 'utc';
    switch (unit) {
      case 'month':
        tickFormatter = (date) => DateTime.fromISO(date, {zone}).toFormat('MMM');
        contentDateFormatter = (date) => DateTime.fromISO(date, {zone}).toFormat('MMMM yyyy');
        break;
      case 'year':
        tickFormatter = (date) => DateTime.fromISO(date, {zone}).toFormat('yyyy');
        contentDateFormatter = tickFormatter;
        break;
    }

    const contentFormatter = (payload) => {
      if (!payload.payload[0]) { return null; }

      const item = payload.payload[0].payload;
      return (
        <article className='chart-tooltip chart-tooltip--transparent'>
          <div className='chart-tooltip__contents'>
            <p>{contentDateFormatter(item.timespan)}</p>
            <dl className='tooltip__contents-col appeals-content'>
              <dd>{strings.timeLineChartAppeal}</dd>
              <dt>{item.appeals.count}</dt>
              <dd>{strings.timeLineChartAmount}</dd>
              <dt>{commaSeparatedLargeNumber(item.appeals.amount_funded)}</dt>
              <dd>{strings.timeLineChartPeopleTargeted}</dd>
              <dt>{commaSeparatedLargeNumber(item.appeals.beneficiaries)}</dt>
            </dl>
            <dl className='tooltip__contents-col drefs-content'>
              <dd>{strings.timeLineChartDREFs}</dd>
              <dt>{item.drefs.count}</dt>
              <dd>{strings.timeLineChartDrefsAmount}</dd>
              <dt>{commaSeparatedLargeNumber(item.drefs.amount_funded)}</dt>
              <dd>{strings.timeLineChartDrefsPeopleTargeted}</dd>
              <dt>{commaSeparatedLargeNumber(item.drefs.beneficiaries)}</dt>
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
          <Line name={strings.timeLineChartAppeal} type='monotone' dataKey='appeals.count' stroke='#f5333f' />
          <Line name={strings.timeLineChartDREFs} type='monotone' dataKey='drefs.count' stroke='#F39C12' />
          <Tooltip content={contentFormatter}/>
          <Legend verticalAlign='bottom' iconType='circle' iconSize={10} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  renderByMonth () {
    if (!this.props.aggregate['month-drefs'] || !this.props.aggregate['month-appeals']) return null;

    const {
      data: dataDrefs,
      fetched: fetchedDrefs,
      error: errorDrefs
    } = this.props.aggregate['month-drefs'];

    const {
      data: dataAppeals,
      fetched: fetchedAppeals,
      error: errorAppeals
    } = this.props.aggregate['month-appeals'];

    if (!fetchedDrefs || !fetchedAppeals) return null;

    if (errorDrefs || errorAppeals) {
      return (
        <p>
          <Translate stringId='timeLineChartError'/>
        </p>
      );
    }

    const data = dataDrefs.map((o, i) => {
      const {timespan, ...drefData} = o;
      // Sometimes a month or year will have a DREF, but no appeals data yet.
      // The aggregate URL endpoint won't return an empty object for the appeal,
      // so stub it.
      const {timespan: _, ...appealsData} = dataAppeals.find(o => o.timespan === timespan) || {count: 0};

      return {
        timespan: timespan,
        drefs: drefData,
        appeals: appealsData
      };
    });

    return (
      <div className='col col-6-sm'>
        <figure className='chart box__content'>
          <figcaption className='fold__title'>
            <Translate stringId='timeLineChartByMonthTitle'/>
          </figcaption>
          <div className='chart__container charts__container__rtl margin-t'>
            {this.renderChart(data, 'month')}
          </div>
        </figure>
      </div>
    );
  }

  renderByYear () {
    if (!this.props.aggregate['year-drefs'] || !this.props.aggregate['year-appeals']) return null;

    const {
      data: dataDrefs,
      fetched: fetchedDrefs,
      error: errorDrefs
    } = this.props.aggregate['year-drefs'];

    const {
      data: dataAppeals,
      fetched: fetchedAppeals,
      error: errorAppeals
    } = this.props.aggregate['year-appeals'];

    if (!fetchedDrefs || !fetchedAppeals) return null;

    if (errorDrefs || errorAppeals) {
      return (
        <p>
          <Translate stringId='timeLineChartByYearError'/>
        </p>
      );
    }

    const data = dataDrefs.map((o, i) => {
      const {timespan, ...drefData} = o;
      const {timespan: _, ...appealsData} = dataAppeals.find(o => o.timespan === timespan) || {count: 0};

      return {
        timespan: timespan,
        drefs: drefData,
        appeals: appealsData
      };
    });

    return (
      <div className='col col-6-sm'>
        <figure className='chart box__content'>
          <figcaption className='fold__title'>
            <Translate stringId='timeLineChartByYearTitle'/>
          </figcaption>
          <div className='chart__container charts__container__rtl margin-t'>
            {this.renderChart(data, 'year')}
          </div>
        </figure>
      </div>
    );
  }

  renderLoading () {
    if (this.props.aggregate.fetching) {
      return <BlockLoading/>;
    }
  }

  renderError () {
    if (this.props.aggregate.error) {
      return <p>
               <Translate stringId='timeLineChartAggregateError'/>
             </p>;
    }
  }

  renderContent () {
    return (
      <div className='row flex-sm'>
        {this.renderByMonth()}
        {this.renderByYear()}
      </div>
    );
  }

  render () {
    return (
      <div className='stats-chart margin-t margin-3-b'>
        <h1 className='visually-hidden'>
          <Translate stringId='timeLineChartHeading'/>
        </h1>
        {this.renderLoading()}
        {this.renderError()}
        {this.renderContent()}
      </div>
    );
  }
}

if (environment !== 'production') {
  TimelineCharts.propTypes = {
    _getAggregateAppeals: T.func,
    aggregate: T.object,
    region: T.number
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
TimelineCharts.contextType = LanguageContext;
export default connect(selector, dispatcher)(TimelineCharts);

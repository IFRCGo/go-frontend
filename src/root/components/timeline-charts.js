import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { ResponsiveContainer, LineChart, Line, Legend, XAxis, YAxis, Tooltip } from 'recharts';
import { find, sortBy } from 'lodash';
import { DateTime } from 'luxon';
import { listToMap } from '@togglecorp/fujs';

import { environment } from '#config';
import BlockLoading from './block-loading';
import { commaSeparatedLargeNumber } from '#utils/format';
import { getAggregateAppeals } from '#actions';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

const getMonthKey = (d) => {
  const date = new Date(d);
  return `${date.getFullYear()}-${date.getMonth()}`;
};

const monthTickFormatter = (date) => {
  const zone = 'utc';
  const month = DateTime.fromISO(date, {zone}).toFormat('MMM');
  return month;
};

const yearTickFormatter = (date) => {
  const zone = 'utc';
  const year = DateTime.fromISO(date, {zone}).toFormat('yyyy');
  return year;
};


function MonthlyChart({
  data,
  contentFormatter,
}) {
  const { strings } = React.useContext(LanguageContext);
  const dataByMonth = React.useMemo(() => (
    listToMap(
      data,
      d => getMonthKey(d.timespan),
      d => d,
    )
  ), [data]);

  const [minDate, maxDate] = React.useMemo(() => {
    const max = new Date();
    const min = new Date(max);
    min.setFullYear(max.getFullYear() - 1);
    min.setMonth(min.getMonth() + 1);

    return [min, max];
  }, []);

  const renderData = React.useMemo(() => {
    const monthlyData = [];

    for (
      let currentDate = new Date(minDate);
      currentDate.getTime() <= maxDate.getTime();
      currentDate.setMonth(currentDate.getMonth() + 1)
    ) {
      const monthKey = getMonthKey(currentDate);
      const currentMonthData = dataByMonth[monthKey];

      monthlyData.push(currentMonthData ?? {
        appeals: { count: 0 },
        drefs: { count: 0, beneficiaries: undefined, amount_funded: undefined },
        timespan: currentDate.toISOString(),
        timestamp: currentDate.getTime(),
      });
    }

    return monthlyData;
  }, [dataByMonth, minDate, maxDate]);


  return (
    <ResponsiveContainer>
      <LineChart data={renderData}>
        <XAxis
          interval={0}
          tickFormatter={monthTickFormatter}
          dataKey="timespan"
          axisLine={false}
          padding={{ left: 16, right: 16 }}
        />
        <YAxis axisLine={false} tickLine={false} width={32} padding={{ bottom: 16 }} />
        <Line name={strings.timeLineChartAppeal} type='monotone' dataKey='appeals.count' stroke='#f5333f' />
        <Line name={strings.timeLineChartDREFs} type='monotone' dataKey='drefs.count' stroke='#F39C12' />
        <Tooltip content={contentFormatter}/>
        <Legend verticalAlign='bottom' iconType='circle' iconSize={10} />
      </LineChart>
    </ResponsiveContainer>
  );

}

function YearlyChart({
  data,
  contentFormatter,
}) {
  const { strings } = React.useContext(LanguageContext);

  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        <XAxis
          interval={0}
          tickFormatter={yearTickFormatter}
          dataKey="timespan"
          axisLine={false}
          padding={{ left: 16, right: 16 }}
        />
        <YAxis axisLine={false} tickLine={false} width={32} padding={{ bottom: 16 }} />
        <Line name={strings.timeLineChartAppeal} type='monotone' dataKey='appeals.count' stroke='#f5333f' />
        <Line name={strings.timeLineChartDREFs} type='monotone' dataKey='drefs.count' stroke='#F39C12' />
        <Tooltip content={contentFormatter}/>
        <Legend verticalAlign='bottom' iconType='circle' iconSize={10} />
      </LineChart>
    </ResponsiveContainer>
  );
}

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
    let contentDateFormatter;

    const { strings } = this.context;
    const zone = 'utc';

    switch (unit) {
      case 'month':
        contentDateFormatter = (date) => DateTime.fromISO(date, {zone}).toFormat('MMMM yyyy');
        break;
      case 'year':
        contentDateFormatter = yearTickFormatter;
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
      <>
        { unit === 'year' && (
          <YearlyChart
            data={data}
            contentFormatter={contentFormatter}
          />
        )}
        {unit === 'month' && (
          <MonthlyChart
            data={data}
            contentFormatter={contentFormatter}
          />
        )}
      </>
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

    let data = dataDrefs.map((o, i) => {
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

    // Deal with missing months
    // We take the min and max month from the data, and use a month by month for loop:
    // If the loop index date is not in the data, then add a new entry in the 'data' array
    // with empty drefs and appeals data
    const dates = dataDrefs.map(({ timespan }) => DateTime.fromISO(timespan, { zone: 'utc' }));
    const minDate = DateTime.min(...dates);
    const maxDate = DateTime.max(...dates);
    for (let curDate = minDate; curDate < maxDate; curDate = curDate.plus({ months: 1})) {
      if (!find(dates, d => d.equals(curDate))) {
        data.push({ timespan: curDate.toISODate({ zone: 'utc'}), drefs: { count: 0 }, appeals: { count: 0 }});
      }
    }

    // Sort by date
    data = sortBy(data, [o => DateTime.fromISO(o.timespan, { zone: 'utc'}).ts]);

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

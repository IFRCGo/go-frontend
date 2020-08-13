import React from 'react';
import _cs from 'classnames';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from 'recharts';

import Translate from '#components/Translate';

import Container from './Container';
import { monthList } from './common';
import styles from './styles.module.scss';

const chartMargin = {
  top: 24,
  right: 10,
  bottom: 10,
  left: 10,
};

function ChartContainer(p) {
  const {
    className,
    containerClassName,
    heading,
    children,
  } = p;

  return (
    <div className={_cs(className, styles.chartContainer)}>
      <header className={styles.header}>
        <h4 className={styles.heading}>
          { heading }
        </h4>
      </header>
      <div className={_cs(containerClassName, styles.content)}>
        <ResponsiveContainer>
          { children }
        </ResponsiveContainer>
      </div>
    </div>
  );
}


function ClimateChart(p){
  const {
    className,
    yearlyEvents,
  } = p;

  const temperatureChartData = React.useMemo(() => (
    yearlyEvents.map(d => ({
      ...d,
      temperature_value: [d.avg_min_temperature, d.avg_max_temperature],
    }))
  ), [yearlyEvents]);

  return (
    <Container
      className={_cs(className, styles.climateChart)}
      heading={<Translate stringId='climateChartHeading' />}
      contentClassName={styles.content}
      exportable
    >
      <ChartContainer
        className={styles.temperatureChart}
        heading="Average min and max temperature"
      >
        <BarChart
          data={temperatureChartData}
          margin={chartMargin}
          barCategoryGap="25%"
        >
          <defs>
            <linearGradient
              id='temperature-chart-gradient'
              x1={0}
              x2={0}
              y1={0}
              y2={1}
            >
              <stop offset='0%' stopColor='#ff5014' />
              <stop offset='100%' stopColor='#f5f5f5' />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke='rgba(0, 0, 0, 0.06)'
            vertical={false}
          />
          <YAxis
            width={30}
            axisLine={false}
          />
          <XAxis
            dataKey='month'
            axisLine={false}
            tickLine={false}
            tickFormatter={(i) => monthList[i-1]}
            tickMargin={10}
          />
          <Bar
            fill='url(#temperature-chart-gradient)'
            dataKey='temperature_value'
          >
            <LabelList position='top' dataKey='avg_max_temperature' />
            <LabelList position='bottom' dataKey='avg_min_temperature' />
          </Bar>
        </BarChart>
      </ChartContainer>
      <ChartContainer
        className={styles.precipitationChart}
        heading="Precipitation totals in mm"
      >
        <BarChart
          data={yearlyEvents}
          margin={chartMargin}
          barCategoryGap="25%"
        >
          <defs>
            <linearGradient
              id='precipitation-chart-gradient'
              x1={0}
              x2={0}
              y1={0}
              y2={1}
            >
              <stop offset='0%' stopColor='#00a0dc' />
              <stop offset='100%' stopColor='#f5f5f5' />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke='rgba(0, 0, 0, 0.06)'
            vertical={false}
          />
          <YAxis width={30} axisLine={false} />
          <XAxis
            dataKey='month'
            axisLine={false}
            tickLine={false}
            tickFormatter={(i) => monthList[i-1]}
            tickMargin={10}
          />
          <Bar
            fill='url(#precipitation-chart-gradient)'
            dataKey='avg_rainfall_precipitation'
          >
            <LabelList position='top' />
          </Bar>
        </BarChart>
      </ChartContainer>
    </Container>
  );
}

export default ClimateChart;

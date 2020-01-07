'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';

import memoize from 'memoize-one';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';

import { sectorList } from '../../../utils/constants';
import DonutChart from '../../../components/donut-chart';

const propTypes = {
  className: PropTypes.string,
  projectList: PropTypes.array,
};

const defaultProps = {
  className: undefined,
  projectList: [],
};

export default class SectorActivity extends React.PureComponent {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  getChartData = memoize((projectList) => {
    const chartData = sectorList.map((s) => ({
      ...s,
      value: projectList.filter(p => String(p.primary_sector) === String(s.key)).length,
    }));

    return chartData.filter(d => d.value);

    // return chartData;
  })

  render () {
    const {
      className,
      projectList,
    } = this.props;

    const chartData = this.getChartData(projectList);

    return (
      <div className={_cs(className, 'three-w-stats-sector-activity')}>
        <h4 className='tc-heading'>
          Projects by sector of activity
        </h4>
        <div className='tc-content'>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
            >
              <XAxis
                dataKey='title'
                type='category'
              />
              <YAxis
                dataKey='value'
                type='number'
                allowDecimals={false}
              />
              <Bar
                fill='#c1cdd1'
                dataKey='value'
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/*
        <div className='sector-activity-content'>
          <DonutChart
            className='sector-activity-donut-chart'
            data={chartData}
            keySelector={d => d.key}
            labelSelector={d => d.title}
            valueSelector={d => d.value}
            colorSelector={d => d.color}
          />
          <div className='sector-activity-legend'>
            { chartData.map(d => (
              d.value ? (
                <div
                  key={d.key}
                  className='sector-activity-legend-item'
                >
                  <div
                    style={{
                      backgroundColor: d.color,
                    }}
                    className='legend-item-block'
                  />
                  <div className='legend-item-title'>
                    [{d.value}] { d.title }
                  </div>
                </div>
              ) : (
                null
              )
            ))}
          </div>
        </div>
        */}
      </div>
    );
  }
}

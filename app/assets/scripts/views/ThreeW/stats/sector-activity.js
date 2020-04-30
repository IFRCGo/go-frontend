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
  Tooltip,
} from 'recharts';

import { sectorList } from '../../../utils/constants';

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
          Activities by sector
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
                width={26}
              />
              <Bar
                fill='#c1cdd1'
                dataKey='value'
                name="Activities"
              />
              <Tooltip cursor={{ fill: 'transparent' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}

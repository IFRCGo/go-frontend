import React from 'react';
import PropTypes from 'prop-types';
import {
  _cs,
  listToGroupList,
} from '@togglecorp/fujs';
import memoize from 'memoize-one';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';

import { statuses } from '#utils/constants';

const propTypes = {
  className: PropTypes.string,
  projectList: PropTypes.array,
};

const defaultProps = {
  className: undefined,
  projectList: [],
};

export default class StatusOverview extends React.PureComponent {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  getChartData = memoize((projectList) => {
    const statusMap = listToGroupList(projectList, d => d.status, d => d);
    const statusMapKeys = Object.keys(statusMap);

    const data = statusMapKeys.map(d => ({
      label: statuses[d],
      value: statusMap[d].length,
    }));

    return data;
  });

  render () {
    const {
      className,
      projectList,
    } = this.props;

    const chartData = this.getChartData(projectList);

    return (
      <div className={_cs(className, 'three-w-stats-status-overview')}>
        <h4 className='tc-heading'>
          Activity status overview
        </h4>
        <div className='tc-content'>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
            >
              <XAxis
                dataKey='label'
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
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}

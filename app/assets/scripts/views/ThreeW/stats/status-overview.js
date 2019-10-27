'use strict';
import React from 'react';
import {
  _cs,
  listToGroupList,
} from '@togglecorp/fujs';

import VerticalBarChart from '../../../components/vertical-bar-chart';

import { statuses } from '../../../utils/constants';

export default class StatusOverview extends React.PureComponent {
  render () {
    const {
      className,
      projectList,
    } = this.props;

    const statusMap = listToGroupList(projectList, d => d.status, d => d);
    const statusMapKeys = Object.keys(statusMap);

    const data = statusMapKeys.map(d => ({
      label: statuses[d],
      value: statusMap[d].length,
    }));

    return (
      <div className={_cs(className, 'three-w-stats-status-overview')}>
        <h4 className='status-overview-heading'>
          Project status overview
        </h4>
        <VerticalBarChart
          className='status-overview-bar-chart'
          data={data}
          labelSelector={d => d.label}
          valueSelector={d => d.value}
          showTicks
          showGrids
        />
      </div>
    );
  }
}

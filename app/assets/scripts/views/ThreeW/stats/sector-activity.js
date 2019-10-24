'use strict';
import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { sectorList } from '../../../utils/constants';
import DonutChart from '../../../components/new/donut-chart';

export default class SectorActivity extends React.PureComponent {
  getRenderData = (projectList) => {
    const renderData = sectorList.map((s) => ({
      ...s,
      value: projectList.filter(p => String(p.primary_sector) === String(s.key)).length,
    }));

    return renderData;
  }

  render () {
    const {
      className,
      projectList,
    } = this.props;

    const renderData = this.getRenderData(projectList);

    return (
      <div className={_cs(className, 'three-w-stats-sector-activity')}>
        <h4 className='sector-activity-heading'>
          Projects by sector of activity
        </h4>
        <div className='sector-activity-content'>
          <DonutChart
            className='sector-activity-donut-chart'
            data={renderData}
            keySelector={d => d.key}
            labelSelector={d => d.title}
            valueSelector={d => d.value}
            colorSelector={d => d.color}
          />
          <div className='sector-activity-legend'>
            { renderData.map(d => (
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
            ))}
          </div>
        </div>
      </div>
    );
  }
}

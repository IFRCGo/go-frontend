'use strict';
import React from 'react';
import {
  _cs,
  listToGroupList,
} from '@togglecorp/fujs';

const ProgressBar = ({
  value,
  max,
}) => {
  const width = 100 * value / max;

  return (
    <div className='three-w-region-progress-bar'>
      <div
        className='three-w-region-progress-bar-progress'
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

const Scale = ({ max }) => {
  const numbers = [];
  for (let i = 0; i <= max; i++) {
    numbers.push(i);
  }

  return (
    <div className='three-w-region-scale'>
      { numbers.map(n => <div key={n}>{n}</div>) }
    </div>
  );
};

export default class RegionOverview extends React.PureComponent {
  render () {
    const {
      className,
      projectList,
    } = this.props;

    const groupedProjectList = listToGroupList(
      projectList,
      d => d.project_district,
      d => d,
    );

    const projectDistrictList = Object.keys(groupedProjectList);
    const maxProjects = Math.max(...projectDistrictList.map(d => groupedProjectList[d].length));

    return (
      <div className={_cs(className, 'three-w-stats-region-overview')}>
        <h4>
          Regions
        </h4>
        <Scale
          max={maxProjects}
        />
        <div>
          { projectDistrictList.map(d => {
            const p = groupedProjectList[d];

            return (
              <div
                key={d}
                className='three-w-region-district'
              >
                <div>
                  {(p[0].project_district_detail || p[0].project_country_detail).name} ({p.length} projects)
                </div>
                <ProgressBar
                  value={p.length}
                  max={maxProjects}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

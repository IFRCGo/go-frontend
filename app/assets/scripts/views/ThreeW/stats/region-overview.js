'use strict';
import React from 'react';
import {
  _cs,
  listToGroupList,
} from '@togglecorp/fujs';

const ProgressBar = (p) => {
  const {
    value,
    max,
  } = p;
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

const MAX_SCALE_STOPS = 5;

function Scale (p) {
  const { max } = p;
  const numbers = [];

  const diff = max / MAX_SCALE_STOPS;

  for (let i = 0; i <= max; i += diff) {
    numbers.push(i);
  }

  return (
    <div className='three-w-region-scale'>
      { numbers.map(n => <div key={n}>{n}</div>) }
    </div>
  );
}

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
    const numBuckets = Math.ceil(maxProjects / MAX_SCALE_STOPS);
    const max = numBuckets * MAX_SCALE_STOPS;

    return (
      <div className={_cs(className, 'three-w-stats-region-overview')}>
        <h4>
          Regions
        </h4>
        <Scale
          max={max}
        />
        <div>
          { projectDistrictList.map(d => {
            const p = groupedProjectList[d];
            const regionName = p[0].project_district_detail ? p[0].project_district_detail.name : 'Countrywide';

            return (
              <div
                key={d}
                className='three-w-region-district'
              >
                <div>
                  {regionName} ({p.length} activities)
                </div>
                <ProgressBar
                  value={p.length}
                  max={max}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

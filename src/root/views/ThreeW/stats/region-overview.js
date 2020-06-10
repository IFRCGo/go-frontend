import React from 'react';
import { _cs } from '@togglecorp/fujs';

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

    const allDistrictList = projectList.map(d => d.project_districts_detail).flat();
    const allDistricts = allDistrictList.reduce((acc, val) => {
      if (!acc[val.name]) {
        acc[val.name] = 0;
      }
      ++acc[val.name];
      return acc;
    }, {});

    const maxProjects = Math.max(...Object.values(allDistricts));
    const numBuckets = Math.ceil(maxProjects / MAX_SCALE_STOPS);
    const max = numBuckets * MAX_SCALE_STOPS;
    const projectDistrictList = Object.keys(allDistricts);

    return (
      <div className={_cs(className, 'three-w-stats-region-overview')}>
        <div className='tc-header'>
          <h4>
            Regions
          </h4>
          <Scale
            max={max}
          />
        </div>
        <div className='tc-content'>
          { projectDistrictList.map(regionName => {
            const projectCount = allDistricts[regionName];

            return (
              <div
                key={regionName}
                className='three-w-region-district'
              >
                <div>
                  {regionName} ({projectCount} projects)
                </div>
                <ProgressBar
                  value={projectCount}
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

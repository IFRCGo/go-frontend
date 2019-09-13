'use strict';
import React from 'react';

import Summary from './stats/summary';
import SectorActivity from './stats/sector-activity';
import StatusOverview from './stats/status-overview';
import RegionOverview from './stats/region-overview';
import Filter from './filter';
import Table from './table';
import Map from './map';

export default class ThreeW extends React.PureComponent {
  render() {
    const {
      projectList,
      countryId,
      onFilterChange,
    } = this.props;

    return (
      <div className='three-w-container'>
        <h2 className='heading'>
          Movement activities
        </h2>
        <div className='content'>
          <div className='left'>
            <a
              href='#3w'
              className="add-button button button--secondary-bounded"
            >
              Add
            </a>
          </div>
          <Filter
            projectList={projectList}
            className='three-w-filters'
            onFilterChange={onFilterChange}
          />
          <a
            href='#3w'
            className="export-button button button--secondary-bounded"
          >
            Export
          </a>
          <div className='three-w-map-container'>
            <Map
              countryId={countryId}
              projectList={projectList}
            />
            <RegionOverview
              projectList={projectList}
            />
          </div>
          <div className='three-w-map-bottom-details'>
            <Summary
              projectList={projectList}
            />
            <SectorActivity
              projectList={projectList}
            />
            <StatusOverview
              projectList={projectList}
            />
          </div>
          <div className='three-w-project-list-table-container'>
            <Table
              projectList={projectList}
            />
          </div>
        </div>
      </div>
    );
  }
}

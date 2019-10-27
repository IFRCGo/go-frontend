'use strict';
import React from 'react';
import _cs from 'classnames';

import Summary from './stats/summary';
import SectorActivity from './stats/sector-activity';
import StatusOverview from './stats/status-overview';
import RegionOverview from './stats/region-overview';
import Filter from './filter';
import Table from './table';
import Map from './map';

export default class ThreeW extends React.PureComponent {
  render () {
    const {
      projectList,
      countryId,
      onFilterChange,
      disabled,
    } = this.props;

    return (
      <div className='three-w-container'>
        <h2 className='heading'>
          Movement activities
        </h2>
        <div className='content'>
          <div className='left'>
            <button
              className={
                _cs(
                  'add-button button button--secondary-bounded',
                  disabled && 'disabled',
                )}
              onClick={this.props.onAddButtonClick}
              disabled={disabled}
            >
              Add
            </button>
          </div>
          <Filter
            projectList={projectList}
            className='three-w-filters'
            onFilterChange={onFilterChange}
          />
          <button
            className="export-button button button--secondary-bounded disabled"
            onClick={() => {}}
            disabled
          >
            Export
          </button>
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

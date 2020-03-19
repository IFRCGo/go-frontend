'use strict';
import React from 'react';
import _cs from 'classnames';
import memoize from 'memoize-one';

import { getDataFromResponse } from '../../utils/request';

import Summary from './stats/summary';
import SectorActivity from './stats/sector-activity';
import StatusOverview from './stats/status-overview';
import RegionOverview from './stats/region-overview';
import Filter from './filter';
import Table from './table';
import Map from './map';

export default class ThreeW extends React.PureComponent {
  getIsCountryAdmin = memoize((user, countryId) => {
    if (!user || !user.id || !countryId) {
      return false;
    }

    if (!user.is_admin_for_countries || user.is_admin_for_countries.length === 0) {
      return false;
    }

    const countryIdIndex = user.is_admin_for_countries.findIndex(d => String(d) === String(countryId));

    if (countryIdIndex !== -1) {
      return true;
    }

    return false;
  })

  render () {
    const {
      projectList,
      countryId,
      onFilterChange,
      disabled,
      user = {},
    } = this.props;

    const currentUserDetail = getDataFromResponse(user);
    const isCountryAdmin = this.getIsCountryAdmin(currentUserDetail, countryId);

    return (
      <div className='three-w-container'>
        <h2 className='heading'>
          Movement activities
        </h2>
        <div className='content'>
          <div className='left'>
            { isCountryAdmin && (
              <button
                className={
                  _cs(
                    'add-button button button--primary-bounded',
                    disabled && 'disabled',
                  )}
                onClick={this.props.onAddButtonClick}
                disabled={disabled}
              >
                Add
              </button>
            )}
          </div>
          <Filter
            projectList={projectList}
            className='three-w-filters'
            onFilterChange={onFilterChange}
          />
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
              user={user}
              projectList={projectList}
              onEditButtonClick={this.props.onEditButtonClick}
              onDetailsButtonClick={this.props.onDetailsButtonClick}
              onDeleteButtonClick={this.props.onDeleteButtonClick}
              isCountryAdmin={isCountryAdmin}
            />
          </div>
        </div>
      </div>
    );
  }
}

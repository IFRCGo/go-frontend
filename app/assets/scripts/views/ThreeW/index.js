'use strict';
import React from 'react';
import _cs from 'classnames';
import memoize from 'memoize-one';
import { saveAs } from 'file-saver';
import { isNotDefined } from '@togglecorp/fujs';

import { getDataFromResponse } from '../../utils/request';

import Summary from './stats/summary';
import SectorActivity from './stats/sector-activity';
import StatusOverview from './stats/status-overview';
import RegionOverview from './stats/region-overview';
import Filter from './filter';
import Table from './table';
import Map from './map';

import exportHeaders from './export-headers';
const convertJsonToCsv = (data, columnDelimiter = ',', lineDelimiter = '\n', emptyValue = '') => {
  if (!data || data.length <= 0) {
    return undefined;
  }

  let result = '';

  data.forEach((items) => {
    result += items.map((str) => {
      if (isNotDefined(str)) {
        return emptyValue;
      }
      const val = String(str);
      if (val.includes(columnDelimiter)) {
        return `"${val}"`;
      }
      return val;
    }).join(columnDelimiter);
    result += lineDelimiter;
  });

  return result;
};

export default class ThreeW extends React.PureComponent {
  getIsCountryAdmin = memoize((user, countryId) => {
    // User is logged in
    if (user && user.id) {
      return true;
    }

    /*
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
    */

    return false;
  })

  handleExportButtonClick = () => {
    const { projectList } = this.props;

    const resolveToValues = (headers, data) => {
      const resolvedValues = [];
      headers.forEach(header => {
        const el = header.modifier ? header.modifier(data) || '' : data[header.key] || '';
        resolvedValues.push(el);
      });
      return resolvedValues;
    };

    const csvHeaders = exportHeaders.map(d => d.title);
    const resolvedValueList = projectList.map(project => (
      resolveToValues(exportHeaders, project)
    ));

    const csv = convertJsonToCsv([
      csvHeaders,
      ...resolvedValueList,
    ]);

    const blob = new Blob([csv], { type: 'text/csv' });
    const timestamp = (new Date()).getTime();
    const fileName = `projects-export-${timestamp}.csv`;

    saveAs(blob, fileName);
  }

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
    const shouldDisableExportButton = disabled || !projectList || projectList.length === 0;

    return (
      <div className='three-w-container'>
        <h2 className='heading'>
          Red Cross / Red Crescent activities
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
            <button
              className={
                _cs(
                  'export-button button button--secondary-bounded',
                  shouldDisableExportButton && 'disabled',
                )}
              onClick={this.handleExportButtonClick}
              disabled={shouldDisableExportButton}
            >
              Export
            </button>
          </div>
          <Filter
            projectList={projectList}
            className='three-w-filters'
            onFilterChange={onFilterChange}
          />
          <div className="three-w-map-vis">
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
              <Summary projectList={projectList} />
              <SectorActivity projectList={projectList} />
              <StatusOverview projectList={projectList} />
            </div>
          </div>
          <div className='three-w-project-list-table-container'>
            <Table
              user={user}
              projectList={projectList}
              onEditButtonClick={this.props.onEditButtonClick}
              onCloneButtonClick={this.props.onCloneButtonClick}
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

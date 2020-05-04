'use strict';
import React from 'react';
import _cs from 'classnames';
import memoize from 'memoize-one';
import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';

import { getDataFromResponse } from '../../utils/request';
import { convertJsonToCsv } from '../../utils/utils';

import Summary from './stats/summary';
import SectorActivity from './stats/sector-activity';
import StatusOverview from './stats/status-overview';
import RegionOverview from './stats/region-overview';
import Filter from './filter';
import Table from './table';
import Map from './map';

import exportHeaders from './export-headers';

export default class ThreeW extends React.PureComponent {
  static propTypes = {
    projectList: PropTypes.array,
    countryId: PropTypes.string,
    onFilterChange: PropTypes.func,
    disabled: PropTypes.bool,
    user: PropTypes.object,
    onAddButtonClick: PropTypes.func,
    onEditButtonClick: PropTypes.func,
    onCloneButtonClick: PropTypes.func,
    onDetailsButtonClick: PropTypes.func,
    onDeleteButtonClick: PropTypes.func,
  }

  getIsCountryAdmin = memoize((user, countryId) => {
    // User is logged in
    if (user && user.id) {
      return true;
    }

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
        <header className='tc-header'>
          <h2 className='tc-heading'>
            Red Cross / Red Crescent activities
          </h2>
          <div className='tc-actions'>
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
        </header>
        <div className='content'>
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

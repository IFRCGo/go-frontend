'use strict';
import React from 'react';
import {
  _cs,
  addSeparator,
} from '@togglecorp/fujs';
import memoize from 'memoize-one';
import url from 'url';
import {
  MdContentCopy,
  MdSearch,
  MdEdit,
  MdDeleteForever,
  MdHistory,
} from 'react-icons/md';

import {
  programmeTypes,
  sectors,
  statuses,
} from '../../utils/constants';
import { api } from '../../config';

import FormattedDate from '../../components/formatted-date';
import DropdownMenu from '../../components/dropdown-menu';

export default class ProjectListTable extends React.PureComponent {
  constructor (props) {
    super(props);

    this.headers = [
      {
        key: 'start_date',
        label: 'Start date',
        modifier: d => <FormattedDate value={d['start_date']} />,
      },
      {
        key: 'end_date',
        label: 'End date',
        modifier: d => <FormattedDate value={d['end_date']} />,
      },
      {
        key: 'name',
        label: 'Project name',
      },
      {
        key: 'reporting_ns',
        label: 'Supporting NS',
        modifier: d => d.reporting_ns_detail.society_name,
      },
      {
        key: 'primary_sector',
        label: 'Sector of activity',
        modifier: d => sectors[d.primary_sector],
      },
      {
        key: 'budget_amount',
        label: 'Budget',
        modifier: d => addSeparator(d.budget_amount),
      },
      {
        key: 'programme_type',
        label: 'Type',
        modifier: d => programmeTypes[d.programme_type],
      },
      {
        key: 'target_total',
        label: 'People targeted',
        modifier: d => addSeparator(d.target_total),
      },
      {
        key: 'reached_total',
        label: 'People reached',
        modifier: d => addSeparator(d.reached_total),
      },
      {
        key: 'status',
        label: 'Status',
        modifier: d => statuses[d.status],
      },
      {
        key: 'modified_at',
        label: 'Last updated',
        modifier: d => <FormattedDate value={d['modified_at']} />,
      },
      {
        key: 'actions',
        label: '',
        modifier: (d) => (
          <DropdownMenu
            className='more-actions-dropdown-menu'
            dropdownContainerClassName='more-actions-dropdown-container'
            label={<div className='ion-android-more-horizontal' />}
          >
            <button
              className='button'
              onClick={() => this.props.onDetailsButtonClick(d)}
            >
              <MdSearch className='tc-icon' />
              <div className='tc-label'>
                View details
              </div>
            </button>
            { this.props.isCountryAdmin && (
              <React.Fragment>
                <button
                  className='button'
                  onClick={() => this.props.onEditButtonClick(d)}
                >
                  <MdEdit className='tc-icon' />
                  <div className='tc-label'>
                    Edit
                  </div>
                </button>
                <button
                  className='button'
                  onClick={() => this.props.onCloneButtonClick(d)}
                >
                  <MdContentCopy className='tc-icon' />
                  <div className='tc-label'>
                    Duplicate
                  </div>
                </button>
                <a
                  className='button'
                  href={url.resolve(api, `deployments/project/${d.id}/history/`)}
                >
                  <MdHistory className='tc-icon' />
                  <div className='tc-label'>
                    History
                  </div>
                </a>
                <hr />
                <button
                  className='button delete-button'
                  onClick={() => this.props.onDeleteButtonClick(d)}
                >
                  <MdDeleteForever className='tc-icon' />
                  <div className='tc-label'>
                    Delete
                  </div>
                </button>
              </React.Fragment>
            )}
          </DropdownMenu>
        ),
      },
    ];
  }

  getShouldShowAddButton = memoize((user, countryId) => {
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
      className,
      projectList,
    } = this.props;

    return (
      <table className={_cs(className, 'three-w-project-list-table')}>
        <thead>
          <tr>
            { this.headers.map(h => (
              <th key={h.key}>
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          { projectList.map(p => (
            <tr key={p.id}>
              { this.headers.map(h => (
                <td key={h.key}>
                  { h.modifier ? h.modifier(p) : (p[h.key] || '-') }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

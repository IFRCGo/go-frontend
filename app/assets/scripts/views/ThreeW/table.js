'use strict';
import React from 'react';
import {
  _cs,
  addSeparator,
} from '@togglecorp/fujs';
import memoize from 'memoize-one';

import {
  programmeTypes,
  sectors,
  statuses,
} from '../../utils/constants';

import FormattedDate from '../../components/formatted-date';

export default class ProjectListTable extends React.PureComponent {
  constructor (props) {
    super(props);

    this.headers = [
      {
        key: 'start_date',
        label: 'Start date',
      },
      {
        key: 'end_date',
        label: 'End date',
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
      },
      {
        key: 'reached_total',
        label: 'People reached',
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
        label: 'Actions',
        modifier: (d) => (
          <React.Fragment>
            <button
              className='button button--primary-bounded'
              onClick={() => this.props.onDetailsButtonClick(d)}
            >
              Show details
            </button>
            <br />
            { this.props.isCountryAdmin && (
              <React.Fragment>
                <button
                  className='button button--secondary-bounded'
                  onClick={() => this.props.onEditButtonClick(d)}
                >
                  Edit
                </button>
                <br />
                <button
                  className='button button--secondary-bounded'
                  onClick={() => this.props.onDeleteButtonClick(d)}
                >
                  Delete
                </button>
              </React.Fragment>
            )}
          </React.Fragment>
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

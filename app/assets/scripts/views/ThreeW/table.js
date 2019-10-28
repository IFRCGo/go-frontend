'use strict';
import React from 'react';
import {
  _cs,
  addSeparator,
} from '@togglecorp/fujs';

import {
  programmeTypes,
  sectors,
  statuses,
} from '../../utils/constants';

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
        key: 'status',
        label: 'Status',
        modifier: d => statuses[d.status],
      },
    ];
  }

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
                  { h.modifier ? h.modifier(p) : p[h.key] }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

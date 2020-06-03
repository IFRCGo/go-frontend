import React from 'react';
import {
  _cs,
  addSeparator,
} from '@togglecorp/fujs';
import url from 'url';
import {
  MdContentCopy,
  MdSearch,
  MdEdit,
  MdDeleteForever,
  MdHistory,
  MdMoreHoriz,
} from 'react-icons/md';

import {
  programmeTypes,
  sectors,
  statuses,
} from '#utils/constants';
import { api } from '#config';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import FormattedDate from '#components/formatted-date';
import DropdownMenu from '#components/dropdown-menu';

export default class ProjectListTable extends React.PureComponent {
  constructor (props, context) {
    super(props);

    const { strings } = context;
    this.headers = [
      {
        key: 'start_date',
        label: strings.projectListTableStartDate,
        modifier: d => <FormattedDate value={d['start_date']} />,
      },
      {
        key: 'end_date',
        label: strings.projectListTableEndDate,
        modifier: d => <FormattedDate value={d['end_date']} />,
      },
      {
        key: 'name',
        label: strings.projectListTableProjectName,
      },
      {
        key: 'reporting_ns',
        label: strings.projectListTableSupportingNs,
        modifier: d => d.reporting_ns_detail.society_name,
      },
      {
        key: 'primary_sector',
        label: strings.projectListTableActivitySector,
        modifier: d => sectors[d.primary_sector],
      },
      {
        key: 'budget_amount',
        label: strings.projectListTableBudget,
        modifier: d => addSeparator(d.budget_amount),
      },
      {
        key: 'programme_type',
        label: strings.projectListTableProgrammeType,
        modifier: d => programmeTypes[d.programme_type],
      },
      {
        key: 'dtype_detail',
        label: strings.projectListTableDisaster,
        modifier: r => r.dtype_detail ? r.dtype_detail.name : '',
      },
      {
        key: 'target_total',
        label: strings.projectListTablePeopleTargeted,
        modifier: d => addSeparator(d.target_total),
      },
      {
        key: 'reached_total',
        label: strings.projectListTablePeopleReached,
        modifier: d => addSeparator(d.reached_total),
      },
      {
        key: 'status',
        label: strings.projectListTableStatus,
        modifier: d => statuses[d.status],
      },
      {
        key: 'modified_at',
        label: strings.projectListTableLastUpdated,
        modifier: d => <FormattedDate value={d['modified_at']} />,
      },
      {
        key: 'actions',
        label: '',
        modifier: (d) => (
          <DropdownMenu
            className='more-actions-dropdown-menu'
            dropdownContainerClassName='more-actions-dropdown-container'
            label={<MdMoreHoriz className='tc-icon' />}
          >
            <button
              className='button'
              onClick={() => this.props.onDetailsButtonClick(d)}
            >
              <MdSearch className='tc-icon' />
              <div className='tc-label'>
                <Translate stringId='projectListTableViewDetails'/>
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
                    <Translate stringId='projectListTableEdit'/>
                  </div>
                </button>
                <button
                  className='button'
                  onClick={() => this.props.onCloneButtonClick(d)}
                >
                  <MdContentCopy className='tc-icon' />
                  <div className='tc-label'>
                    <Translate stringId='projectListTableDuplicate'/>
                  </div>
                </button>
                <a
                  className='button'
                  href={url.resolve(api, `deployments/project/${d.id}/history/`)}
                >
                  <MdHistory className='tc-icon' />
                  <div className='tc-label'>
                    <Translate stringId='projectListTableHistory'/>
                  </div>
                </a>
                <hr />
                <button
                  className='button delete-button'
                  onClick={() => this.props.onDeleteButtonClick(d)}
                >
                  <MdDeleteForever className='tc-icon' />
                  <div className='tc-label'>
                    <Translate stringId='projectListTableDelete'/>
                  </div>
                </button>
              </React.Fragment>
            )}
          </DropdownMenu>
        ),
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

ProjectListTable.contexType = LanguageContext;

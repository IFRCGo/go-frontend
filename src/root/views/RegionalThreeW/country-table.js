import React from 'react';
import { connect } from 'react-redux';
import { addSeparator } from '@togglecorp/fujs';
import _cs from 'classnames';
import {
  MdChevronRight,
  MdExpandLess,
} from 'react-icons/md';

import BlockLoading from '#components/block-loading';
import {
  programmeTypes,
  sectors,
  statuses,
} from '#utils/constants';
import { getResultsFromResponse } from '#utils/request';
import { getProjects as getProjectsAction } from '#actions';
import { countryProjectSelector } from '#selectors';

const tableHeaders = [
  {
    key: 'reporting_ns',
    label: 'Reporting NS',
    modifier: d => d.reporting_ns_detail.society_name,
  },
  {
    key: 'primary_sector',
    label: 'Activity sector',
    modifier: d => sectors[d.primary_sector],
  },
  {
    key: 'status',
    label: 'Status',
    modifier: d => statuses[d.status],
  },
  {
    key: 'programme_type',
    label: 'Type',
    modifier: d => programmeTypes[d.programme_type],
  },
  {
    key: 'target_total',
    label: 'Total people targeted',
    modifier: d => addSeparator(d.target_total),
  },
  {
    key: 'reached_total',
    label: 'Total people reached',
    modifier: d => addSeparator(d.reached_total),
  },
  {
    key: 'budget_amount',
    label: 'Total budget',
    modifier: d => addSeparator(d.budget_amount),
  },
];

const emptyList = [];

function CountryTable (p) {
  const {
    data,
    isActive,
    onHeaderClick,
    projectsResponse,
    getProjects,
    filters,
  } = p;

  React.useEffect(() => {
    if (isActive && data.id) {
      getProjects(data.id, filters);
    }
  }, [data.id, isActive, filters, getProjects]);

  const [projectList, pending] = React.useMemo(() => ([
    getResultsFromResponse(projectsResponse),
    projectsResponse.fetching,
  ]), [projectsResponse]);

  const handleHeaderClick = React.useCallback(() => {
    if (onHeaderClick) {
      onHeaderClick(isActive ? undefined : data.id);
    }
  }, [onHeaderClick, data.id, isActive]);

  const count = (data.projects_count || emptyList).length;

  return (
    <div className={_cs('country-table', isActive && 'tc-active')}>
      <button
        type="button"
        onClick={handleHeaderClick}
        className='tc-header-button'
        disabled={count === 0}
      >
        <div className='tc-label'>
          <div className='tc-name'>
            { data.name }
          </div>
          <div className='tc-project-count'>
            { data.projects_count } projects
          </div>
        </div>
        { isActive ? (
          <MdExpandLess className='tc-icon' />
        ) : (
          <MdChevronRight className='tc-icon' />
        )}
      </button>
      { isActive && (
        <div className='tc-content'>
          { pending ? (
            <BlockLoading />
          ) : (
            <table className='tc-table'>
              <thead>
                <tr>
                  { tableHeaders.map(h => (
                    <th key={h.key}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                { projectList.map(p => (
                  <tr key={p.id}>
                    { tableHeaders.map(h => (
                      <td key={h.key}>
                        { h.modifier ? h.modifier(p) : (p[h.key] || '-') }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  projectsResponse: countryProjectSelector(state, props.data.id),
});

const mapDispatchToProps = (dispatch) => ({
  getProjects: (...args) => dispatch(getProjectsAction(...args)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CountryTable);

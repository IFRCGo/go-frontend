import React, { useContext } from 'react';
import { connect } from 'react-redux';
import {
  listToGroupList as listToGroupMap,
  mapToMap,
} from '@togglecorp/fujs';
import { MdChevronRight } from 'react-icons/md';

import TextOutput from '#components/text-output';
import BlockLoading from '#components/block-loading';

import { getResultsFromResponse } from '#utils/request';
import { getProjects as getProjectsAction } from '#actions';
import { countryProjectSelector } from '#selectors';
import { sectors } from '#utils/constants';

import LanguageContext from '#root/languageContext';

const emptyObject = {};

function NSDetails (p) {
  const {
    sectorList,
    nsDetails,
  } = p.data;

  return (
    <div className='ns-details flex flex-align-baseline'>
      <h5 className='tc-heading'>
        { nsDetails.society_name }
      </h5>
      <div className='tc-content'>
        { Object.keys(sectorList).map(sectorId => (
          <div className='tc-sector' key={sectorId}>
            { sectors[sectorId] } <strong>{ sectorList[sectorId] }</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityDetails (p) {
  const {
    data,
    projectsResponse,
    getProjects,
  } = p;

  const {
    completed_projects_count: completed,
    id: countryId,
    name,
    ongoing_projects_count: ongoing,
    planned_projects_count: planned,
  } = data || emptyObject;

  React.useEffect(() => {
    if (countryId) {
      getProjects(countryId);
    }
  }, [countryId, getProjects]);

  const [projectList, pending] = React.useMemo(() => ([
    getResultsFromResponse(projectsResponse),
    projectsResponse.fetching,
  ]), [projectsResponse]);

  const nsSectorList = React.useMemo(() => {
    const projectsByNS = listToGroupMap(
      projectList,
      d => d.reporting_ns,
      d => ({
        sector: d.primary_sector,
        nsDetails: d.reporting_ns_detail,
      }));

    const sectorGroupedProjectsByNS = Object.keys(projectsByNS).map(nsId => ({
      sectorList: mapToMap(
        listToGroupMap(projectsByNS[nsId], d => d.sector, d => true),
        undefined,
        d => d.length,
      ),
      nsDetails: projectsByNS[nsId][0].nsDetails,
    }));

    return sectorGroupedProjectsByNS;
  }, [projectList]);

  const { strings } = useContext(LanguageContext);
  return (
    <div className='regional-map-threew-activity-details'>
      <h4 className='tc-heading'>
        <a href={`/countries/${countryId}#3w`}>
          { name } <MdChevronRight className='tc-icon' />
        </a>
      </h4>
      <div className='tc-content'>
        <div className='status-counts'>
          <TextOutput
            label={strings.activityDetailsPlanned}
            value={planned}
            reverseOrder
          />
          <TextOutput
            label={strings.activityDetailsOngoing}
            value={ongoing}
            reverseOrder
          />
          <TextOutput
            label={strings.activityDetailsCompleted}
            value={completed}
            reverseOrder
          />
        </div>
        <div className='active-ns-count__wrap scrollbar__custom'>
          <div className='active-ns-count'>
            <TextOutput
              label={strings.activityDetailsActiveNationalCount}
              value={nsSectorList.length}
              reverseOrder
            />
          </div>
          <div className='ns-sector-details'>
            { pending ? (
              <BlockLoading />
            ) : (
              nsSectorList.map(d => (
                <NSDetails data={d} key={d.nsDetails.id} />
              ))
            )}
          </div>
        </div>  
      </div>
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
)(React.memo(ActivityDetails));

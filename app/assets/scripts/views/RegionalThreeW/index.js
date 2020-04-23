import React from 'react';
import { connect } from 'react-redux';

import BlockLoading from '../../components/block-loading';
import {
  getRegionalMovementActivities as getRegionalMovementActivitiesAction,
  getRegionalProjectsOverview as getRegionalProjectsOverviewAction,
} from '../../actions';

import {
  regionalMovementActivitiesSelector,
  regionalProjectsOverviewSelector,
} from '../../selectors';

import { statuses } from '../../utils/constants';
import { getDataFromResponse } from '../../utils/request';

import StatusOverview from './status-overview';
import BudgetOverview from './budget-overview';
import CountryTable from './country-table';
import PeopleOverview from './people-overview';
import Map from './map';

const emptyList = [];

function RegionalThreeW (props) {
  const {
    regionId,
    regionalMovementActivitiesResponse,
    regionalProjectsOverviewResponse,
    getRegionalMovementActivities,
    getRegionalProjectsOverview,
  } = props;

  const [activeCountryId, setActiveCountryId] = React.useState(undefined);

  React.useEffect(() => {
    getRegionalMovementActivities(regionId);
    getRegionalProjectsOverview(regionId);
  }, [regionId, getRegionalMovementActivities, getRegionalProjectsOverview]);

  const [
    movementActivityList,
    projectsOverview,
    pending,
  ] = React.useMemo(() => ([
    getDataFromResponse(regionalMovementActivitiesResponse).countries_count || emptyList,
    getDataFromResponse(regionalProjectsOverviewResponse),
    regionalMovementActivitiesResponse.fetching || regionalProjectsOverviewResponse.fetching,
  ]), [regionalMovementActivitiesResponse, regionalProjectsOverviewResponse]);

  const sectorActivityData = React.useMemo(() => (
    (projectsOverview.projects_by_status || emptyList).map(
      d => ({ label: statuses[d.status], value: d.count }),
    )
  ), [projectsOverview]);

  return (
    <div className='regional-threew'>
      { pending ? (
        <BlockLoading />
      ) : (
        <React.Fragment>
          <div className='regional-threew-overview'>
            <BudgetOverview
              totalBudget={projectsOverview.total_budget}
              nsCountWithOngoingActivity={projectsOverview.ns_with_ongoing_activities}
            />
            <PeopleOverview
              targeted={projectsOverview.target_total}
              reached={projectsOverview.reached_total}
            />
            <StatusOverview
              total={projectsOverview.total_projects}
              data={sectorActivityData}
            />
          </div>
          <Map
            regionId={regionId}
            data={movementActivityList}
          />
          <div className='countries-threew-tables'>
            { movementActivityList.map(c => (
              <CountryTable
                key={c.id}
                onHeaderClick={setActiveCountryId}
                isActive={String(activeCountryId) === String(c.id)}
                data={c}
              />
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  regionalMovementActivitiesResponse: regionalMovementActivitiesSelector(state),
  regionalProjectsOverviewResponse: regionalProjectsOverviewSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  getRegionalMovementActivities: (...args) => dispatch(getRegionalMovementActivitiesAction(...args)),
  getRegionalProjectsOverview: (...args) => dispatch(getRegionalProjectsOverviewAction(...args)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegionalThreeW);

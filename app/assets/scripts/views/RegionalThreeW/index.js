import React from 'react';
import { connect } from 'react-redux';
import {
  ResponsiveContainer,
  Sankey,
  Tooltip,
  Layer,
  Label,
  Rectangle,
} from 'recharts';

import BlockLoading from '../../components/block-loading';
import {
  getRegionalMovementActivities as getRegionalMovementActivitiesAction,
  getRegionalProjectsOverview as getRegionalProjectsOverviewAction,
  getNationalSocietyActivities as getNationalSocietyActivitiesAction,
} from '../../actions';

import {
  regionalMovementActivitiesSelector,
  regionalProjectsOverviewSelector,
  nationalSocietyActivitiesSelector,
} from '../../selectors';

import { statuses } from '../../utils/constants';
import { getDataFromResponse } from '../../utils/request';

import StatusOverview from './status-overview';
import BudgetOverview from './budget-overview';
import CountryTable from './country-table';
import PeopleOverview from './people-overview';
import Map from './map';

const emptyList = [];

function SankeyNode (p) {
  const { x, y, width, height, index, payload } = p;
  const isOut = x + width > window.innerWidth / 2;

  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={x} y={y} width={width} height={height}
        fill="#5192ca" fillOpacity="1"
      />
      <text
        textAnchor={isOut ? 'end' : 'start'}
        verticalAlign='middle'
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 + 4}
        fontSize="12"
        fill="#000"
        strokeWidth={0}
        pointerEvents="none"
      >
        {payload.name} ({payload.value})
      </text>
    </Layer>
  );
}

function SankeyLink (props) {
  const {
    sourceX,
    targetX,
    sourceY,
    targetY,
    sourceControlX,
    targetControlX,
    linkWidth,
    index,
  } = props;

  return (
    <Layer key={`CustomLink${index}`}>
      <path
        className='sankey-link'
        d={`
            M${sourceX},${sourceY + linkWidth / 2}
            C${sourceControlX},${sourceY + linkWidth / 2}
              ${targetControlX},${targetY + linkWidth / 2}
              ${targetX},${targetY + linkWidth / 2}
            L${targetX},${targetY - linkWidth / 2}
            C${targetControlX},${targetY - linkWidth / 2}
              ${sourceControlX},${sourceY - linkWidth / 2}
              ${sourceX},${sourceY - linkWidth / 2}
            Z
          `}
        strokeWidth={0}
      />
    </Layer>
  );
}

function RegionalThreeW (props) {
  const {
    regionId,
    regionalMovementActivitiesResponse,
    regionalProjectsOverviewResponse,
    nationalSocietyActivitiesResponse,
    getRegionalMovementActivities,
    getRegionalProjectsOverview,
    getNationalSocietyActivities,
  } = props;

  const [activeCountryId, setActiveCountryId] = React.useState(undefined);

  React.useEffect(() => {
    getRegionalMovementActivities(regionId);
    getRegionalProjectsOverview(regionId);
    getNationalSocietyActivities(regionId);
  }, [
    regionId,
    getRegionalMovementActivities,
    getRegionalProjectsOverview,
    getNationalSocietyActivities,
  ]);

  const [
    movementActivityList,
    projectsOverview,
    nationalSocietyActivities,
    pending,
  ] = React.useMemo(() => ([
    (getDataFromResponse(regionalMovementActivitiesResponse).countries_count || emptyList)
      .filter(d => d.projects_count > 0),
    getDataFromResponse(regionalProjectsOverviewResponse),
    getDataFromResponse(nationalSocietyActivitiesResponse),
    regionalMovementActivitiesResponse.fetching ||
      regionalProjectsOverviewResponse.fetching ||
      nationalSocietyActivitiesResponse.fetching,
  ]), [
    regionalMovementActivitiesResponse,
    regionalProjectsOverviewResponse,
    nationalSocietyActivitiesResponse,
  ]);

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
          <div className='ns-sankey-container'>
            <ResponsiveContainer>
              <Sankey
                data={nationalSocietyActivities}
                link={SankeyLink}
                node={SankeyNode}
              >
                <Tooltip />
                <Label />
              </Sankey>
            </ResponsiveContainer>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  regionalMovementActivitiesResponse: regionalMovementActivitiesSelector(state),
  regionalProjectsOverviewResponse: regionalProjectsOverviewSelector(state),
  nationalSocietyActivitiesResponse: nationalSocietyActivitiesSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  getRegionalMovementActivities: (...args) => dispatch(getRegionalMovementActivitiesAction(...args)),
  getRegionalProjectsOverview: (...args) => dispatch(getRegionalProjectsOverviewAction(...args)),
  getNationalSocietyActivities: (...args) => dispatch(getNationalSocietyActivitiesAction(...args)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegionalThreeW);

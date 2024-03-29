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
import _cs from 'classnames';

import BlockLoading from '#components/block-loading';
import Translate from '#components/Translate';

import {
  getRegionalMovementActivities as getRegionalMovementActivitiesAction,
  getRegionalProjectsOverview as getRegionalProjectsOverviewAction,
  getNationalSocietyActivities as getNationalSocietyActivitiesAction,
  getNationalSocietyActivitiesWoFilters as getNationalSocietyActivitiesWoFiltersAction,
} from '#actions';

import {
  regionalMovementActivitiesSelector,
  regionalProjectsOverviewSelector,
  nationalSocietyActivitiesSelector,
  nationalSocietyActivitiesWoFiltersSelector,
} from '#selectors';

import { statuses } from '#utils/constants';
import { getDataFromResponse } from '#utils/request';
import ProjectFormModal from '#views/Country/ThreeW/ProjectFormModal';

import StatusOverview from './status-overview';
import BudgetOverview from './budget-overview';
import CountryTable from './country-table';
import PeopleOverview from './people-overview';
import MovementActivitiesFilters from './movement-activities-filters';
import NSActivitiesFilters from './ns-activities-filters';
import ExportButton from './export-button';
import Map from './map';
import { countriesSelector, regionsByIdSelector, countriesGeojsonSelector } from '../../selectors';
import LanguageContext from '#root/languageContext';
import store from '#utils/store';

const currentLanguage = store.getState().lang.current;

const emptyList = [];

function SankeyNode (p) {
  const { x, y, width, height, index, payload } = p;
  if (payload.value === 0) {
    return null;
  }

  const isOut = (x + width) > window.innerWidth / 2;

  return (
    <Layer key={`sankey-node-${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#5192ca"
        fillOpacity="1"
      />
      <text
        textAnchor={isOut ? 'end' : 'start'}
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

function SankeyLink (p) {
  const {
    sourceX,
    targetX,
    sourceY,
    targetY,
    sourceControlX,
    targetControlX,
    linkWidth,
    index,
  } = p;

  const isLeft = targetX < window.innerWidth / 2;

  return (
    <Layer key={`CustomLink${index}`}>
      <path
        className={_cs('sankey-link', isLeft && 'sankey-link-left')}
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

function RegionalThreeW (p) {
  const {
    regionId,
    regionalMovementActivitiesResponse,
    regionalProjectsOverviewResponse,
    nationalSocietyActivitiesResponse,
    nationalSocietyActivitiesWoFiltersResponse,
    getRegionalMovementActivities,
    getRegionalProjectsOverview,
    getNationalSocietyActivities,
    getNationalSocietyActivitiesWoFilters,
    isUserLoggedIn,
    projectFormResponse,
    countries,
    regions,
    countriesGeojson
  } = p;

  const { strings } = React.useContext(LanguageContext);
  const [showProjectForm, setShowProjectForm] = React.useState(false);
  const [refetchKey, setRefetchKey] = React.useState(undefined);
  const [activeCountryId, setActiveCountryId] = React.useState(undefined);
  const [movementActivityFilters, setMovementActivityFilters] = React.useState({
    operation_type: undefined,
    programme_type: undefined,
    primary_sector: undefined,
    status: undefined,
  });
  const [nsActivityFilters, setNSActivityFilters] = React.useState({
    reporting_ns: [],
    primary_sector: [],
    country: [],
  });

  const handleProjectFormModalCloseButtonClick = React.useCallback(() => {
    setShowProjectForm(false);
  }, [setShowProjectForm]);

  const handleCreateThreeWActivityButtonClick = React.useCallback(() => {
    setShowProjectForm(true);
  }, [setShowProjectForm]);

  React.useEffect(() => {
    const {
      fetching,
      fetched,
      error,
    } = projectFormResponse;
    if (!fetching && fetched && !error) {
      setShowProjectForm(false);
      setRefetchKey(new Date().getTime());
    }
  }, [setRefetchKey, setShowProjectForm, projectFormResponse]);

  React.useEffect(() => {
    getRegionalMovementActivities(regionId, movementActivityFilters);
  }, [
    regionId,
    getRegionalMovementActivities,
    movementActivityFilters,
    refetchKey,
  ]);

  React.useEffect(() => {
    getRegionalProjectsOverview(regionId);
  }, [regionId, getRegionalProjectsOverview, refetchKey]);

  React.useEffect(() => {
    getNationalSocietyActivitiesWoFilters(regionId);
  }, [regionId, getNationalSocietyActivitiesWoFilters, refetchKey]);

  React.useEffect(() => {
    getNationalSocietyActivities(regionId, nsActivityFilters);
  }, [regionId, nsActivityFilters, getNationalSocietyActivities, refetchKey]);

  const [
    movementActivityList,
    movementActivityListPending,
  ] = React.useMemo(() => ([
    (getDataFromResponse(regionalMovementActivitiesResponse).countries_count || emptyList)
      .filter(d => d.projects_count > 0),
    regionalMovementActivitiesResponse.fetching,
  ]), [regionalMovementActivitiesResponse]);

  const [
    projectsOverview,
    projectsOverviewPending,
  ] = React.useMemo(() => [
    getDataFromResponse(regionalProjectsOverviewResponse),
    regionalProjectsOverviewResponse.fetching,
  ], [regionalProjectsOverviewResponse]);

  const [
    nationalSocietyActivities,
    nationalSocietyActivitiesPending,
  ] = React.useMemo(() => ([
    getDataFromResponse(nationalSocietyActivitiesResponse),
    nationalSocietyActivitiesResponse.fetching,
  ]), [nationalSocietyActivitiesResponse]);

  const [
    nationalSocietyActivitiesWoFilters,
    nationalSocietyActivitiesWoFiltersPending,
  ] = React.useMemo(() => ([
    getDataFromResponse(nationalSocietyActivitiesWoFiltersResponse),
    nationalSocietyActivitiesWoFiltersResponse.fetching,
  ]), [nationalSocietyActivitiesWoFiltersResponse]);

  const sectorActivityData = React.useMemo(() => (
    (projectsOverview.projects_by_status || emptyList).map(
      d => ({ label: statuses[d.status], value: d.count }),
    ).sort((a, b) => a.label.localeCompare(b.label))
  ), [projectsOverview]);

  return (
    <div className='regional-threew container-lg'>
      { projectsOverviewPending ? (
        <BlockLoading />
      ) : (
        <>
        {
        strings.wikiJsLinkRegional3W !== undefined && strings.wikiJsLinkRegional3W.length>0 ?
        <div style={{display: 'flex', justifyContent:'flex-end', paddingBottom:'8px'}}>
          <a href={strings.wikiJsLinkGOWiki+'/'+currentLanguage +'/'+ strings.wikiJsLinkRegional3W} title='GO Wiki' target='_blank' ><img className='' src='/assets/graphics/content/wiki-help-section.svg' alt='IFRC GO logo'/></a>
        </div> : null
        }
        <div className='regional-threew-overview row-lg flex-mid'>          
          <div className='col-lg col-4-mid'>
            <BudgetOverview
              totalBudget={projectsOverview.total_budget}
              nsCountWithOngoingActivity={projectsOverview.ns_with_ongoing_activities}
            />
          </div>
          <div className='col-lg col-4-mid'>
            <PeopleOverview
              targeted={projectsOverview.target_total}
              reached={projectsOverview.reached_total}
            />
          </div>
          <div className='col-lg col-4-mid'>
            <StatusOverview
              total={projectsOverview.total_projects}
              data={sectorActivityData}
            />
          </div>
        </div>
        </>
      )}
      <div className='regional-movement-activities'>
        { movementActivityListPending && <BlockLoading /> }
        <div className='tc-header'>
          <div className='tc-top fold__header__block'>
            <h2 className='fold__title margin-reset'>
              <Translate stringId='regional3WMovementActivity'/>
            </h2>
            <div className='tc-actions'>
              {isUserLoggedIn && (
                <button
                  onClick={handleCreateThreeWActivityButtonClick}
                  className='button button--primary-bounded button--small'
                >
                  <Translate stringId='regional3WAdd' />
                </button>
              )}
              <ExportButton
                regionId={regionId}
                filters={movementActivityFilters}
              />
            </div>
          </div>
          <MovementActivitiesFilters
            value={movementActivityFilters}
            onChange={setMovementActivityFilters}
          />
        </div>
        <div className='tc-content'>
          <Map
            regionId={regionId}
            data={movementActivityList}
            countries={countries}
            regions={regions}
            countriesGeojson={countriesGeojson}
          />
          <div className='countries-threew-tables'>
            { movementActivityList.map(c => (
              <CountryTable
                filters={movementActivityFilters}
                key={c.id}
                onHeaderClick={setActiveCountryId}
                isActive={String(activeCountryId) === String(c.id)}
                data={c}
              />
            ))}
          </div>
        </div>
      </div>
      <div className='regional-ns-activities'>
        <div className='tc-header'>
          <div className='fold__header__block'>
            <h2 className='fold__title margin-reset'>
              <Translate stringId='regional3WNationalActivity'/>
            </h2>
          </div>
          <NSActivitiesFilters
            value={nsActivityFilters}
            onChange={setNSActivityFilters}
            data={nationalSocietyActivitiesWoFilters}
          />
        </div>
        <div className='ns-sankey-container'>
          { nationalSocietyActivitiesPending || nationalSocietyActivitiesWoFiltersPending ? (
            <BlockLoading />
          ) : (
            (nationalSocietyActivities.links || emptyList).length === 0 ? (
              <div className='sankey-empty-message'>
                <Translate stringId='regional3WSankeyEmpty'/>
              </div>
            ) : (
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
            )
          )}
        </div>
      </div>
      { showProjectForm && (
        <ProjectFormModal
          onCloseButtonClick={handleProjectFormModalCloseButtonClick}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  regionalMovementActivitiesResponse: regionalMovementActivitiesSelector(state),
  regionalProjectsOverviewResponse: regionalProjectsOverviewSelector(state),
  nationalSocietyActivitiesResponse: nationalSocietyActivitiesSelector(state),
  nationalSocietyActivitiesWoFiltersResponse: nationalSocietyActivitiesWoFiltersSelector(state),
  isUserLoggedIn: !!state.user.data.token,
  projectFormResponse: state.projectForm,
  countries: countriesSelector(state),
  regions: regionsByIdSelector(state),
  countriesGeojson: countriesGeojsonSelector(state)
});

const mapDispatchToProps = (dispatch) => ({
  getRegionalMovementActivities: (...args) => dispatch(getRegionalMovementActivitiesAction(...args)),
  getRegionalProjectsOverview: (...args) => dispatch(getRegionalProjectsOverviewAction(...args)),
  getNationalSocietyActivities: (...args) => dispatch(getNationalSocietyActivitiesAction(...args)),
  getNationalSocietyActivitiesWoFilters: (...args) => dispatch(getNationalSocietyActivitiesWoFiltersAction(...args)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(RegionalThreeW));

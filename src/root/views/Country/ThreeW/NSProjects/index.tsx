import React from 'react';
import { Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import {
  _cs,
  isNotDefined,
  unique,
  listToGroupList,
} from '@togglecorp/fujs';
import {
  IoChevronForward,
  IoLockClosed,
} from 'react-icons/io5';

import BlockLoading from '#components/block-loading';
import Button, { useButtonFeatures } from '#components/Button';
import Translate from '#components/Translate';
import KeyFigure from '#components/KeyFigure';
import Card from '#components/Card';
import Container from '#components/Container';
import ExportProjectsButton from '#components/ExportProjectsButton';
import ExpandableContainer from '#components/ExpandableContainer';
import Table from '#components/Table';
import { createActionColumn } from '#components/Table/predefinedColumns';
import LanguageContext from '#root/languageContext';
import useReduxState from '#hooks/useReduxState';
import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import {
  Country,
  Project,
} from '#types';

import ProjectTableActions from '../ProjectTableActions';
import ProjectStatPieChart from '../ProjectStatPieChart';
import ProjectFlowSankey from '../ProjectFlowSankey';
import { nsProjectColumns } from '../projectTableColumns';
import {
  LabelValue,
  emptyProjectList,
  PROJECT_STATUS_ONGOING,
  projectKeySelector,
  projectListToNsSankeyData,
  filterProjects,
} from '../common';
import Map from './Map';
import Filters, { FilterValue } from './Filters';
import SankeyFilters, { SankeyFilterValue } from './SankeyFilters';

import styles from './styles.module.scss';

const history = createBrowserHistory();

interface Props {
  country: Country | undefined;
  className?: string;
  projectsUpdatedOn?: number | undefined;
}

function NSProjects(props: Props) {
  const { strings } = React.useContext(LanguageContext);
  const user = useReduxState('me');
  const isLoggedIn = !!user.data.id;

  const {
    country,
    className,
    projectsUpdatedOn,
  } = props;

  const [filters, setFilters] = React.useState<FilterValue>({
    project_country: [],
    operation_type: [],
    programme_type: [],
    primary_sector: [],
    secondary_sectors: [],
  });

  const [sankeyFilters, setSankeyFilters] = React.useState<SankeyFilterValue>({
    primary_sector: [],
    project_country: [],
  });

  const {
    pending: projectListPending,
    response: projectListResponse,
    retrigger: retriggerProjectListRequest,
  } = useRequest<ListResponse<Project>>({
    skip: isNotDefined(country?.id),
    url: 'api/v2/project/',
    query: {
      limit: 500,
      reporting_ns: country?.id,
    },
  });

  React.useEffect(() => {
    if (projectsUpdatedOn) {
      retriggerProjectListRequest();
    }
  }, [projectsUpdatedOn, retriggerProjectListRequest]);

  const projectList = projectListResponse?.results ?? emptyProjectList;
  const filteredProjectList = filterProjects(projectList, filters);

  const [
    ongoingProjects,
    targetedPopulation,
    ongoingProjectBudget,
    programmeTypeCounts,
    statusCounts,
  ] = React.useMemo(() => {
    const ongoing = filteredProjectList.filter((p) => p.status === PROJECT_STATUS_ONGOING);
    const ongoingBudget = ongoing.reduce((acc, val) => acc + (+(val.budget_amount ?? 0)), 0);
    const target = filteredProjectList.reduce((acc, val) => acc + (+(val.target_total ?? 0)), 0);
    const programmeTypeGrouped = (
      listToGroupList(
        filteredProjectList,
        d => d.programme_type_display,
        d => d,
      ) ?? {}
    );
    const programmeTypeCounts = Object.keys(programmeTypeGrouped).reduce((acc, key) => (
      [...acc, { label: key, value: programmeTypeGrouped[key].length }]
    ), [] as LabelValue[]);

    const statusGrouped = (
      listToGroupList(
        filteredProjectList,
        d => d.status_display,
        d => d,
      ) ?? {}
    );
    const statusCounts = Object.keys(statusGrouped).reduce((acc, key) => (
      [...acc, { label: key, value: statusGrouped[key].length }]
    ), [] as LabelValue[]);

    return [
      ongoing,
      target,
      ongoingBudget,
      programmeTypeCounts,
      statusCounts,
    ];
  }, [filteredProjectList]);

  const numActivities = React.useMemo(() => (
    unique(ongoingProjects, d => d.project_country)?.length ?? 0
  ), [ongoingProjects]);

  const tableColumns = React.useMemo(() => ([
    ...nsProjectColumns,
    createActionColumn(
      'actions',
      (rowKey: number | string, prj: Project) => ({
        children: (
          <ProjectTableActions
            onProjectFormSubmitSuccess={retriggerProjectListRequest}
            onProjectDeletionSuccess={retriggerProjectListRequest}
            project={prj}
          />
        ),
      }),
    ),
  ]), [retriggerProjectListRequest]);

  const currentProjectList = ongoingProjects;

  const sankeyData = React.useMemo(() => (
    projectListToNsSankeyData(
      filterProjects(
        projectList,
        sankeyFilters,
      )
    )
  ), [sankeyFilters, projectList]);

  const countryGroupedProjects = React.useMemo(() => (
    listToGroupList(currentProjectList, d => d.project_country)
  ), [currentProjectList]);


  const bottomLinkProps = useButtonFeatures({
    variant: 'secondary',
    children: strings.threeWLoginMessage,
    actions: <IoLockClosed />,
  });

  const viewAllProjectLinkProps = useButtonFeatures({
    variant: 'tertiary',
    actions: <IoChevronForward />,
    children: strings.threeWViewAllProjectsLabel,
  });

  return (
    <div className={_cs(styles.nsProjects, className)}>
      { projectListPending ? (
        <BlockLoading />
      ) : (
        <>
          <div className={styles.stats}>
            <Card multiColumn>
              <KeyFigure
                value={numActivities}
                description={strings.threeWKeyFigureCountryActivityTitle}
              />
              <KeyFigure
                value={targetedPopulation}
                description={strings.threeWKeyFigureTargetedPopulationTitle}
              />
            </Card>
            <Card multiColumn>
              <KeyFigure
                value={projectList.length}
                description={strings.threeWKeyFigureTotalProjectsTitle}
              />
              <ProjectStatPieChart
                title={strings.threeWKeyFigureProgrammeTypeTitle}
                data={programmeTypeCounts}
              />
            </Card>
            <Card multiColumn>
              <KeyFigure
                value={ongoingProjectBudget}
                description={strings.threeWKeyFigureOngoingProjectBudgetTitle}
              />
              <ProjectStatPieChart
                title={strings.threeWKeyFigureStatusTitle}
                data={statusCounts}
              />
            </Card>
          </div>
          {!isLoggedIn && (
            <div className={styles.topLoginInfo}>
              <Translate
                stringId="threeWTopNoLoginMessage"
                params={{
                  loginLink: (
                    <Link
                      className={styles.link}
                      to={{
                        pathname: '/login',
                        state: { from: history.location }
                      }}
                    >
                      <Translate stringId='userMenuLogin'/>
                    </Link>
                  ),
                }}
              />
            </div>
          )}
          <Container
            className={styles.ongoingProject}
            heading={strings.threeWOngoingProjectsTitle}
            actions={(
              <>
                <ExportProjectsButton
                  countryId={country?.id}
                  fileNameSuffix={country?.name}
                  isNationalSociety
                />
                <Link
                  to={`/three-w/all/?reporting_ns=${country?.id}`}
                  {...viewAllProjectLinkProps}
                />
              </>
            )}
            sub
          >
            <Filters
              value={filters}
              onChange={setFilters}
            />
            <div className={styles.mapSection}>
              <Map
                className={styles.map}
                projectList={currentProjectList}
              />
              <Container
                className={styles.mapDetails}
                heading={strings.threeWNSMapSidebarTitle}
                contentClassName={styles.content}
                innerContainerClassName={styles.innerContainer}
                sub
              >
                {Object.values(countryGroupedProjects).map((pl) => {
                  if (!pl || pl.length === 0) {
                    return null;
                  }

                  const d0 = pl[0].project_country_detail;

                  return (
                    <ExpandableContainer
                      key={d0.id}
                      heading={(
                        <Translate
                          stringId="threeWNSCountryProjectsText"
                          params={{
                            countryName: d0.name,
                            numProjects: pl.length,
                          }}
                        />
                      )}
                      headingSize="small"
                      sub
                    >
                      {pl.map((project) => (
                        <div
                          className={styles.projectDetailItem}
                          key={project.id}
                        >
                          <div className={styles.name}>
                            {project.name}
                          </div>
                          <ProjectTableActions
                            className={styles.actions}
                            project={project}
                            onProjectFormSubmitSuccess={retriggerProjectListRequest}
                            onProjectDeletionSuccess={retriggerProjectListRequest}
                          />
                        </div>
                      ))}
                    </ExpandableContainer>
                  );
                })}
              </Container>
            </div>
            <Table
              className={styles.projectsTable}
              data={currentProjectList}
              columns={tableColumns}
              keySelector={projectKeySelector}
              variant="large"
            />
          </Container>
          <Container
            heading={strings.threeWSankeyDiagramTitle}
            sub
          >
            <SankeyFilters
              value={sankeyFilters}
              onChange={setSankeyFilters}
            />
            <ProjectFlowSankey data={sankeyData} />
          </Container>
        </>
      )}
      {!isLoggedIn && (
        <div className={styles.bottomLoginInfo}>
          <Link
            {...bottomLinkProps}
            to={{
              pathname: '/login',
              state: { from: history.location }
            }}
          />
          { strings.threeWBottomNoLoginMessage }
        </div>
      )}
    </div>
  );
}

export default NSProjects;

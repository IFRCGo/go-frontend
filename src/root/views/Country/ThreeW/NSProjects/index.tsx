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
import useBooleanState from '#hooks/useBooleanState';
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
} from '../common';
import Map from './Map';
import Filters, { FilterValue } from './Filters';

import styles from './styles.module.scss';

const history = createBrowserHistory();

interface Props {
  country: Country | undefined;
  className?: string;
  projectsUpdatedOn?: number | undefined;
}

function NSProjects(props: Props) {
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
      ...filters,
    },
  });

  React.useEffect(() => {
    if (projectsUpdatedOn) {
      retriggerProjectListRequest();
    }
  }, [projectsUpdatedOn, retriggerProjectListRequest]);

  const [viewAllProjects,,,, toggleViewAllProject] = useBooleanState(false);
  const projectList = projectListResponse?.results ?? emptyProjectList;

  const [
    ongoingProjects,
    targetedPopulation,
    ongoingProjectBudget,
    programmeTypeCounts,
    statusCounts,
  ] = React.useMemo(() => {
    const ongoing = projectList.filter((p) => p.status === PROJECT_STATUS_ONGOING);
    const ongoingBudget = ongoing.reduce((acc, val) => acc + (+(val.budget_amount ?? 0)), 0);
    const target = projectList.reduce((acc, val) => acc + (+(val.target_total ?? 0)), 0);
    const programmeTypeGrouped = (
      listToGroupList(
        projectList,
        d => d.programme_type_display,
        d => d,
      ) ?? {}
    );
    const programmeTypeCounts = Object.keys(programmeTypeGrouped).reduce((acc, key) => (
      [...acc, { label: key, value: programmeTypeGrouped[key].length }]
    ), [] as LabelValue[]);

    const statusGrouped = (
      listToGroupList(
        projectList,
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
  }, [projectList]);

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

  const currentProjectList = viewAllProjects ? projectList : ongoingProjects;

  const sankeyData = React.useMemo(() => (
    projectListToNsSankeyData(projectList)
  ), [projectList]);

  const countryGroupedProjects = React.useMemo(() => (
    listToGroupList(currentProjectList, d => d.project_country)
  ), [currentProjectList]);


  const bottomLinkProps = useButtonFeatures({
    variant: 'secondary',
    children: 'Login to see more details',
    actions: <IoLockClosed />,
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
                description="Activities in Countries"
              />
              <KeyFigure
                value={targetedPopulation}
                description="Targeted Population"
              />
            </Card>
            <Card multiColumn>
              <KeyFigure
                value={projectList.length}
                description="Total Projects"
              />
              <ProjectStatPieChart
                title="Programme Type"
                data={programmeTypeCounts}
              />
            </Card>
            <Card multiColumn>
              <KeyFigure
                value={ongoingProjectBudget}
                description="Total Budget (CHF) for Ongoing Projects"
              />
              <ProjectStatPieChart
                title="Project Status"
                data={statusCounts}
              />
            </Card>
          </div>
          {!isLoggedIn && (
            <div className={styles.topLoginInfo}>
              To view all the project details,
              &nbsp;
              <Link
                className={styles.link}
                to={{
                  pathname: '/login',
                  state: { from: history.location }
                }}
              >
                <Translate stringId='userMenuLogin'/>
              </Link>
              &nbsp;
              with your RCRC credentials
            </div>
          )}
          <Container
            className={styles.ongoingProject}
            heading={viewAllProjects ? 'All Projects' : 'Ongoing Projects'}
            actions={(
              <>
                <ExportProjectsButton
                  countryId={country?.id}
                  fileNameSuffix={country?.name}
                  isNationalSociety
                />
                <Button
                  actions={<IoChevronForward />}
                  variant="tertiary"
                  onClick={toggleViewAllProject}
                >
                  { viewAllProjects ? 'View Ongoing Projects' : 'View All Projects' }
                </Button>
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
                heading="Projects by Province"
                contentClassName={styles.content}
                innerContainerClassName={styles.innerContainer}
                sub
              >
                {Object.values(countryGroupedProjects).map((projectList) => {
                  if (!projectList || projectList.length === 0) {
                    return null;
                  }

                  const d0 = projectList[0].project_country_detail;
                  const title = `${d0.name} (${projectList.length} Projects)`;

                  return (
                    <ExpandableContainer
                      key={d0.id}
                      heading={title}
                      headingSize="small"
                      sub
                    >
                      {projectList.map((project) => (
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
              data={viewAllProjects ? projectList : ongoingProjects}
              columns={tableColumns}
              keySelector={projectKeySelector}
              variant="large"
            />
          </Container>
          <Container
            heading="Overview of Activities"
            sub
          >
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
          If you are a member of RCRC Movement, login with your credentials to see more details.
        </div>
      )}
    </div>
  );
}

export default NSProjects;

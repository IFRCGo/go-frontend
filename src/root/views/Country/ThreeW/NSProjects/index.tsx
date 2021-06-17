import React from 'react';
import {
  _cs,
  isNotDefined,
  unique,
  listToGroupList,
} from '@togglecorp/fujs';
import { IoChevronForward } from 'react-icons/io5';

import BlockLoading from '#components/block-loading';
import Button from '#components/Button';
import KeyFigure from '#components/KeyFigure';
import Card from '#components/Card';
import Container from '#components/Container';
import ExportProjectsButton from '#components/ExportProjectsButton';
import Table from '#components/Table';
import { createActionColumn } from '#components/Table/predefinedColumns';
import useBooleanState from '#hooks/useBooleanState';
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
import {
  LabelValue,
  emptyProjectList,
  PROJECT_STATUS_ONGOING,
  projectKeySelector,
  projectListToNsSankeyData,
} from '../common';
import { nsProjectColumns } from '../projectTableColumns';
import styles from './styles.module.scss';

interface Props {
  country: Country | undefined;
  className?: string;
  projectsUpdatedOn?: number | undefined;
}

function NSProjects(props: Props) {
  const {
    country,
    className,
    projectsUpdatedOn,
  } = props;


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

  const tableColumns = [
    ...nsProjectColumns,
    createActionColumn(
      'actions',
      (rowKey: number | string, project: Project) => ({
        children: (
          <ProjectTableActions
            onProjectFormSubmitSuccess={retriggerProjectListRequest}
            onProjectDeletionSuccess={retriggerProjectListRequest}
            project={project}
          />
        ),
      }),
    ),
  ];

  const sankeyData = React.useMemo(() => (
    projectListToNsSankeyData(projectList)
  ), [projectList]);

  return (
    <div className={_cs(styles.nsProjects, className)}>
      { projectListPending ? (
        <BlockLoading />
      ) : (
        <>
          <ExportProjectsButton
            countryId={country?.id}
            fileNameSuffix={country?.name}
            isNationalSociety
          />
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
          <Container
            className={styles.ongoingProject}
            heading={viewAllProjects ? 'All Projects' : 'Ongoing Projects'}
            actions={(
              <Button
                actions={<IoChevronForward />}
                variant="tertiary"
                onClick={toggleViewAllProject}
              >
                { viewAllProjects ? 'View Ongoing Projects' : 'View All Projects' }
              </Button>
            )}
            sub
          >
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
    </div>
  );
}

export default NSProjects;

import React from 'react';
import {
  _cs,
  isNotDefined,
  unique,
  listToGroupList,
  mapToList,
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
import { sum } from '#utils/common';
import {
  Country,
  Project,
} from '#types';

import ProjectTableActions from '../ProjectTableActions';
import ProjectStatPieChart from '../ProjectStatPieChart';
import ProjectFlowSankey from '../ProjectFlowSankey';
import { inCountryProjectColumns } from '../projectTableColumns';
import {
  LabelValue,
  emptyProjectList,
  PROJECT_STATUS_ONGOING,
  projectKeySelector,
  projectListToInCountrySankeyData,
} from '../common';
import styles from './styles.module.scss';

interface Props {
  country: Country | undefined;
  className?: string;
  projectsUpdatedOn?: number | undefined;
}

function InCountryProjects(props: Props) {
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
    skip: isNotDefined(country?.iso),
    url: 'api/v2/project/',
    query: {
      limit: 500,
      country: country?.iso,
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
    const ongoingBudget = sum(ongoing, d => (d.budget_amount ?? 0));
    const target = sum(projectList, d => (d.target_total ?? 0));
    const programmeTypeGrouped = (
      listToGroupList(
        projectList,
        d => d.programme_type_display,
        d => d,
      ) ?? {}
    );
    const programmeTypeCounts: LabelValue[] = mapToList(
      programmeTypeGrouped,
      (d, k) => ({ label: String(k), value: d.length })
    );
    const statusGrouped = (
      listToGroupList(
        projectList,
        d => d.status_display,
        d => d,
      ) ?? {}
    );

    const statusCounts: LabelValue[] = mapToList(
      statusGrouped,
      (d, k) => ({ label: String(k), value: d.length }),
    );

    return [
      ongoing,
      target,
      ongoingBudget,
      programmeTypeCounts,
      statusCounts,
    ];
  }, [projectList]);

  const numActiveNS = React.useMemo(() => (
    unique(ongoingProjects, d => d.reporting_ns)?.length ?? 0
  ), [ongoingProjects]);

  const tableColumns = [
    ...inCountryProjectColumns,
    createActionColumn(
      'actions',
      (rowKey: number | string) => ({
        children: (
          <ProjectTableActions
            onProjectFormSubmitSuccess={retriggerProjectListRequest}
            onProjectDeletionSuccess={retriggerProjectListRequest}
            projectId={+rowKey}
          />
        ),
      }),
    ),
  ];

  const sankeyData = React.useMemo(() => (
    projectListToInCountrySankeyData(projectList)
  ), [projectList]);

  return (
    <div className={_cs(styles.inCountryProjects, className)}>
      { projectListPending ? (
        <BlockLoading />
      ) : (
        <>
          <ExportProjectsButton
            countryId={country?.id}
            fileNameSuffix={country?.name}
          />
          <div className={styles.stats}>
            <Card multiColumn>
              <KeyFigure
                value={numActiveNS}
                description="Active National Societies"
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

export default InCountryProjects;

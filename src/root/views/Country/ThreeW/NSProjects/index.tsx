import React from 'react';
import {
  _cs,
  isNotDefined,
  unique,
  listToGroupList,
} from '@togglecorp/fujs';

import BlockLoading from '#components/block-loading';
import KeyFigure from '#components/KeyFigure';
import Card from '#components/Card';
import Container from '#components/Container';
import ExportProjectsButton from '#components/ExportProjectsButton';
import Table from '#components/Table';
import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import {
  Country,
  Project,
} from '#types';

import ProjectStatPieChart from '../ProjectStatPieChart';
import {
  LabelValue,
  emptyProjectList,
  PROJECT_STATUS_ONGOING,
} from '../common';
import { nsProjectColumns } from '../projectTableColumns';
import styles from './styles.module.scss';

interface Props {
  country: Country | undefined;
  className?: string;
}

function NSProjects(props: Props) {
  const {
    country,
    className,
  } = props;

  const {
    pending: projectListPending,
    response: projectListResponse,
  } = useRequest<ListResponse<Project>>({
    skip: isNotDefined(country?.id),
    url: 'api/v2/project/',
    query: {
      limit: 500,
      reporting_ns: country?.id,
    },
  });

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
            heading="Ongoing projects"
            actions="View All Projects >"
            sub
          >
            <Table
              className={styles.projectsTable}
              data={projectList}
              columns={nsProjectColumns}
              keySelector={d => d.id}
              variant="large"
            />
          </Container>
        </>
      )}
    </div>
  );
}

export default NSProjects;

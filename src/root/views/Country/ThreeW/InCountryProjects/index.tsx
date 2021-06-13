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

import Table from '#components/Table';
import { inCountryProjectColumns } from '../projectTableColumns';

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
import styles from './styles.module.scss';

interface Props {
  country: Country | undefined;
  className?: string;
}

function InCountryProjects(props: Props) {
  const {
    country,
    className,
  } = props;

  const {
    pending: projectListPending,
    response: projectListResponse,
  } = useRequest<ListResponse<Project>>({
    skip: isNotDefined(country?.iso),
    url: 'api/v2/project/',
    query: {
      limit: 500,
      country: country?.iso,
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

  const numActiveNS = React.useMemo(() => (
    unique(ongoingProjects, d => d.reporting_ns)?.length ?? 0
  ), [ongoingProjects]);

  return (
    <div className={_cs(styles.inCountryProjects, className)}>
      { projectListPending ? (
        <BlockLoading />
      ) : (
        <>
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
                title="Programme type"
                data={programmeTypeCounts}
              />
            </Card>
            <Card multiColumn>
              <KeyFigure
                value={ongoingProjectBudget}
                description="Total Budget (CHF) for Ongoing Projects"
              />
              <ProjectStatPieChart
                title="Project status"
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
              columns={inCountryProjectColumns}
              keySelector={d => d.id}
              variant="large"
            />
          </Container>
        </>
      )}
    </div>
  );
}

export default InCountryProjects;

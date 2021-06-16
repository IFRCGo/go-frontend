import React from 'react';
import {
  _cs,
  isNotDefined,
  unique,
  listToGroupList,
  mapToList,
  isDefined,
} from '@togglecorp/fujs';
import {
  IoChevronForward,
  IoClipboardOutline,
  IoPencil,
} from 'react-icons/io5';

import BlockLoading from '#components/block-loading';
import BasicModal from '#components/BasicModal';
import DropdownMenuItem from '#components/DropdownMenuItem';
import Button from '#components/Button';
import KeyFigure from '#components/KeyFigure';
import Card from '#components/Card';
import Container from '#components/Container';
import ExportProjectsButton from '#components/ExportProjectsButton';

import Table from '#components/Table';
import { createActionColumn } from '#components/Table/predefinedColumns';
import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import { sum } from '#utils/common';
import {
  Country,
  Project,
} from '#types';

import ProjectEditModal from '../ProjectEditModal';
import ProjectDetailModal from '../ProjectDetailModal';
import ProjectStatPieChart from '../ProjectStatPieChart';
import ProjectFlowSankey from '../ProjectFlowSankey';
import { inCountryProjectColumns } from '../projectTableColumns';
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
  const [showProjectDetailFor, setShowProjectDetailFor] = React.useState<number | undefined>();
  const [editProjectDetailFor, setEditProjectDetailFor] = React.useState<number | undefined>();

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

  const handleViewProjectClick = React.useCallback((projectId: string | number | undefined) => {
    if (projectId) {
      setShowProjectDetailFor(+projectId);
    }
  }, []);

  const handleEditProjectClick = React.useCallback((projectId: string | number | undefined) => {
    if (projectId) {
      setEditProjectDetailFor(+projectId);
    }
  }, []);

  const handleProjectDetailModalCloseButtonClick = React.useCallback(() => {
    setShowProjectDetailFor(undefined);
  }, []);

  const handleProjectEditModalCloseButtonClick = React.useCallback(() => {
    setEditProjectDetailFor(undefined);
  }, []);

  const tableColumns = [
    ...inCountryProjectColumns,
    createActionColumn(
      'actions',
      (rowKey: number | string) => ({
        extraActions: (
          <>
            <DropdownMenuItem
              name={rowKey}
              onClick={handleViewProjectClick}
              label="View Project"
              icon={<IoClipboardOutline />}
            />
            <DropdownMenuItem
              name={rowKey}
              icon={<IoPencil />}
              onClick={handleEditProjectClick}
              label="Edit"
            />
          </>
        ),
      }),
    ),
  ];

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
            heading="Ongoing projects"
            actions={(
              <Button
                actions={<IoChevronForward />}
                variant="tertiary"
                disabled
              >
                View All Projects
              </Button>
            )}
            sub
          >
            <Table
              className={styles.projectsTable}
              data={projectList}
              columns={tableColumns}
              keySelector={d => d.id}
              variant="large"
            />
          </Container>
          <Container
            heading="Overview of Activities"
            sub
          >
            <ProjectFlowSankey projectList={projectList} />
          </Container>
        </>
      )}
      {isDefined(showProjectDetailFor) && (
        <ProjectDetailModal
          onCloseButtonClick={handleProjectDetailModalCloseButtonClick}
          className={styles.projectDetailModal}
          projectId={showProjectDetailFor}
        />
      )}
      {isDefined(editProjectDetailFor) && (
        <ProjectEditModal
          onCloseButtonClick={handleProjectEditModalCloseButtonClick}
          className={styles.projectEditModal}
          projectId={editProjectDetailFor}
        />
      )}
    </div>
  );
}

export default InCountryProjects;

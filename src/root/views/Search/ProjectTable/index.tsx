import React from 'react';
import { _cs } from '@togglecorp/fujs';

import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import {
  createNumberColumn,
  createStringColumn,
  createLinkColumn,
} from '#components/Table/predefinedColumns';
import Table from '#components/Table';
import ReducedListDisplay from '#components/ReducedListDisplay';

import styles from './styles.module.scss';
import DateOutput from '#components/DateOutput';

export interface ProjectResult {
  id: number;
  name: string;
  event_id: number;
  event_name: string;
  national_society: string;
  tags: string[];
  sector: string;
  start_date: string;
  end_date: string;
  regions: string[];
  people_targeted: number;
  score: number;
}

function projectKeySelector(project: ProjectResult) {
  return project.id;
}

interface Props {
  className?: string;
  data: ProjectResult[] | undefined;
  actions: React.ReactNode;
}

function ProjectTable(props: Props) {
  const {
    className,
    data,
    actions,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const columns = [
    createLinkColumn<ProjectResult, number>(
      'emergency_name',
      'Emergency',
      (project) => project.event_name,
      (project) => ({
        href: `/emergency/${project.event_id}`,
        variant: 'table',
      })
    ),
    createStringColumn<ProjectResult, number>(
      'national_society',
      'National Society/ERU',
      (project) => project.national_society,
    ),
    createLinkColumn<ProjectResult, number>(
      'name',
      'Project/Activity Name',
      (project) => project.name,
      (project) => ({
        href: `/three-w/${project.id}`,
        variant: 'table',
      }),
    ),
    createStringColumn<ProjectResult, number>(
      'start_date',
      'Start-End Dates',
      (project) => (
        <div className={styles.projectDate}>
          <DateOutput value={project.start_date} />
          -
          <DateOutput value={project.end_date} />
        </div>
      ),
    ),
    createStringColumn<ProjectResult, number>(
      'regions',
      'Provinces/Region',
      (project) => (
        <ReducedListDisplay
          title="Provinces / Region"
          value={project.regions}
        />
      ),
    ),
    createStringColumn<ProjectResult, number>(
      'sector',
      'Sector',
      (project) => project.sector,
    ),
    createNumberColumn<ProjectResult, number>(
      'people_targeted',
      'People Targeted',
      (project) => project.people_targeted,
    ),
  ];

  if (!data) {
    return null;
  }

  return (
    <>
      {data && (
        <Container
          className={_cs(styles.projectTable, className)}
          heading={strings.searchIfrcProjects}
          contentClassName={styles.content}
          sub
          actions={actions}
        >
          <Table
            className={styles.inProgressDrefTable}
            data={data}
            columns={columns}
            keySelector={projectKeySelector}
            variant="large"
          />
        </Container>
      )}
    </>
  );
}

export default ProjectTable;

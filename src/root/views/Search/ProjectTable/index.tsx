import React from 'react';
import { _cs } from '@togglecorp/fujs';

import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import {
  createDateColumn,
  createNumberColumn,
  createStringColumn,
  createLinkColumn,
} from '#components/Table/predefinedColumns';
import Table from '#components/Table';

import styles from './styles.module.scss';

export interface ProjectList {
  id: number;
  name: string;
  event_id: number;
  event_name: string;
  national_society: string;
  tags: string[];
  sector: string;
  start_date: string;
  regions: string[];
  people_targeted: number;
  score: number;
}

function ProjectKeySelector(project: ProjectList) {
  return project.id;
}

interface Props {
  className?: string;
  data: ProjectList[] | undefined;
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
    createLinkColumn<ProjectList, number>(
      'name',
      'Emergency',
      (project) => project.event_name,
      (project) => ({
        href: `/emergency/${project.event_id}`,
        variant: 'table',
      })
    ),
    createStringColumn<ProjectList, number>(
      'national_society',
      'National Society/ERU',
      (project) => project.national_society,
    ),
    createLinkColumn<ProjectList, number>(
      'name',
      'Project/Activity Name',
      (project) => project.name,
      (project) => ({
        href: `/three-w/${project.id}`,
        variant: 'table',
      }),
    ),
    createDateColumn<ProjectList, number>(
      'start_date',
      'Start-End Dates',
      (project) => project.start_date,
    ),
    createStringColumn<ProjectList, number>(
      'regions',
      'Provinces/Region',
      (project) => project.regions.slice(0, 5).join(', '),
    ),
    createStringColumn<ProjectList, number>(
      'sector',
      'Sector',
      (project) => project.sector,
    ),
    createNumberColumn<ProjectList, number>(
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
            keySelector={ProjectKeySelector}
            variant="large"
          />
        </Container>
      )}
    </>
  );
}

export default ProjectTable;

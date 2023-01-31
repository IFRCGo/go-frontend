import React from 'react';
import { _cs } from '@togglecorp/fujs';

import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import {
  createDateColumn,
  createNumberColumn,
  createStringColumn,
} from '#components/Table/predefinedColumns';
import Table from '#components/Table';

import { Project } from '../index';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  data: Project[] | undefined;
}

function ProjectKeySelector(project: Project) {
  return project.id;
}

function ProjectTable(props: Props) {
  const {
    className,
    data,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const columns = [
    createStringColumn<Project, number>(
      'name',
      'Emergency',
      (project) => project.name,
    ),
    createStringColumn<Project, number>(
      'national_society',
      'National Society/ ERU',
      (project) => project.national_society,
    ),
    createStringColumn<Project, number>(
      'name',
      'Project/ Activity Name',
      (project) => project.name,
    ),
    createDateColumn<Project, number>(
      'start_date',
      'Start-End Dates',
      (project) => project.start_date,
    ),
    createStringColumn<Project, number>(
      'regions',
      'Provinces/Region',
      (project) => project.regions[0],
    ),
    createStringColumn<Project, number>(
      'sector',
      'Sector',
      (project) => project.sector,
    ),
    createNumberColumn<Project, number>(
      'people_targeted',
      'People Targeted',
      (project) => project.people_targeted,
    ),
  ];

  return (
    <Container
      className={_cs(styles.projectTable, className)}
      heading={strings.searchIfrcProjects}
      contentClassName={styles.content}
      sub
    >
      <Table
        className={styles.inProgressDrefTable}
        data={data}
        columns={columns}
        keySelector={ProjectKeySelector}
        variant="large"
      />
    </Container>
  );
}

export default ProjectTable;

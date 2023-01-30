import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Container from '#components/Container';
import Table from '#components/Table';
import LanguageContext from '#root/languageContext';
import {
  createDateColumn,
  createStringColumn,
} from '#components/Table/predefinedColumns';

import { Appeal } from '../index';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  data: Appeal[] | undefined;
}

function appealKeySelector(appeal: Appeal) {
  return appeal.id;
}

function AppealsTable(props: Props) {
  const {
    className,
    data,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const columns = [
    createDateColumn<Appeal, number>(
      'start_date',
      'Date',
      (appeal) => appeal.start_date,
    ),
    createStringColumn<Appeal, number>(
      'appeal_type',
      'Type',
      (appeal) => appeal.appeal_type
    ),
    createStringColumn<Appeal, number>(
      'code',
      'Code',
      (appeal) => appeal.code
    ),
    createStringColumn<Appeal, number>(
      'name',
      'Name',
      (appeal) => appeal.name
    ),
    createStringColumn<Appeal, number>(
      'country',
      'Country',
      (appeal) => appeal.country
    ),
  ];

  return (
    <Container
      className={_cs(styles.appealsTable, className)}
      heading={strings.searchIfrcEmergencyPlanningAndReportingDocuments}
      contentClassName={styles.content}
      sub
    >
      <Table
        className={styles.inProgressDrefTable}
        data={data}
        columns={columns}
        keySelector={appealKeySelector}
        variant="small"
      />
    </Container>
  );
}

export default AppealsTable;

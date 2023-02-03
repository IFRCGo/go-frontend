import React from 'react';
import { _cs } from '@togglecorp/fujs';
import LanguageContext from '#root/languageContext';

import Container from '#components/Container';
import Table from '#components/Table';
import {
  createDateColumn,
  createStringColumn,
} from '#components/Table/predefinedColumns';

import styles from './styles.module.scss';

export interface FieldReportResponse {
  created_at: string;
  name: string;
  id: number;
  score: number;
  event_name: string;
}

function fieldReportKeySelector(fieldReport: FieldReportResponse) {
  return fieldReport.id;
}

interface Props {
  className?: string;
  data: FieldReportResponse[] | undefined;
  actions: React.ReactNode;
}

function FieldReportTable(props: Props) {
  const {
    className,
    data,
    actions,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const columns = [
    createDateColumn<FieldReportResponse, number>(
      'created_at',
      '',
      (fieldReport) => fieldReport.created_at,
    ),
    createStringColumn<FieldReportResponse, number>(
      'event_name',
      '',
      (fieldReport) => fieldReport.event_name,
    ),
    createStringColumn<FieldReportResponse, number>(
      'name',
      '',
      (fieldReport) => fieldReport.name,
    ),
  ];

  if (!data) {
    return null;
  }

  return (
    <Container
      className={_cs(styles.fieldReportTable, className)}
      heading={strings.searchIfrcReport}
      contentClassName={styles.content}
      sub
      actions={actions}
    >
      <Table
        className={styles.inProgressDrefTable}
        data={data}
        columns={columns}
        keySelector={fieldReportKeySelector}
        variant="large"
      />
    </Container>
  );
}

export default FieldReportTable;

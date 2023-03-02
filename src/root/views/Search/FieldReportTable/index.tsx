import React from 'react';
import { _cs } from '@togglecorp/fujs';
import LanguageContext from '#root/languageContext';

import Container from '#components/Container';
import Table from '#components/Table';
import {
  createDateColumn,
  createLinkColumn,
  createStringColumn,
} from '#components/Table/predefinedColumns';

import styles from './styles.module.scss';

export interface FieldReportResponse {
  id: number;
  name: string;
  created_at: string;
  type: string;
  score: number;
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
      'Date',
      (fieldReport) => fieldReport.created_at,
    ),
    createStringColumn<FieldReportResponse, number>(
      'type',
      'Type',
      (fieldReport) => fieldReport.type,
    ),
    createLinkColumn<FieldReportResponse, number>(
      'name',
      'Title',
      (fieldReport) => fieldReport.name,
      (fieldReport) => ({
        href: `/reports/${fieldReport.id}`,
        variant: 'table',
      })
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
        className={styles.fieldReport}
        data={data}
        columns={columns}
        keySelector={fieldReportKeySelector}
        variant="large"
      />
    </Container>
  );
}

export default FieldReportTable;

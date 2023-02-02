import React from 'react';
import { _cs } from '@togglecorp/fujs';
import LanguageContext from '#root/languageContext';
import { Link } from 'react-router-dom';

import Container from '#components/Container';
import Table from '#components/Table';
import {
  createDateColumn,
  createStringColumn,
} from '#components/Table/predefinedColumns';

import { FieldReport } from '../index';

import styles from './styles.module.scss';

function fieldReportKeySelector(fieldReport: FieldReport) {
  return fieldReport.id;
}

interface Props {
  className?: string;
  data: FieldReport[] | undefined;
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
    createDateColumn<FieldReport, number>(
      'created_at',
      '',
      (fieldReport) => fieldReport.created_at,
    ),
    createStringColumn<FieldReport, number>(
      'event_name',
      '',
      (fieldReport) => fieldReport.event_name,
    ),
    createStringColumn<FieldReport, number>(
      'name',
      '',
      (fieldReport) => fieldReport.name,
    ),
  ];

  return (
    <>
      {data && (
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
      )}
    </>
  );
}

export default FieldReportTable;

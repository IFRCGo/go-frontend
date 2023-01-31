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

interface Props {
  className?: string;
  data: FieldReport[] | undefined;
}

function fieldReportKeySelector(fieldReport: FieldReport) {
  return fieldReport.id;
}

function FieldReportTable(props: Props) {
  const {
    className,
    data,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const columns = [
    createDateColumn<FieldReport, number>(
      'created_at',
      '',
      (fieldReport) => fieldReport.created_at, //FIXME: This is Link in the design
    ),
    createStringColumn<FieldReport, number>(
      'event_name',
      '',
      (fieldReport) => fieldReport.event_name
    ),
    createStringColumn<FieldReport, number>(
      'name',
      '',
      (fieldReport) => fieldReport.name
    ),
  ];

  return (
    <Container
      className={_cs(styles.fieldReportTable, className)}
      heading={strings.searchIfrcReport}
      contentClassName={styles.content}
      sub
      actions={(
        <Link
          className={styles.link}
          to={`reports/all`}
        >
          View All Documents
        </Link>
      )}
    >
      <Table
        className={styles.inProgressDrefTable}
        data={data}
        columns={columns}
        keySelector={fieldReportKeySelector}
        variant="small"
      />
    </Container>
  );
}

export default FieldReportTable;

import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Container from '#components/Container';
import Table from '#components/Table';
import LanguageContext from '#root/languageContext';
import {
  createDateColumn,
  createLinkColumn,
  createStringColumn,
} from '#components/Table/predefinedColumns';

import styles from './styles.module.scss';

export interface AppealList {
  id: number;
  name: string;
  appeal_type: string;
  code: string;
  country: string;
  start_date: string;
  score: number;
}

function appealKeySelector(appeal: AppealList) {
  return appeal.id;
}

interface Props {
  className?: string;
  data: AppealList[] | undefined;
  actions: React.ReactNode;
}

function AppealsTable(props: Props) {
  const {
    className,
    data,
    actions,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const columns = [
    createDateColumn<AppealList, number>(
      'start_date',
      'Date',
      (appeal) => appeal.start_date,
    ),
    createStringColumn<AppealList, number>(
      'appeal_type',
      'Type',
      (appeal) => appeal.appeal_type,
    ),
    createStringColumn<AppealList, number>(
      'code',
      'Code',
      (appeal) => appeal.code,
    ),
    createStringColumn<AppealList, number>(
      'name',
      'Name',
      (appeal) => appeal.name,
    ),
    createLinkColumn<AppealList, number>(
      'country',
      'Country',
      (appeal) =>  appeal.country,
      (appeal) => ({
        href: `countries/${appeal.country}`,
      })
    ),
  ];

  if (!data) {
    return null;
  }

  return (
    <>
      {data && (
        <Container
          className={_cs(styles.appealsTable, className)}
          heading={strings.searchIfrcEmergencyPlanningAndReportingDocuments}
          contentClassName={styles.content}
          sub
          actions={actions}
        >
          <Table
            className={styles.inProgressDrefTable}
            data={data}
            columns={columns}
            keySelector={appealKeySelector}
            variant="large"
          />
        </Container>
      )}
    </>
  );
}

export default AppealsTable;

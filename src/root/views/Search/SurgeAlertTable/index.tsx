import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Link } from 'react-router-dom';

import Container from '#components/Container';
import Table from '#components/Table';
import LanguageContext from '#root/languageContext';
import {
  createDateColumn,
  createStringColumn,
} from '#components/Table/predefinedColumns';

import styles from './styles.module.scss';

export interface SurgeAlertList {
  id: number;
  name: string;
  keywords: string[] | null;
  event_name: string;
  country: string | null;
  start_date: string;
  alert_date: string | null;
  score: number;
  event_id: number;
  status: string;
  deadline: string;
  surge_type: string;
}

function surgeAlertKeySelector(surgeAlert: SurgeAlertList) {
  return surgeAlert.id;
}

interface Props {
  className?: string;
  data: SurgeAlertList[] | undefined;
  actions: React.ReactNode;
}

function SurgeAlertTable(props: Props) {
  const {
    className,
    data,
    actions,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const columns = [
    createDateColumn<SurgeAlertList, number>(
      'alert_date',
      'Alert Date',
      (surgeAlert) => surgeAlert.alert_date,
    ),
    createDateColumn<SurgeAlertList, number>(
      'deadline',
      'Application Deadline',
      (surgeAlert) => surgeAlert.deadline,
    ),
    createStringColumn<SurgeAlertList, number>(
      'duration',
      'Duration',
      (surgeAlert) => {
        const startDate = new Date(surgeAlert.start_date);
        const deadline = new Date(surgeAlert.deadline);
        const duration = deadline.getDay() - startDate.getDay();
        if (duration > 1) {
          return `${duration} Days`;
        }
        return `-`;
      }),
    createDateColumn<SurgeAlertList, number>(
      'start_date',
      'Start Date',
      (surgeAlert) => surgeAlert.start_date,
    ),
    createStringColumn<SurgeAlertList, number>(
      'name',
      'Position',
      (surgeAlert) => surgeAlert.name,
    ),
    createStringColumn<SurgeAlertList, number>(
      'keywords',
      'Keywords',
      (surgeAlert) => surgeAlert.keywords?.slice(0, 5).join(', '),
    ),
    createStringColumn<SurgeAlertList, number>(
      'surge_type',
      'Surge Type',
      (surgeAlert) => surgeAlert.surge_type,
    ),
    createStringColumn<SurgeAlertList, number>(
      'status',
      'Status',
      (surgeAlert) => surgeAlert.status,
    )
  ];

  if (!data) {
    return null;
  }

  return (
    <>
      {data && (
        <Container
          className={_cs(styles.surgeAlertsTable, className)}
          heading={strings.searchIfrcOpenSurgeAlerts}
          contentClassName={styles.content}
          sub
          actions={actions}
        >
          <Table
            className={styles.appealsTable}
            data={data}
            columns={columns}
            keySelector={surgeAlertKeySelector}
            variant="large"
          />
        </Container>
      )}
    </>
  );
}

export default SurgeAlertTable;

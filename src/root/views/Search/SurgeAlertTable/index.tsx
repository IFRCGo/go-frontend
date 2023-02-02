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

import { SurgeAlert } from '../index';

import styles from './styles.module.scss';

function surgeAlertKeySelector(surgeAlert: SurgeAlert) {
  return surgeAlert.id;
}

interface Props {
  className?: string;
  data: SurgeAlert[] | undefined;
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
    createDateColumn<SurgeAlert, number>(
      'alert_date',
      'Alert Date',
      (surgeAlert) => surgeAlert.alert_date,
    ),
    createDateColumn<SurgeAlert, number>(
      'deadline',
      'Application Deadline',
      (surgeAlert) => surgeAlert.deadline,
    ),
    createStringColumn<SurgeAlert, number>(
      'duration',
      'Duration',
      (surgeAlert) => {
        const startDate = new Date(surgeAlert.start_date);
        const deadline = new Date(surgeAlert.deadline);
        const duration = deadline.getDay() - startDate.getDay();
        return `${duration} Days`;
      }),
    createDateColumn<SurgeAlert, number>(
      'start_date',
      'Start Date',
      (surgeAlert) => surgeAlert.start_date,
    ),
    createStringColumn<SurgeAlert, number>(
      'name',
      'Position',
      (surgeAlert) => surgeAlert.name,
    ),
    createStringColumn<SurgeAlert, number>(
      'keywords',
      'Keywords',
      (surgeAlert) => surgeAlert.keywords?.slice(0, 5).join(', '),
    ),
    createStringColumn<SurgeAlert, number>(
      'surge_type',
      'Surge Type',
      (surgeAlert) => surgeAlert.surge_type,
    ),
    createStringColumn<SurgeAlert, number>(
      'status',
      'Status',
      (surgeAlert) => surgeAlert.status,
    )
  ];

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

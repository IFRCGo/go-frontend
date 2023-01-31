import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Link } from 'react-router-dom';

import Container from '#components/Container';
import Table from '#components/Table';
import LanguageContext from '#root/languageContext';
import {
  createDateColumn,
  createNumberColumn,
  createStringColumn,
} from '#components/Table/predefinedColumns';

import { SurgeAlert } from '../index';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  data: SurgeAlert[] | undefined;
}

function surgeAlertKeySelector(surgeAlert: SurgeAlert) {
  return surgeAlert.id;
}

function SurgeAlertTable(props: Props) {
  const {
    className,
    data,
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
    createNumberColumn<SurgeAlert, number>(
      'duration',
      'Duration',
      (surgeAlert) => {
        const duration = Number(surgeAlert.alert_date) - Number(surgeAlert.deadline);
        return duration;
      }),
    createDateColumn<SurgeAlert, number>(
      'start_date',
      'Start Date',
      (surgeAlert) => surgeAlert.start_date
    ),
    createStringColumn<SurgeAlert, number>(
      'name',
      'Position',
      (surgeAlert) => surgeAlert.name
    ),
    createStringColumn<SurgeAlert, number>(
      'keywords',
      'Keywords',
      (surgeAlert) => surgeAlert.keywords
    ),
    createStringColumn<SurgeAlert, number>(
      'surge_type',
      'Surge Type',
      (surgeAlert) => surgeAlert.surge_type
    ),
    createStringColumn<SurgeAlert, number>(
      'status',
      'Status',
      (surgeAlert) => surgeAlert.status
    )
  ];

  return (
    <Container
      className={_cs(styles.surgeAlertsTable, className)}
      heading={strings.searchIfrcOpenSurgeAlerts}
      contentClassName={styles.content}
      sub
      actions={(
        <Link
          className={styles.link}
          to={`alerts/all`}
        >
          View All Documents
        </Link>
      )}
    >
      <Table
        className={styles.appealsTable}
        data={data}
        columns={columns}
        keySelector={surgeAlertKeySelector}
        variant="small"
      />
    </Container>
  );
}

export default SurgeAlertTable;

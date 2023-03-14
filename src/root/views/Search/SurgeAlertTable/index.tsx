import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { DateTime } from 'luxon';

import Container from '#components/Container';
import Table from '#components/Table';
import LanguageContext from '#root/languageContext';
import {
  createDateColumn,
  createLinkColumn,
  createStringColumn,
} from '#components/Table/predefinedColumns';
import { getDuration } from '#utils/utils';

import styles from './styles.module.scss';

export interface SurgeAlertResult {
  id: number;
  name: string;
  keywords: string[] | null;
  event_name: string;
  country: string | null;
  country_id: string | null;
  start_date: string | null;
  alert_date: string | null;
  score: number;
  event_id: number;
  status: string;
  deadline: string;
}

function surgeAlertKeySelector(surgeAlert: SurgeAlertResult) {
  return surgeAlert.id;
}

interface Props {
  className?: string;
  data: SurgeAlertResult[] | undefined;
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
    createDateColumn<SurgeAlertResult, number>(
      'alert_date',
      'Alert Date',
      (surgeAlert) => surgeAlert.alert_date,
    ),
    createStringColumn<SurgeAlertResult, number>(
      'duration',
      'Duration',
      (surgeAlert) => {
        if (!surgeAlert.alert_date) {
          return '-';
        }

        const alertDate = DateTime.fromISO(surgeAlert.alert_date);
        const deadline = DateTime.fromISO(surgeAlert.deadline);
        const duration = getDuration(alertDate, deadline);

        return duration;
      },
    ),
    createDateColumn<SurgeAlertResult, number>(
      'start_date',
      'Start Date',
      (surgeAlert) => surgeAlert.start_date,
    ),
    createStringColumn<SurgeAlertResult, number>(
      'name',
      'Position',
      (surgeAlert) => surgeAlert.name,
    ),
    createStringColumn<SurgeAlertResult, number>(
      'keywords',
      'Keywords',
      (surgeAlert) => surgeAlert.keywords?.join(', '),
    ),
    createLinkColumn<SurgeAlertResult, number>(
      'event_name',
      'Emergency',
      (surgeAlert) => surgeAlert.event_name,
      (surgeAlert) => ({
        href: `emergencies/${surgeAlert.event_id}`,
        variant: 'table',
      })
    ),
    createLinkColumn<SurgeAlertResult, number>(
      'country',
      'Country',
      (surgeAlert) => surgeAlert.country,
      (surgeAlert) => ({
        href: `/countries/${surgeAlert.country_id}`,
        variant: 'table',
      })
    ),
    createStringColumn<SurgeAlertResult, number>(
      'status',
      'Status',
      (surgeAlert) => surgeAlert.status,
    )
  ];

  if (!data) {
    return null;
  }

  return (
    <Container
      className={_cs(styles.surgeAlertsTable, className)}
      heading={strings.searchIfrcOpenSurgeAlerts}
      contentClassName={styles.content}
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
  );
}

export default SurgeAlertTable;

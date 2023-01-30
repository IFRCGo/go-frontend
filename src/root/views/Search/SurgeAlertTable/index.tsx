import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Container from '#components/Container';
import Table from '#components/Table';
import LanguageContext from '#root/languageContext';
import {
  createDateColumn,
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
    createStringColumn<SurgeAlert, number>(
      'start_date',
      'Start Date',
      (surgeAlert) => surgeAlert.start_date
    ),
    createStringColumn<SurgeAlert, number>(
        'keywords',
        'Keywords',
        (surgeAlert) => surgeAlert.keywords
      ),
  ];

  return (
    <Container
      className={_cs(styles.surgeAlertsTable, className)}
      heading={strings.searchIfrcOpenSurgeAlerts}
      contentClassName={styles.content}
      sub
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

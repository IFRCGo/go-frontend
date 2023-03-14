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

export interface EmergencyPlanningResult {
  id: number;
  name: string;
  code: string;
  country: string;
  country_id: number;
  start_date: string;
  score: number;
  type: string;
}

function emergencyPlanningKeySelector(emergencyPlanning: EmergencyPlanningResult) {
  return emergencyPlanning.id;
}

interface Props {
  className?: string;
  data: EmergencyPlanningResult[] | undefined;
  actions: React.ReactNode;
}

function EmergencyPlanningTable(props: Props) {
  const {
    className,
    data,
    actions,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const columns = [
    createDateColumn<EmergencyPlanningResult, number>(
      'start_date',
      'Date',
      (emergencyPlanning) => emergencyPlanning.start_date,
    ),
    createStringColumn<EmergencyPlanningResult, number>(
      'type',
      'Type',
      (emergencyPlanning) => emergencyPlanning.type,
    ),
    createStringColumn<EmergencyPlanningResult, number>(
      'code',
      'Code',
      (emergencyPlanning) => emergencyPlanning.code,
    ),
    createLinkColumn<EmergencyPlanningResult, number>(
      'name',
      'Title',
      (emergencyPlanning) => emergencyPlanning.name,
      (emergencyPlanning) => ({
        href: `emergencies/${emergencyPlanning.id}`,
        variant: 'table'
      })
    ),
    createLinkColumn<EmergencyPlanningResult, number>(
      'country',
      'Country',
      (emergencyPlanning) =>  emergencyPlanning.country,
      (emergencyPlanning) => ({
        href: `countries/${emergencyPlanning.country_id}`,
        variant: 'table'
      })
    ),
  ];

  if (!data) {
    return null;
  }

  return (
    <Container
      className={_cs(styles.emergencyPlanningTable, className)}
      heading={strings.searchIfrcEmergencyPlanningAndReporting}
      contentClassName={styles.content}
      actions={actions}
    >
      <Table
        className={styles.inProgressDrefTable}
        data={data}
        columns={columns}
        keySelector={emergencyPlanningKeySelector}
        variant="large"
      />
    </Container>
  );
}

export default EmergencyPlanningTable;

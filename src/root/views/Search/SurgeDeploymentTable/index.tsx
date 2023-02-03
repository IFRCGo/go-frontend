import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Container from '#components/Container';
import Table from '#components/Table';
import LanguageContext from '#root/languageContext';
import {
  createLinkColumn,
  createNumberColumn,
  createStringColumn,
} from '#components/Table/predefinedColumns';

import styles from './styles.module.scss';

export interface SurgeDeploymentResult {
  id: number;
  event_name: string;
  deployed_country: string;
  type: string;
  owner: string;
  personnel_units: number;
  equipment_units: number;
  score: number;
}

function surgeDeploymentKeySelector(surgeDeployment: SurgeDeploymentResult) {
  return surgeDeployment.id;
}

interface Props {
  className?: string;
  data: SurgeDeploymentResult[] | undefined;
  actions: React.ReactNode;
}

function SurgeDeploymentTable(props: Props) {
  const {
    className,
    data,
    actions,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const columns = [
    createStringColumn<SurgeDeploymentResult, number>(
      'owner',
      'Owner',
      (surgeDeployment) => surgeDeployment.owner,
    ),
    createStringColumn<SurgeDeploymentResult, number>(
      'type',
      'Type',
      (surgeDeployment) => surgeDeployment.type,
    ),
    createNumberColumn<SurgeDeploymentResult, number>(
      'personnel_units',
      'Personnel Units',
      (surgeDeployment) => surgeDeployment.personnel_units,
    ),
    createNumberColumn<SurgeDeploymentResult, number>(
      'equipment_units',
      'Equipment Units',
      (surgeDeployment) => surgeDeployment.equipment_units,
    ),
    createStringColumn<SurgeDeploymentResult, number>(
      'deployed_country',
      'Country Deployed to',
      (surgeDeployment) => surgeDeployment.deployed_country,
    ),
    createLinkColumn<SurgeDeploymentResult, number>(
      'event_name',
      'Emergency',
      (surgeDeployement) => surgeDeployement.event_name,
      (surgeDeployement) => ({
        href: `emergencies/${surgeDeployement.id}`,
        variant: "table",
      })
    ),
  ];

  if (!data) {
    return null;
  }

  return (
    <Container
      className={_cs(styles.surgeDeploymentTable, className)}
      heading={strings.searchIfrcEmergencyPlanningAndReportingDocuments}
      contentClassName={styles.content}
      sub
      actions={actions}
    >
      <Table
        className={styles.inProgressDrefTable}
        data={data}
        columns={columns}
        keySelector={surgeDeploymentKeySelector}
        variant="large"
      />
    </Container>
  );
}

export default SurgeDeploymentTable;

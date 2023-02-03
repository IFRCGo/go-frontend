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

export interface SurgeDeploymentList {
  id: number;
  event_name: string;
  deployed_country: string;
  type: string;
  owner: string;
  personnel_units: number;
  equipment_units: number;
  score: number;
}

function surgeDeploymentTable(surgeDeployment: SurgeDeploymentList) {
  return surgeDeployment.id;
}

interface Props {
  className?: string;
  data: SurgeDeploymentList[] | undefined;
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
    createStringColumn<SurgeDeploymentList, number>(
      'owner',
      'Owner',
      (surgeDeployment) => surgeDeployment.owner,
    ),
    createStringColumn<SurgeDeploymentList, number>(
      'type',
      'Type',
      (surgeDeployment) => surgeDeployment.type,
    ),
    createNumberColumn<SurgeDeploymentList, number>(
      'personnel_units',
      'Personnel Units',
      (surgeDeployment) => surgeDeployment.personnel_units,
    ),
    createNumberColumn<SurgeDeploymentList, number>(
      'equipment_units',
      'Equipment Units',
      (surgeDeployment) => surgeDeployment.equipment_units,
    ),
    createStringColumn<SurgeDeploymentList, number>(
      'deployed_country',
      'Country Deployed to',
      (surgeDeployment) => surgeDeployment.deployed_country,
    ),
    createLinkColumn<SurgeDeploymentList, number>(
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
    <>
      {data && (
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
            keySelector={surgeDeploymentTable}
            variant="large"
          />
        </Container>
      )}
    </>
  );
}

export default SurgeDeploymentTable;

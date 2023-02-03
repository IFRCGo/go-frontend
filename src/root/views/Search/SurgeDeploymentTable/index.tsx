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

export interface SurgeDeployementList {
  id: number;
  event_name: string;
  deployed_country: string;
  type: string;
  owner: string;
  personnel_units: number;
  equipment_units: number;
  score: number;
}

function surgeDeploymentTable(surgeDeployement: SurgeDeployementList) {
  return surgeDeployement.id;
}

interface Props {
  className?: string;
  data: SurgeDeployementList[] | undefined;
  actions: React.ReactNode;
}

function SurgeDeployementTable(props: Props) {
  const {
    className,
    data,
    actions,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const columns = [
    createStringColumn<SurgeDeployementList, number>(
      'owner',
      'Owner',
      (surgeDeployement) => surgeDeployement.owner,
    ),
    createStringColumn<SurgeDeployementList, number>(
      'type',
      'Type',
      (surgeDeployement) => surgeDeployement.type,
    ),
    createNumberColumn<SurgeDeployementList, number>(
      'personnel_units',
      'Personnel Units',
      (surgeDeployement) => surgeDeployement.personnel_units,
    ),
    createNumberColumn<SurgeDeployementList, number>(
      'equipment_units',
      'Equipment Units',
      (surgeDeployement) => surgeDeployement.equipment_units,
    ),
    createStringColumn<SurgeDeployementList, number>(
      'deployed_country',
      'Country Deployed to',
      (surgeDeployement) => surgeDeployement.deployed_country,
    ),
    createLinkColumn<SurgeDeployementList, number>(
      'event_name',
      'Emergency',
      (surgeDeployement) => surgeDeployement.event_name,
      (surgeDeployement) => ({
        href: `emergencies/${surgeDeployement.id}`,
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
          className={_cs(styles.surgeDeployementTable, className)}
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
            variant="small"
          />
        </Container>
      )}
    </>
  );
}

export default SurgeDeployementTable;

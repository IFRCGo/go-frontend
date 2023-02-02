import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Link } from 'react-router-dom';

import Container from '#components/Container';
import Table from '#components/Table';
import LanguageContext from '#root/languageContext';
import {
  createLinkColumn,
  createNumberColumn,
  createStringColumn,
} from '#components/Table/predefinedColumns';

import { SurgeDeployement } from '../index';

import styles from './styles.module.scss';

function surgeDeploymentTable(surgeDeployement: SurgeDeployement) {
  return surgeDeployement.id;
}

interface Props {
  className?: string;
  data: SurgeDeployement[] | undefined;
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
    createStringColumn<SurgeDeployement, number>(
      'owner',
      'Owner',
      (surgeDeployement) => surgeDeployement.owner,
    ),
    createStringColumn<SurgeDeployement, number>(
      'type',
      'Type',
      (surgeDeployement) => surgeDeployement.type,
    ),
    createNumberColumn<SurgeDeployement, number>(
      'personnel_units',
      'Personnel Units',
      (surgeDeployement) => surgeDeployement.personnel_units,
    ),
    createNumberColumn<SurgeDeployement, number>(
      'equipment_units',
      'Equipment Units',
      (surgeDeployement) => surgeDeployement.equipment_units,
    ),
    createStringColumn<SurgeDeployement, number>(
      'deployed_country',
      'Country Deployed to',
      (surgeDeployement) => surgeDeployement.deployed_country,
    ),
    createLinkColumn<SurgeDeployement, number>(
      'event_name',
      'Emergency',
      (surgeDeployement) => surgeDeployement.event_name,
      (surgeDeployement) => ({
        href: `emergencies/${surgeDeployement.id}`,
      })
    ),
  ];

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

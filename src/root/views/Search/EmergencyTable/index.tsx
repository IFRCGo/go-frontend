import React from 'react';
import { _cs } from '@togglecorp/fujs';

import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import {
  createLinkColumn,
  createNumberColumn,
  createStringColumn,
} from '#components/Table/predefinedColumns';
import Table from '#components/Table';

import styles from './styles.module.scss';

export interface EmergencyList {
  id: number;
  disaster_type: string;
  funding_requirements: number;
  name: string;
  funding_coverage: string;
  event_date: string;
  score: number;
}

function emergencyKeySelector(emergency: EmergencyList) {
  return emergency.id;
}

interface Props {
  className?: string;
  data: EmergencyList[] | undefined;
  actions: React.ReactNode;
}

function EmergencyTable(props: Props) {
  const {
    className,
    data,
    actions,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const columns = [
    createLinkColumn<EmergencyList, number>(
      'name',
      'Active Operations',
      (emergency) => emergency.name,
      (emergency) => ({
        href: `/emergencies/${emergency.id}`,
        variant: 'table',
      })
    ),
    createStringColumn<EmergencyList, number>(
      'disaster_type',
      'Disaster Type',
      (emergency) => emergency.disaster_type,
    ),
    createNumberColumn<EmergencyList, number>(
      'funding_requirements',
      'Funding Requirements',
      (emergency) => emergency.funding_requirements,
    ),
    createStringColumn<EmergencyList, number>(
      'funding_coverage',
      'Funding Coverage',
      (emergency) => {
        if (emergency.funding_requirements && emergency.funding_requirements > 0) {
          const percent = Number(emergency.funding_coverage) / Number(emergency.funding_requirements) * 100;
          return `${percent.toFixed(1)} %`;
        }
        return '-';
      }),
  ];

  if (!data) {
    return null;
  }

  return (
    <>
      {data && (
        <Container
          className={_cs(styles.emergencyTable, className)}
          heading={strings.searchIfrcEmergencies}
          contentClassName={styles.content}
          sub
          actions={actions}
        >
          <Table
            className={styles.inProgressDrefTable}
            data={data}
            columns={columns}
            keySelector={emergencyKeySelector}
            variant="large"
          />
        </Container>
      )}
    </>
  );
}

export default EmergencyTable;

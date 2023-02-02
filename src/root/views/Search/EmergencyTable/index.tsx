import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Link } from 'react-router-dom';

import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import {
  createLinkColumn,
  createStringColumn,
} from '#components/Table/predefinedColumns';
import Table from '#components/Table';

import { Emergency } from '../index';

import styles from './styles.module.scss';

function emergencyKeySelector(emergency: Emergency) {
  return emergency.id;
}

interface Props {
  className?: string;
  data: Emergency[] | undefined;
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
    createLinkColumn<Emergency, number>(
      'name',
      'Active Operations',
      (emergency) => emergency.name,
      (emergency) => ({
        href: `/emergencies/${emergency.id}`,
      })
    ),
    createStringColumn<Emergency, number>(
      'disaster_type',
      'Disaster Type',
      (emergency) => emergency.disaster_type,
    ),
    createStringColumn<Emergency, number>(
      'funding_requirements',
      'Funding Requirements',
      (emergency) => emergency.funding_requirements,
    ),
    createStringColumn<Emergency, number>(
      'funding_coverage',
      'Funding Coverage',
      (emergency) => {
        if (emergency.funding_requirements) {
          const percent = Number(emergency.funding_coverage) / Number(emergency.funding_requirements) * 100;
          return `${percent.toFixed(1)} %`;
        }
        return '-';
      }),
  ];

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

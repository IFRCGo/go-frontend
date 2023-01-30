import React from 'react';
import { _cs } from '@togglecorp/fujs';

import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import {
  createLinkColumn,
  createStringColumn,
} from '#components/Table/predefinedColumns';
import Table from '#components/Table';

import { Emergency } from '../index';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  data: Emergency[] | undefined;
}

function emergencyKeySelector(emergency: Emergency) {
  return emergency.id;
}

function EmergencyTable(props: Props) {
  const {
    className,
    data,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const columns = [
    createLinkColumn<Emergency, number>(
      'name',
      'Active Operations',
      (emergency) => emergency.name,
      (emergency) => ({
        to: `emergency/${emergency.id}`,
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
    <Container
      className={_cs(styles.emergencyTable, className)}
      heading={strings.searchIfrcEmergencies}
      contentClassName={styles.content}
      sub
    >
      <Table
        className={styles.inProgressDrefTable}
        data={data}
        columns={columns}
        keySelector={emergencyKeySelector}
        variant="small"
      />
    </Container>
  );
}

export default EmergencyTable;

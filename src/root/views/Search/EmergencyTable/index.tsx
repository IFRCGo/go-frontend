import React from 'react';
import { isDefined, _cs } from '@togglecorp/fujs';

import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import {
  createLinkColumn,
  createNumberColumn,
  createStringColumn,
} from '#components/Table/predefinedColumns';
import Table from '#components/Table';
import ProgressBar from '#components/ProgressBar';
import { round } from '#utils/format';

import styles from './styles.module.scss';

export interface EmergencyResult {
  id: number;
  disaster_type: string;
  funding_requirements: number;
  name: string;
  funding_coverage: number;
  event_date: string;
  score: number;
}

function emergencyKeySelector(emergency: EmergencyResult) {
  return emergency.id;
}

interface Props {
  className?: string;
  data: EmergencyResult[] | undefined;
  actions: React.ReactNode;
}

function EmergencyTable(props: Props) {
  const {
    className,
    data,
    actions,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const showProgressBar = (data: EmergencyResult) => {
    if (isDefined(data.funding_requirements) && data.funding_coverage > 0) {
      const percentage = (data.funding_coverage) / (data.funding_requirements) * 100;
      const percentageRound = round(percentage, 2);
      return (
        <ProgressBar
          label={`${percentageRound} %`}
          value={percentageRound}
        />
      );
    }
    return '-';
  };

  const columns = [
    createLinkColumn<EmergencyResult, number>(
      'name',
      'Active Operations',
      (emergency) => emergency.name,
      (emergency) => ({
        href: `/emergencies/${emergency.id}`,
        variant: 'table',
      })
    ),
    createStringColumn<EmergencyResult, number>(
      'disaster_type',
      'Disaster Type',
      (emergency) => emergency.disaster_type,
    ),
    createStringColumn<EmergencyResult, number>(
      'funding_requirements',
      'Funding Requirements',
      (emergency) => {
        if (emergency.funding_requirements > 0) {
          return `${emergency.funding_requirements} CHF`;
        }
        return '-';
      }
    ),
    createStringColumn<EmergencyResult, number>(
      'funding_coverage',
      'Funding Coverage',
      showProgressBar)
  ];

  if (!data) {
    return null;
  }

  return (
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
  );
}

export default EmergencyTable;

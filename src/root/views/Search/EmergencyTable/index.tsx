import React from 'react';
import { isDefined, _cs } from '@togglecorp/fujs';

import LanguageContext from '#root/languageContext';
import { round } from '#utils/format';

import Container from '#components/Container';
import {
  createLinkColumn,
  createStringColumn,
  createNumberColumn,
} from '#components/Table/predefinedColumns';
import Table from '#components/Table';
import ProgressBar from '#components/ProgressBar';

import styles from './styles.module.scss';

export interface EmergencyResult {
  id: number;
  disaster_type: string;
  funding_requirements: number;
  name: string;
  funding_coverage: number;
  start_date: string;
  event_date: string;
  score: number;
  countries: string;
  countries_id: string;
  iso: string;
  appeal_type: string;
  crisis_categorization: string;
}

function emergencyKeySelector(emergency: EmergencyResult) {
  return emergency.id;
}

interface Props {
  className?: string;
  data: EmergencyResult[] | undefined;
  actions: React.ReactNode;
  name?: string;
}

type CrisisType = 'Red' | 'Yellow' | 'Orange';
interface DotProps {
  crisisType: CrisisType;
}

const crisisTypeColorMap: Record<CrisisType, string> = {
  Red: '#f5333f',
  Orange: '#ff5014',
  Yellow: '#f39c12',
};

function Dot(props: DotProps) {
  const { crisisType } = props;

  const color = crisisTypeColorMap[crisisType];
  return (
    <span
      title={crisisType}
      className={styles.dotColor}
      style={{ backgroundColor: color }}
    />
  );
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
      if (percentageRound > 100) {
        return (
          <ProgressBar
            label="100%"
            value={100}
          />
        );
      }
      return (
        <ProgressBar
          label={`${percentageRound}%`}
          value={percentageRound}
        />
      );
    }
    return '-';
  };

  const columns = [
    createLinkColumn<EmergencyResult, number>(
      'name',
      'Title',
      (emergency) => emergency.name,
      (emergency) => ({
        href: `/emergencies/${emergency.id}`,
        variant: 'table',
      })
    ),
    createStringColumn<EmergencyResult, number>(
      'appeal_type',
      'Appeal Type',
      (emergency) => emergency.appeal_type,
    ),
    createNumberColumn<EmergencyResult, number>(
      'funding_requirements',
      'Funding Requirements',
      (emergency) => {
        if (+emergency.funding_requirements > 0) {
          return +emergency.funding_requirements;
        }
        return undefined;
      },
      undefined,
      {
        suffix: <span>&nbsp; CHF</span>,
        precision: 0,
      },
    ),
    createStringColumn<EmergencyResult, number>(
      'funding_coverage',
      'Funding Coverage',
      showProgressBar
    ),
    createStringColumn<EmergencyResult, number>(
      'crisis_categorization',
      'Crisis Categorization',
      (emergency) => {
        if (emergency.crisis_categorization) {
          return (
            <div className={styles.crisisType}>
              <Dot crisisType={emergency.crisis_categorization as CrisisType} />
            </div>
          );
        }
      },
    ),
  ];

  if (!data) {
    return null;
  }

  return (
    <Container
      className={_cs(styles.emergencyTable, className)}
      heading={strings.searchIfrcEmergencies}
      contentClassName={styles.content}
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

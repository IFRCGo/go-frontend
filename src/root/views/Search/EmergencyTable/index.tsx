import React from 'react';
import { Link } from 'react-router-dom';
import { isDefined, _cs } from '@togglecorp/fujs';

import LanguageContext from '#root/languageContext';
import { round } from '#utils/format';

import Container from '#components/Container';
import {
  createLinkColumn,
  createNumberColumn,
  createStringColumn,
} from '#components/Table/predefinedColumns';
import Table from '#components/Table';
import ProgressBar from '#components/ProgressBar';
import ReducedListDisplay from '#components/ReducedListDisplay';

import styles from './styles.module.scss';

export interface EmergencyResult {
  id: number;
  disaster_type: string;
  funding_requirements: number;
  name: string;
  funding_coverage: number;
  event_date: string;
  score: number;
  countries: string[];
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
  Yellow: '#ff9e00',
  Orange: '#ff6b00',
  Red: '#de2934',
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
      strings.searchEmergencyTableTitle,
      (emergency) => {
        if (emergency.name) {
          return (
            <div className={styles.crisisType}>
              <Dot crisisType={emergency.crisis_categorization as CrisisType} />
              {emergency.name}
            </div>
          );
        }
      },
      (emergency) => ({
        href: `/emergencies/${emergency.id}`,
        variant: 'table',
      })
    ),
    createStringColumn<EmergencyResult, number>(
      'appeal_type',
      strings.searchEmergencyTableAppealType,
      (emergency) => emergency.appeal_type,
    ),
    createStringColumn<EmergencyResult, number>(
      'disaster_type',
      strings.searchEmergencyTableDisasterType,
      (emergency) => emergency.disaster_type,
    ),
    createNumberColumn<EmergencyResult, number>(
      'funding_requirements',
      strings.searchEmergencyTableFundingRequirements,
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
      strings.searchEmergencyTableFundingCoverage,
      showProgressBar
    ),
    createStringColumn<EmergencyResult, number>(
      'countries',
      strings.searchEmergencyTableCountry,
      (emergency) => {
        if (emergency.countries.length > 1) {
          return (
            <ReducedListDisplay
              title={strings.searchEmergencyTableMultipleCountries}
              value={emergency.countries}
            />
          );
        }
        return (
          <Link
            to={`countries/${emergency.countries_id}`}
            className={styles.countryLink}
          >
            {emergency.countries[0]}
          </Link>
        );
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

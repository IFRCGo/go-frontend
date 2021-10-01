import React  from 'react';
import { RiDownloadLine } from 'react-icons/ri';
import { _cs } from '@togglecorp/fujs';

import Table from '#components/Table';
import Container from '#components/Container';
import Button from '#components/Button';
import SelectInput from '#components/SelectInput';
// import { Strings } from '#types';
import {
    createStringColumn,
    createNumberColumn,
} from '#components/Table/predefinedColumns';

import useInputState from '#hooks/useInputState';

import {
  hazardTypeOptions,
  HazardValueType,
  Writeable,
} from '../common';

import styles from './styles.module.scss';

interface RiskData {
  id: number,
  hazardTypeDisplay: string;
  informRiskScore?: number;
  peopleExposed?: number;
  peopleAtRiskOfDisplacement?: number;
}

const riskData: RiskData[] = [
  {
    id: 1,
    hazardTypeDisplay: 'Cyclone',
    informRiskScore: 5.5,
    peopleExposed: 15000,
    peopleAtRiskOfDisplacement: 200,
  },
  {
    id: 2,
    hazardTypeDisplay: 'Flood',
    informRiskScore: 3,
    peopleExposed: 570000,
    peopleAtRiskOfDisplacement: 5000,
  },
  {
    id: 3,
    hazardTypeDisplay: 'Food Insecurity',
    informRiskScore: undefined,
    peopleExposed: 15000,
    peopleAtRiskOfDisplacement: undefined,
  },
  {
    id: 4,
    hazardTypeDisplay: 'Drought',
    informRiskScore: 3,
    peopleExposed: 12000,
    peopleAtRiskOfDisplacement: 300,
  },
];

const getRiskTableColumns = () => ([
  createStringColumn<RiskData, string | number>(
    'hazardTypeDisplay',
    'Hazard Type',
    (item) => item.hazardTypeDisplay,
  ),
  createNumberColumn<RiskData, string | number>(
    'informRiskScore',
    'Inform Risk Score',
    (item) => item.informRiskScore,
  ),
  createNumberColumn<RiskData, string | number>(
    'peopleExposed',
    'People Exposed',
    (item) => item.peopleExposed,
  ),
  createNumberColumn<RiskData, string | number>(
    'peopleAtRiskOfDisplacement',
    'People at Risk of Displacement',
    (item) => item.peopleAtRiskOfDisplacement,
  ),
]);


function RiskTable() {
  const riskTableColumns = getRiskTableColumns();

  return (
    <Table
      className={styles.riskTable}
      data={riskData}
      columns={riskTableColumns}
      keySelector={d => d.id}
    />
  );
}

interface ReturnPeriodData {
  id: number;
  returnPeriodDisplay: string;
  numExposed?: number;
  numRiskOfDisplacement?: number;
  buildingDamageAmount?: number;
  educationImpactAmount?: number;
  healthImpactAmount?: number;
}

const returnPeriodData: ReturnPeriodData[] = [
  {
    id: 1,
    returnPeriodDisplay: '1-in-5-year event',
    numExposed: 10000,
    numRiskOfDisplacement: 10000,
    buildingDamageAmount: 15000000,
    educationImpactAmount: 100000,
    healthImpactAmount: 50000,
  },
  {
    id: 2,
    returnPeriodDisplay: '1-in-50-year event',
    numExposed: 100000,
    numRiskOfDisplacement: 100000,
    buildingDamageAmount: 30000000,
    educationImpactAmount: 4000000,
    healthImpactAmount: 2000000,
  },
];

const getReturnPeriodColumns = () => ([
  createStringColumn<ReturnPeriodData, string | number>(
    'frequency',
    'Return Period / Expected Frequency',
    (item) => item.returnPeriodDisplay,
  ),
  createNumberColumn<ReturnPeriodData, string | number>(
    'numExposed',
    'People Exposed / Affected',
    (item) => item.numExposed,
  ),
  createNumberColumn<ReturnPeriodData, string | number>(
    'numRiskOfDisplacement',
    'People at Risk of Displacement',
    (item) => item.numRiskOfDisplacement,
  ),
  createNumberColumn<ReturnPeriodData, string | number>(
    'buildingDamageAmount',
    'Building Damange (CHF)',
    (item) => item.buildingDamageAmount,
  ),
  createNumberColumn<ReturnPeriodData, string | number>(
    'educationImpactAmount',
    'Education Impact (CHF)',
    (item) => item.educationImpactAmount,
  ),
  createNumberColumn<ReturnPeriodData, string | number>(
    'healthImpactAmount',
    'Health Impact (CHF)',
    (item) => item.healthImpactAmount,
  ),
]);

function ReturnPeriodTable() {
  const returnPeriodColumns = getReturnPeriodColumns();
  const [hazardType, setHazardType] = useInputState<HazardValueType>('CY');

  return (
    <Container
      className={styles.returnPeriodTableContainer}
      heading="Expected Return Periods"
      descriptionClassName={styles.containerDescription}
      description={(
        <>
          <div className={styles.filters}>
            <SelectInput
              className={styles.filterInput}
              value={hazardType}
              onChange={setHazardType}
              name="hazardType"
              options={hazardTypeOptions as Writeable<typeof hazardTypeOptions>}
            />
          </div>
          <Button
            icons={<RiDownloadLine />}
            variant="secondary"
          >
            Export
          </Button>
        </>
      )}
      sub
    >
      <Table
        className={styles.returnPeriodTable}
        data={returnPeriodData}
        columns={returnPeriodColumns}
        keySelector={d => d.id}
      />
    </Container>
  );
}

export { RiskTable, ReturnPeriodTable };

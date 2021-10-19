import React from 'react';
import { RiDownloadLine } from 'react-icons/ri';

import Container from '#components/Container';
import Button from '#components/Button';
import Table from '#components/Table';
import SelectInput from '#components/SelectInput';
import useInputState from '#hooks/useInputState';

import {
  createStringColumn,
  createNumberColumn,
} from '#components/Table/predefinedColumns';

import {
  hazardTypeOptions,
  HazardValueType,
  Writeable,
} from '../common';

import styles from './styles.module.scss';

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

export default ReturnPeriodTable;

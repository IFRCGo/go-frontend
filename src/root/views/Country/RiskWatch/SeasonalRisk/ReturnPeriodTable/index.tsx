import React from 'react';
import { RiDownloadLine } from 'react-icons/ri';

import Container from '#components/Container';
import Button from '#components/Button';
import Table from '#components/Table';
import SelectInput from '#components/SelectInput';
import useInputState from '#hooks/useInputState';
import {
  HazardTypes,
  StringValueOption,
} from '#types';

import {
  createStringColumn,
  createNumberColumn,
} from '#components/Table/predefinedColumns';

import { ReturnPeriodData } from '../common';

import styles from './styles.module.scss';

interface TransformedReturnPeriodData {
  frequencyDisplay: string;
  displacement: number | null;
  exposure: number | null;
  economicLosses: number | null;
}

const getReturnPeriodColumns = () => ([
  createStringColumn<TransformedReturnPeriodData, string | number>(
    'frequency',
    'Return Period / Expected Frequency',
    (item) => item.frequencyDisplay,
  ),
  createNumberColumn<TransformedReturnPeriodData, string | number>(
    'numExposed',
    'People Exposed / Affected',
    (item) => item.exposure,
  ),
  createNumberColumn<TransformedReturnPeriodData, string | number>(
    'numRiskOfDisplacement',
    'People at Risk of Displacement',
    (item) => item.displacement,
  ),
  createNumberColumn<TransformedReturnPeriodData, string | number>(
    'economicLosses',
    'Economic Losses (USD)',
    (item) => item.economicLosses,
  ),
]);

interface Props {
  displacementData?: ReturnPeriodData[];
  economicLossData?: ReturnPeriodData[];
  hazardOptions: StringValueOption[];
}

function ReturnPeriodTable(props: Props) {
  const {
    displacementData,
    economicLossData,
    hazardOptions,
  } = props;

  const returnPeriodColumns = getReturnPeriodColumns();
  const [hazardType, setHazardType] = useInputState<HazardTypes>('FL');

  const transformedReturnPeriods: TransformedReturnPeriodData[] = React.useMemo(() => {
    const selectedHazardDisplacementData = displacementData?.filter(d => d.hazard_type === hazardType);
    const selectedHazardEconomicLossData = economicLossData?.filter(d => d.hazard_type === hazardType);

    const defaultNullValues = {
      displacement: null,
      exposure: null,
      economicLosses: null,
    };

    return [
      {
        ...defaultNullValues,
        frequencyDisplay: '1-in-20-year event',
        displacement: selectedHazardDisplacementData?.[0]?.return_period_20_years ?? null,
        economicLosses: selectedHazardEconomicLossData?.[0]?.return_period_20_years ?? null,
      },
      {
        ...defaultNullValues,
        frequencyDisplay: '1-in-50-year event',
        displacement: selectedHazardDisplacementData?.[0]?.return_period_50_years ?? null,
        economicLosses: selectedHazardEconomicLossData?.[0]?.return_period_50_years ?? null,
      },
      {
        ...defaultNullValues,
        frequencyDisplay: '1-in-100-year event',
        displacement: selectedHazardDisplacementData?.[0]?.return_period_100_years ?? null,
        economicLosses: selectedHazardEconomicLossData?.[0]?.return_period_100_years ?? null,
      },
      {
        ...defaultNullValues,
        frequencyDisplay: '1-in-250-year event',
        displacement: selectedHazardDisplacementData?.[0]?.return_period_250_years ?? null,
        economicLosses: selectedHazardEconomicLossData?.[0]?.return_period_100_years ?? null,
      },
      {
        ...defaultNullValues,
        frequencyDisplay: '1-in-500-year event',
        displacement: selectedHazardDisplacementData?.[0]?.return_period_500_years ?? null,
        economicLosses: selectedHazardEconomicLossData?.[0]?.return_period_100_years ?? null,
      },
    ];
  }, [economicLossData, displacementData, hazardType]);

  return (
    <Container
      visibleOverflow
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
              options={hazardOptions}
            />
          </div>
          <Button
            name={undefined}
            icons={<RiDownloadLine />}
            variant="secondary"
            disabled
          >
            Export
          </Button>
        </>
      )}
      sub
    >
      <Table
        className={styles.returnPeriodTable}
        data={transformedReturnPeriods}
        columns={returnPeriodColumns}
        keySelector={d => d.frequencyDisplay}
      />
    </Container>
  );
}

export default ReturnPeriodTable;

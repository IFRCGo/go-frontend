import React from 'react';

import Container from '#components/Container';
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
import InfoPopup from '#components/InfoPopup';

import {
  IDMCReturnPeriodData,
  GARReturnPeriodData,
} from '../common';

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
  /*
  createNumberColumn<TransformedReturnPeriodData, string | number>(
    'numExposed',
    <div className={styles.columnHeading}>
      People Exposed / Affected
      <InfoPopup
        title="People Exposed / Affected"
        description={(
          <>
            Based on hazard data from UNDRR &nbsp;
            <a
              className={styles.link}
              target="_blank"
              href="https://risk.preventionweb.net/"
            >
              GAR 2017
            </a>
            &nbsp; and population from the &nbsp;
            <a
              className={styles.link}
              target="_blank"
              href="https://ghsl.jrc.ec.europa.eu/index.php"
            >
              Global Human Settlement Layer
            </a>
          </>
        )}
      />
    </div>,
    (item) => item.exposure,
    undefined,
    {
      normal: true,
      precision: 'auto',
    },
  ),
  */
  createNumberColumn<TransformedReturnPeriodData, string | number>(
    'numRiskOfDisplacement',
    <div className={styles.columnHeading}>
      People at Risk of Displacement
      <InfoPopup
        title="People at Risk of Displacement"
        description={(
          <>
            Figures provided by IDMC from its &nbsp;
            <a
              className={styles.link}
              target="_blank"
              href="https://www.internal-displacement.org/database/global-displacement-risk-model"
            >
              Disaster Displacement Risk Model
            </a>
          </>
        )}
      />
    </div>,
    (item) => item.displacement,
    undefined,
    {
      normal: true,
      precision: 0,
    },
  ),
  createNumberColumn<TransformedReturnPeriodData, string | number>(
    'economicLosses',
    <div className={styles.columnHeading}>
      Economic Losses (USD)
      <InfoPopup
        title="Economic Lossed (USD)"
        description={(
          <>
          Figures provided by UNDRR from &nbsp;
            <a
              className={styles.link}
              target="_blank"
              href="https://www.preventionweb.net/english/hyogo/gar/2015/en/home/data.html"
            >
              GAR 2015
            </a>
          </>
        )}
      />
    </div>,
    (item) => item.economicLosses,
    undefined,
    {
      normal: true,
      precision: 0,
    },
  ),
]);

interface Props {
  displacementData?: IDMCReturnPeriodData[];
  economicLossAndExposureData?: GARReturnPeriodData[];
  hazardOptions: StringValueOption[];
}

function ReturnPeriodTable(props: Props) {
  const {
    displacementData,
    economicLossAndExposureData,
    hazardOptions,
  } = props;

  const returnPeriodColumns = getReturnPeriodColumns();
  const [hazardType, setHazardType] = useInputState<HazardTypes>('FL');

  const transformedReturnPeriods: TransformedReturnPeriodData[] = React.useMemo(() => {
    const selectedHazardDisplacementData = displacementData?.filter(d => d.hazard_type === hazardType);
    const selectedHazardEconomicLossData = economicLossAndExposureData?.filter(d => d.hazard_type === hazardType);

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
        economicLosses: selectedHazardEconomicLossData?.[0]?.economic_loss_return_period_20_years ?? null,
        exposure: selectedHazardEconomicLossData?.[0]?.population_exposure_return_period_25_years ?? null,
      },
      {
        ...defaultNullValues,
        frequencyDisplay: '1-in-50-year event',
        displacement: selectedHazardDisplacementData?.[0]?.return_period_50_years ?? null,
        economicLosses: selectedHazardEconomicLossData?.[0]?.economic_loss_return_period_50_years ?? null,
        exposure: selectedHazardEconomicLossData?.[0]?.population_exposure_return_period_50_years ?? null,
      },
      {
        ...defaultNullValues,
        frequencyDisplay: '1-in-100-year event',
        displacement: selectedHazardDisplacementData?.[0]?.return_period_100_years ?? null,
        economicLosses: selectedHazardEconomicLossData?.[0]?.economic_loss_return_period_100_years ?? null,
        exposure: selectedHazardEconomicLossData?.[0]?.population_exposure_return_period_100_years ?? null,
      },
      {
        ...defaultNullValues,
        frequencyDisplay: '1-in-250-year event',
        displacement: selectedHazardDisplacementData?.[0]?.return_period_250_years ?? null,
        economicLosses: selectedHazardEconomicLossData?.[0]?.economic_loss_return_period_250_years ?? null,
        exposure: selectedHazardEconomicLossData?.[0]?.population_exposure_return_period_200_years ?? null,
      },
      {
        ...defaultNullValues,
        frequencyDisplay: '1-in-500-year event',
        displacement: selectedHazardDisplacementData?.[0]?.return_period_500_years ?? null,
        economicLosses: selectedHazardEconomicLossData?.[0]?.economic_loss_return_period_500_years ?? null,
        exposure: selectedHazardEconomicLossData?.[0]?.population_exposure_return_period_500_years ?? null,
      },
    ];
  }, [economicLossAndExposureData, displacementData, hazardType]);

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

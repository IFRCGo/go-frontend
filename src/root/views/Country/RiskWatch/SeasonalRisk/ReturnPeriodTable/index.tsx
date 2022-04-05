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
        title="Economic Losses (USD)"
        description={(
          <>
            <div>
              Figures taken from
            </div>
            <a
              className={styles.link}
              target="_blank"
              href="https://www.gfdrr.org/en/disaster-risk-country-profiles"
            >
              World Bank Disaster Risk Country Profiles
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
  data?: ReturnPeriodData[]
  hazardOptions: StringValueOption[];
}

function ReturnPeriodTable(props: Props) {
  const {
    data,
    hazardOptions,
  } = props;

  const returnPeriodColumns = getReturnPeriodColumns();
  const [hazardType, setHazardType] = useInputState<HazardTypes>('FL');

  const transformedReturnPeriods: TransformedReturnPeriodData[] = React.useMemo(() => {
    const selectedHazardData = data?.filter(d => d.hazard_type === hazardType);

    return [
      {
        frequencyDisplay: '1-in-20-year event',
        displacement: selectedHazardData?.[0]?.twenty_years?.population_displacement ?? null,
        economicLosses: selectedHazardData?.[0]?.twenty_years?.economic_loss ?? null,
        exposure: selectedHazardData?.[0]?.twenty_years?.economic_loss ?? null,
      },
      {
        frequencyDisplay: '1-in-50-year event',
        displacement: selectedHazardData?.[0]?.fifty_years?.population_displacement ?? null,
        economicLosses: selectedHazardData?.[0]?.fifty_years?.economic_loss ?? null,
        exposure: selectedHazardData?.[0]?.fifty_years?.population_exposure ?? null,
      },
      {
        frequencyDisplay: '1-in-100-year event',
        displacement: selectedHazardData?.[0]?.hundred_years?.population_displacement ?? null,
        economicLosses: selectedHazardData?.[0]?.hundred_years?.economic_loss ?? null,
        exposure: selectedHazardData?.[0]?.hundred_years?.population_exposure ?? null,
      },
      {
        frequencyDisplay: '1-in-250-year event',
        displacement: selectedHazardData?.[0]?.two_hundred_fifty_years?.population_displacement ?? null,
        economicLosses: selectedHazardData?.[0]?.two_hundred_fifty_years?.economic_loss ?? null,
        exposure: selectedHazardData?.[0]?.two_hundred_fifty_years?.population_exposure ?? null,
      },
      {
        frequencyDisplay: '1-in-500-year event',
        displacement: selectedHazardData?.[0]?.five_hundred_years?.population_displacement ?? null,
        economicLosses: selectedHazardData?.[0]?.five_hundred_years?.economic_loss ?? null,
        exposure: selectedHazardData?.[0]?.five_hundred_years?.population_exposure ?? null,
      },
    ];
  }, [data, hazardType]);

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

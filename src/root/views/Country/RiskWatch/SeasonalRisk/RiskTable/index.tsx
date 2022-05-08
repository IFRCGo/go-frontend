import React  from 'react';
import { _cs } from '@togglecorp/fujs';

import InfoPopup from '#components/InfoPopup';
import Table from '#components/Table';
import {
    createStringColumn,
    createNumberColumn,
} from '#components/Table/predefinedColumns';
import { avgSafe } from '#utils/common';

import { RiskData } from '../common';

import styles from './styles.module.scss';

function getAverageForSelectedMonths(data: undefined | (number | null)[], selectedMonths: Record<number, boolean>) {
  const dataWithSelectedMonths = data?.filter((_, i) => selectedMonths[i]);
  return avgSafe(dataWithSelectedMonths ?? []);
}

interface Props {
  className?: string;
  riskData: RiskData[];
  selectedMonths: Record<number, boolean>;
}

function RiskTable(props: Props) {
  const {
    className,
    riskData,
    selectedMonths,
  } = props;

  const riskTableColumns = React.useMemo(() => {
    const hazardTypeColumn = createStringColumn<RiskData, string | number>(
      'hazardTypeDisplay',
      'Hazard Type',
      (item) => item.hazardTypeDisplay,
    );

    return ([
      hazardTypeColumn,
      createNumberColumn<RiskData, string | number>(
        'informRiskScore',
        <div className={styles.columnHeading}>
          Inform Risk Score
          <InfoPopup
            title="Inform Risk Score"
            description={(
              <>
                <p>
                  These figures depict INFORM seasonal hazard exposure values for each country for each month on a five-point scale:
                </p>
                <p>
                  1: Very Low | 2: Low | 3: Medium | 4: High | 5: Very High.
                </p>
                More information on these values can be found <a className={styles.link} target="_blank" href="https://drmkc.jrc.ec.europa.eu/inform-index/INFORM-Covid-19/INFORM-Covid-19-Warning-beta-version">here.</a>
              </>
            )}
          />
        </div>,
        (item) => getAverageForSelectedMonths(item.informRiskScore?.monthly, selectedMonths),
        undefined,
        {
          normal: true,
          precision: 1,
        },
      ),
      createNumberColumn<RiskData, string | number>(
        'peopleExposed',
        <div className={styles.columnHeading}>
          People Exposed
          <InfoPopup
            title="People Exposed"
            description="These figures represent the number of people exposed to each hazard per month, on average. The population exposure figures are from the 2015 UNDRR Global Risk Model, based on average annual exposure to each hazard. The average annual exposure estimates were disaggregated by month based on recorded impacts of observed hazard events."
          />
        </div>,
        (item) => getAverageForSelectedMonths(item.exposure?.monthly, selectedMonths),
        undefined,
        {
          normal: true,
          precision: 0,
        },
      ),
      createNumberColumn<RiskData, string | number>(
        'peopleAtRiskOfDisplacement',
        <div className={styles.columnHeading}>
          People at Risk of Displacement
          <InfoPopup
            title="People at Risk of Displacement"
            description="These figures represent the number of people expected to be displaced per month, on average, by each hazard. The estimates are based on the Internal Displacement Monitoring Centre's disaster displacement risk model using estimates for average annual displacement risk. These values were disaggregated by month based on historical displacement data associated with each hazard."
          />
        </div>,
        (item) => getAverageForSelectedMonths(item.displacement?.monthly, selectedMonths),
        undefined,
        {
          normal: true,
          precision: 0,
        },
      ),
    ]);
  }, [selectedMonths]);

  return (
    <Table
      className={_cs(styles.riskTable, className)}
      data={riskData}
      columns={riskTableColumns}
      keySelector={d => d.hazardType}
    />
  );
}

export default RiskTable;

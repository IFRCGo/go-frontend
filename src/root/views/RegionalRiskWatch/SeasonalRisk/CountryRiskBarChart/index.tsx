import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Heading from '#components/Heading';
import {
  COLOR_FLOOD,
  COLOR_CYCLONE,
  COLOR_DROUGHT,
  COLOR_FOOD_INSECURITY,
  COLOR_EARTHQUAKE,
} from '#utils/risk';
import { HazardType } from '../common';
import styles from './styles.module.scss';

const hazardTypeColorMap: Record<HazardType, string> = {
  FL: COLOR_FLOOD,
  TC: COLOR_CYCLONE,
  DR: COLOR_DROUGHT,
  FI: COLOR_FOOD_INSECURITY,
  EQ: COLOR_EARTHQUAKE,
};

const hazardDisplayOrder: Record<HazardType, number> = {
  FL: 1,
  TC: 2,
  DR: 3,
  FI: 4,
  EQ: 5,
};

interface Props {
  className?: string;
  riskData: {
    iso3: string;
    byHazard: {
      hazard_type: HazardType;
      hazard_type_display: string;
      value: number;
    }[];
    value: number;
    countryName: string;
  }[];
}

function CountryRiskBarChart(props: Props) {
  const {
    className,
    riskData,
  } = props;

  const sortedData = riskData.sort((a, b) => b.value - a.value);

  const maxValue = Math.max(...riskData.map((rd) => rd.value));
  const maxValueSafe = maxValue <= 0 ? 1 : maxValue;

  return (
    <div className={_cs(styles.countryRiskBarChart, className)}>
      <Heading
        size="small"
        className={styles.heading}
      >
        Countries by Risk
      </Heading>
      <div className={styles.content}>
        {sortedData.length === 0 && (
          <div className={styles.emptyMessage}>
            No countries selected
          </div>
        )}
        {sortedData.map((rd) => (
          <div key={rd.iso3}>
            <div className={styles.countryName}>
              {rd.countryName}
            </div>
            <div className={styles.barContainer}>
              {rd.byHazard.sort(
                (a, b) => hazardDisplayOrder[a.hazard_type] - hazardDisplayOrder[b.hazard_type],
              ).map(
                (hrd) => {
                  const width = 100 * hrd.value / maxValueSafe;

                  return (
                    <div
                      title={`${hrd.hazard_type_display}: ${hrd.value}`}
                      className={styles.hazardRiskBar}
                      key={hrd.hazard_type}
                      style={{
                        width: `${width}%`,
                        backgroundColor: hazardTypeColorMap[hrd.hazard_type],
                      }}
                    />
                  );
                }
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CountryRiskBarChart;

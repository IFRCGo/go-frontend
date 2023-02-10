import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Heading from '#components/Heading';
import { HazardType, hazardTypeColorMap } from '../common';
import styles from './styles.module.scss';

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
        <div>COUNTRIES BY RISK</div>
        <div className={styles.riskStatus}>
          <div>Low</div>
          <div>High</div>
        </div>

      </Heading>
      <div className={styles.content}>
        {sortedData.length === 0 && (
          <div className={styles.emptyMessage}>
            No countries selected
          </div>
        )}
        {sortedData.map((rd) => (
          <div key={rd.iso3} className={styles.countryCard}>
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
                      <React.Fragment key={hrd.hazard_type}>
                        <div
                          // data-tip
                          // data-for={hrd.hazard_type}
                          // Note: Tooltip is added for hover title
                          title={`${hrd.hazard_type_display}: ${hrd.value}`}
                          className={styles.hazardRiskBar}
                          key={hrd.hazard_type}
                          style={{
                            width: `${width}%`,
                            backgroundColor: hazardTypeColorMap[hrd.hazard_type],
                          }}
                        />
                        { /* Note:  Inprogress so hide for now
                          <ReactTooltip
                            id={hrd.hazard_type}
                            className={styles.tooltip}
                            place="top"
                            type="light"
                            effect="solid"
                            aria-haspopup='true'
                            border={false}
                          >
                            <div className={styles.tooltipHazardTitle}>{hrd.hazard_type_display}</div>
                            <div className={styles.subTitle}>Risk</div>
                          </ReactTooltip>
                        */ }
                      </React.Fragment>
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

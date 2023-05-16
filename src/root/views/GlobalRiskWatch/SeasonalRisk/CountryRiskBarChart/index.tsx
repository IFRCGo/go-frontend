import React from 'react';
import { Tooltip as ReactTooltip} from 'react-tooltip';
import { _cs } from '@togglecorp/fujs';

import Container from '#components/Container';
import { hazardTypeColorMap } from '../common';
import { SeasonalHazardTypes } from '#types';

import styles from './styles.module.scss';

const hazardDisplayOrder: Record<SeasonalHazardTypes, number> = {
  FL: 1,
  TC: 2,
  DR: 3,
  FI: 4,
  EQ: 5,
};

function getHazardStatus(hazardValue: number) {
  if(hazardValue > 0 && hazardValue < 25) {
    return 'Risk: very low';
  }

  if(hazardValue > 25 && hazardValue < 50) {
    return 'Risk: medium';
  }

  if(hazardValue >= 50 && hazardValue < 75) {
    return 'Risk: high';
  }

  if(hazardValue >= 75) {
    return 'Risk: very high';
  }
}

interface Props {
  className?: string;
  riskData: {
    iso3: string;
    byHazard: {
      hazard_type: SeasonalHazardTypes;
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
    <Container
      sub
      className={_cs(styles.countryRiskBarChart, className)}
      heading="Countries by Risk"
      headingSize="superSmall"
      contentClassName={styles.content}
    >
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
                    <React.Fragment
                      key={hrd.hazard_type}
                    >
                      <div
                        data-tooltip-id={`${rd.iso3}-${hrd.hazard_type}`}
                        data-for={hrd.hazard_type}
                        className={styles.hazardRiskBar}
                        style={{
                          width: `${width}%`,
                          backgroundColor: hazardTypeColorMap[hrd.hazard_type],
                        }}
                      />
                      <ReactTooltip
                        id={`${rd.iso3}-${hrd.hazard_type}`}
                        className={styles.tooltip}
                        classNameArrow={styles.arrow}
                        place="top"
                        variant='light'
                      >
                        <div className={styles.tooltipContent}>
                          <div className={styles.tooltipHazardTitle}>
                            {hrd.hazard_type_display}
                          </div>
                          <div className={styles.subTitle}>
                            {getHazardStatus(hrd.value)}
                          </div>
                        </div>
                      </ReactTooltip>
                    </React.Fragment>
                  );
                }
              )}
          </div>
        </div>
      ))}
    </Container>
  );
}

export default CountryRiskBarChart;

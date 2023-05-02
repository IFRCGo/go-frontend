import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { _cs } from '@togglecorp/fujs';

import Container from '#components/Container';
import { HazardType, hazardTypeColorMap } from '../common';
import { Tooltip as ReactTooltip} from 'react-tooltip';
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

  const getHazardStatus =(hazardValue: number)=>{
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
  };

  const tooltip = React.useCallback(
    (hazard) => (
      <div className={styles.tooltipContent}>
        <div className={styles.tooltipHazardTitle}>{hazard.hazard_type_display}</div>
        <div className={styles.subTitle}>{getHazardStatus(hazard.value)}</div>
      </div>
    ),
    []);
  return (
    <Container
      className={_cs(styles.countryRiskBarChart, className)}
      heading="Countries by Risk"
      headingSize="superSmall"
      contentClassName={styles.content}
      sub
      compact
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
                    <React.Fragment key={hrd.hazard_type}>
                      <div
                        data-tooltip-id={hrd.hazard_type}
                        data-for={hrd.hazard_type}
                        className={styles.hazardRiskBar}
                        style={{
                          width: `${width}%`,
                          backgroundColor: hazardTypeColorMap[hrd.hazard_type],
                        }}
                        data-tooltip-html={ReactDOMServer.renderToStaticMarkup(tooltip(hrd))}
                      />
                      <ReactTooltip
                        id={hrd.hazard_type}
                        className={styles.tooltip}
                        classNameArrow={styles.arrow}
                        place="top"
                        variant='light'
                      />
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

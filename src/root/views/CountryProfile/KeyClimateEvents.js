import React from 'react';
import Translate from '#components/Translate';
import _cs from 'classnames';

import styles from './styles.module.scss';

function KeyEventOutput ({
  className,
  label,
  value,
}) {
  return (
    <div className={_cs(className, styles.keyEventOutput)}>
      <div className={styles.label}>
        { label }
      </div>
      <div className={styles.value}>
        { value || '-' }
      </div>
    </div>
  );
}

function KeyClimateEvents(p) {
  const {
      averageTemperature,
      averageRainfallPrecipitation,
      rainySeasonStatus,
  } = p;

  return (
    <div className={styles.keyClimateEvents}>
      <h3 className={styles.heading}>
        <Translate stringId='climateChartKeyClimateHeading' />
      </h3>
      <div className={styles.content}>
        <KeyEventOutput
          label='Avg. rainfall precipitation'
          value={averageRainfallPrecipitation}
        />
        <KeyEventOutput
          label='Avg. temperature'
          value={averageTemperature}
        />
        <KeyEventOutput
          label='Rainy season'
          value={rainySeasonStatus}
        />
      </div>
    </div>
  );
}

export default KeyClimateEvents;

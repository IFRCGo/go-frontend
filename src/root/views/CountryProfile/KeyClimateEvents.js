import React from 'react';
import Translate from '#components/Translate';
import _cs from 'classnames';

import Card from './Card';
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
    className,
  } = p;

  return (
    <Card
      className={_cs(className, styles.keyClimateEvents)}
      heading={<Translate stringId='climateChartKeyClimateHeading' />}
      contentClassName={styles.content}
    >
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
    </Card>
  );
}

export default KeyClimateEvents;

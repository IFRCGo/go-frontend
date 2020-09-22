import React from 'react';
import _cs from 'classnames';

import FormattedNumber from '#components/formatted-number';
import styles from './styles.module.scss';

const IndicatorOutput = ({
  className,
  label,
  value,
  addSeparatorToValue,
  normalizeValue,
  fixedTo,
}) => (
  <div className={_cs(styles.keyIndicatorTextOutput, className)}>
    <div className={styles.label}>
      {label}
    </div>
    <div className={styles.value}>
      <FormattedNumber
        value={value}
        addSeparator={addSeparatorToValue}
        fixedTo={fixedTo}
        normalize={normalizeValue}
      />
    </div>
  </div>
);

export default IndicatorOutput;

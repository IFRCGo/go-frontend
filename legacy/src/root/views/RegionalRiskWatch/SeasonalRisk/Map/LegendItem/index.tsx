import React from 'react';

import styles from './styles.module.scss';

interface Props {
  color: string;
  label: string;
}

function LegendItem(props: Props) {
  const {
    color,
    label,
  } = props;

  return (
    <div className={styles.legendItem}>
      <div
        className={styles.symbol}
        style={{ backgroundColor: color }}
      />
      <div className={styles.label}>
        { label }
      </div>
    </div>
  );
}

export default LegendItem;

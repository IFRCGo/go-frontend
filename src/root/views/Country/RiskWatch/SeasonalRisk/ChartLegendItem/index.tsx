import React from 'react';
import {
  _cs,
  isDefined,
} from '@togglecorp/fujs';
import NumberOutput from '#components/NumberOutput';
import styles from './styles.module.scss';

interface Props {
  icon: string;
  label: React.ReactNode;
  value?: number;
  color: string;
  isActive?: boolean,
}

function ChartLegendItem(props: Props) {
  const {
    icon,
    label,
    value,
    color,
    isActive,
  } = props;

  return (
    <div className={_cs(styles.chartLegendItem, isActive && styles.active)}>
      <div
        className={styles.iconContainer}
        style={{ backgroundColor: color }}
      >
        <img
          className={styles.icon}
          src={icon}
        />
      </div>
      <div className={styles.label}>
        {label}
      </div>
      {isDefined(value) && (
        <NumberOutput value={value} normal />
      )}
    </div>
  );
}

export default ChartLegendItem;

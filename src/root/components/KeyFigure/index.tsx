import React from 'react';
import { _cs } from '@togglecorp/fujs';

import NumberOutput from '#components/NumberOutput';
import styles from './styles.module.scss';

interface Props {
  className?: string;
  value?: number;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  source?: React.ReactNode;
}

function KeyFigure(props: Props) {
  const {
    className,
    value,
    description,
    icon,
  } = props;

  return (
    <div className={_cs(styles.keyFigure, className)}>
      {icon && (
        <div className={styles.icon}>
          {icon}
        </div>
      )}
      <NumberOutput
        className={styles.value}
        value={value}
        precision="auto"
        normal
      />
      {description && (
        <div className={styles.description}>
          {description}
        </div>
      )}
    </div>
  );
}

export default KeyFigure;

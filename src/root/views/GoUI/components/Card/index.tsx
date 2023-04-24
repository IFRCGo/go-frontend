import React from 'react';
import { _cs } from '@togglecorp/fujs';

import FormattedNumber from '../FormattedNumber';
import ProgressBar from '../ProgressBar';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  contentClassName?: string;
  value: number;
  normalize?: boolean;
  addSeparator?: boolean;
  fixedTo?: number;
  description?: string;
  progressValue?: number;
  progressTotalValue?: number;
}
function Card(props: Props) {
  const {
    className,
    children,
    contentClassName,
    value,
    normalize,
    addSeparator,
    fixedTo,
    description,
    progressValue,
    progressTotalValue = 100,
  } = props;
  return (
    <div
      className={_cs(
        styles.card,
        className,
      )}
    >
      <FormattedNumber
        value={value}
        normalize={normalize}
        addSeparator={addSeparator}
        fixedTo={fixedTo}
      />
      {progressValue && (
        <ProgressBar
          value={progressValue}
          totalValue={progressTotalValue}
        />
      )}
      <div className={styles.description}>
        {description}
      </div>
      <div className={_cs(styles.content, contentClassName)}>
        {children}
      </div>
    </div>
  );
}

export default Card;
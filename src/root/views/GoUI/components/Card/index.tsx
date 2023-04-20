import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';
import FormattedNumber from '../FormattedNumber';

interface Props {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  contentClassName?: string;
  value: number;
  normalize?: boolean;
  addSeparator?: boolean;
  fixedTo?: number;
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
      <div className={_cs(styles.content, contentClassName)}>
        {children}
      </div>
    </div>
  );
}

export default Card;
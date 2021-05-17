import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

export interface Props {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

function InputLabel(props: Props) {
  const {
    children,
    className,
    disabled,
  } = props;

  if (!children) {
    return null;
  }

  return (
    <div
      className={_cs(
        'go-input-label',
        styles.inputLabel,
        disabled && styles.disabled,
        className,
      )}
    >
      { children }
    </div>
  );
}

export default InputLabel;

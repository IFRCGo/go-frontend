import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

function InputLabel(props) {
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

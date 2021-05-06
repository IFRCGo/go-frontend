import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

function InputError(props) {
  const {
    children,
    className,
  } = props;

  if (!children) {
    return null;
  }

  return (
    <div
      className={_cs(
        'go-input-error',
        styles.inputError,
        className,
      )}
    >
      { children }
    </div>
  );
}

export default InputError;

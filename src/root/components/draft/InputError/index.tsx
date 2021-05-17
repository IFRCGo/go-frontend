import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

export interface Props {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

function InputError(props: Props) {
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
        'go-input-error',
        styles.inputError,
        disabled && styles.disabled,
        className,
      )}
    >
      { children }
    </div>
  );
}

export default InputError;

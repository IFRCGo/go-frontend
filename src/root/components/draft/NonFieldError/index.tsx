import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

export interface Props {
  className?: string;
  error?: {
    $internal?: string | string[];
  };
  message?: React.ReactNode;
}

function NonFieldError(props: Props) {
  const {
    className,
    error,
    message,
  } = props;

  if (!error) {
    return null;
  }

  if (!(error?.$internal) && !message) {
    return null;
  }

  let stringError: string | undefined;
  if (Array.isArray(error.$internal)) {
    stringError = error.$internal.join(', ');
  } else {
    stringError = error.$internal;
  }

  return (
    <div className={_cs(
        'go-non-field-error',
        styles.nonFieldError,
        className,
      )}
    >
      {stringError}
      {error && !stringError && message}
    </div>
  );
}

export default NonFieldError;

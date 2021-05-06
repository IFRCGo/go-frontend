import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

function NonFieldError(props) {
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

  return (
    <div className={_cs(
        'go-non-field-error',
        styles.nonFieldError,
        className,
      )}
    >
      {error?.$internal}
      {error && !error.$internal && message}
    </div>
  );
}

export default NonFieldError;

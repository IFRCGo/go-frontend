import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
  getErrorObject,
  analyzeErrors,
  internal,
  Error,
} from '@togglecorp/toggle-form';

import styles from './styles.module.scss';

export interface Props<T> {
  className?: string;
  error?: Error<T>;
  message?: React.ReactNode;
}

function NonFieldError<T>(props: Props<T>) {
  const {
    className,
    error,
    message,
  } = props;

  const errorObject = React.useMemo(() => getErrorObject(error), [error]);

  if (!errorObject) {
    return null;
  }

  const hasError = analyzeErrors(errorObject);
  if (!hasError) {
    return null;
  }

  const stringError = errorObject?.[internal] ?? message;
  if (!stringError) {
    return null;
  }

  return (
    <div className={_cs(
        'go-non-field-error',
        styles.nonFieldError,
        className,
      )}
    >
      {stringError}
    </div>
  );
}

export default NonFieldError;

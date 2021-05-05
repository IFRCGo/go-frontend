import React from 'react';

function NonFieldError(props) {
  const {
    className,
    error,
  } = props;

  if (!error?.$internal) {
    return null;
  }

  return (
    <div className={_cs(
        'go-non-field-error',
        styles.nonFieldError,
        className,
      )}
    >
      {error.$internal}
    </div>
  );
}

export default NonFieldError;

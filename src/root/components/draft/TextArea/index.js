import React from 'react';
// import { _cs } from '@togglecorp/fujs';

import InputContainer from '#components/draft/InputContainer';
import RawTextArea from '#components/draft/RawTextArea';

// import styles from './styles.module.scss';

function TextArea(props) {
  const {
    className,
    actions,
    icons,
    error,
    label,
    disabled,
    readOnly,
    inputClassName,
    ...otherInputProps
  } = props;

  return (
    <InputContainer
      className={className}
      actions={actions}
      icons={icons}
      error={error}
      label={label}
      disabled={disabled}
      input={(
        <RawTextArea
          rows="5"
          {...otherInputProps}
          readOnly={readOnly}
          disabled={disabled}
          className={inputClassName}
        />
      )}
    />
  );
}

export default TextArea;

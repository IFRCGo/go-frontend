import React from 'react';
// import { _cs } from '@togglecorp/fujs';

import InputContainer from '#components/draft/InputContainer';
import RawInput from '#components/draft/RawInput';

// import styles from './styles.module.scss';

function TextInput(props) {
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
        <RawInput
          {...otherInputProps}
          readOnly={readOnly}
          disabled={disabled}
          className={inputClassName}
          type="text"
        />
      )}
    />
  );
}

export default TextInput;
import React from 'react';

import InputContainer, { Props as InputContainerProps } from '../InputContainer';
import RawInput, { Props as RawInputProps } from '../RawInput';

type InheritedProps<T> = (Omit<InputContainerProps, 'input'> & RawInputProps<T>);
export interface Props<T extends string | undefined> extends InheritedProps<T> {
  inputElementRef?: React.RefObject<HTMLInputElement>;
  inputClassName?: string;
}

function TextInput<T extends string | undefined>(props: Props<T>) {
  const {
    className,
    actions,
    icons,
    error,
    hint,
    label,
    disabled,
    readOnly,
    errorOnTooltip,
    inputClassName,
    type = 'text',
    variant,
    ...otherInputProps
  } = props;

  return (
    <InputContainer
      className={className}
      actions={actions}
      icons={icons}
      hint={hint}
      error={error}
      label={label}
      disabled={disabled}
      errorOnTooltip={errorOnTooltip}
      variant={variant}
      input={(
        <RawInput
          {...otherInputProps}
          readOnly={readOnly}
          disabled={disabled}
          className={inputClassName}
          type={type}
        />
      )}
    />
  );
}

export default TextInput;

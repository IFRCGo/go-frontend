import React from 'react';

import InputContainer, { Props as InputContainerProps } from '#goui/components/InputContainer';
import RawInput, { Props as RawInputProps } from '#goui/components/RawInput';

type InheritedProps<T> = (Omit<InputContainerProps, 'input'> & RawInputProps<T>);
export interface Props<T extends string | undefined> extends InheritedProps<T> {
    inputElementRef?: React.RefObject<HTMLInputElement>;
    inputClassName?: string;
}

function DateInput<T extends string | undefined>(props: Props<T>) {
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
    ...otherInputProps
  } = props;

  return (
    <InputContainer
      className={className}
      actions={actions}
      icons={icons}
      error={error}
      label={label}
      hint={hint}
      disabled={disabled}
      errorOnTooltip={errorOnTooltip}
      input={(
        <RawInput
          {...otherInputProps}
          readOnly={readOnly}
          disabled={disabled}
          className={inputClassName}
          type="date"
        />
      )}
    />
  );
}

export default DateInput;

import React from 'react';
import InputContainer, { Props as InputContainerProps } from '#goui/components/InputContainer';
import RawInput, { Props as RawInputProps } from '#goui/components/RawInput';

type InheritedProps<T> = (Omit<InputContainerProps, 'input'> & Omit<RawInputProps<T>, 'type'>);
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
    variant,
    required,
    withAsterisk,
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
      required={required}
      withAsterisk={withAsterisk}
      input={(
        <RawInput
          {...otherInputProps}
          required={required}
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

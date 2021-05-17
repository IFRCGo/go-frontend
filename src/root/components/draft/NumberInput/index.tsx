import React from 'react';
import { isDefined } from '@togglecorp/fujs';

import InputContainer, { Props as InputContainerProps } from '#components/draft/InputContainer';
import RawInput, { Props as RawInputProps } from '#components/draft/RawInput';

type InheritedProps<T> = (Omit<InputContainerProps, 'input'> & Omit<RawInputProps<T>, 'onChange' | 'value'>);
export interface Props<T extends string | undefined> extends InheritedProps<T> {
    inputElementRef?: React.RefObject<HTMLInputElement>;
    inputClassName?: string;
    value: number | undefined | null;
    onChange?: (
      value: number | undefined,
      name: T,
      e?: React.FormEvent<HTMLInputElement> | undefined,
    ) => void;
}

function NumberInput<T extends string | undefined>(props: Props<T>) {
  const {
    className,
    actions,
    icons,
    error,
    label,
    disabled,
    readOnly,
    inputClassName,
    value: valueFromProps,
    onChange,
    ...otherInputProps
  } = props;

  const handleChange: RawInputProps<T>['onChange'] = React.useCallback((v, n, e) => {
    if (!onChange) {
      return;
    }

    if (isDefined(v)) {
      onChange(parseFloat(v), n, e);
    } else {
      onChange(undefined, n, e);
    }
  }, [onChange]);

  const value = isDefined(valueFromProps) ? String(valueFromProps) : '';

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
          value={value}
          onChange={handleChange}
          type="number"
        />
      )}
    />
  );
}

export default NumberInput;

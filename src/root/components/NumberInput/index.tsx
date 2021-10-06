import React from 'react';
import { isDefined } from '@togglecorp/fujs';

import InputContainer, { Props as InputContainerProps } from '#components/InputContainer';
import RawInput, { Props as RawInputProps } from '#components/RawInput';
import useInputState from '#hooks/useInputState';

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

  const [tempValue, setTempValue] = React.useState<string | undefined>(String(valueFromProps ?? ''));

  React.useEffect(() => {
    setTempValue(String(valueFromProps ?? ''));
  }, [valueFromProps]);

  const handleChange: RawInputProps<T>['onChange'] = React.useCallback((v, n, e) => {
    setTempValue(v);

    if (!onChange) {
      return;
    }

    if (isDefined(v)) {
      const floatValue = +v;
      if (!Number.isNaN(floatValue)) {
        onChange(floatValue, n, e);
      }
    } else {
      onChange(undefined, n, e);
    }
  }, [onChange]);

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
          value={tempValue}
          onChange={handleChange}
          type="number"
        />
      )}
    />
  );
}

export default NumberInput;

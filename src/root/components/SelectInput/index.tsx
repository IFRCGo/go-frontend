import React from 'react';
import {
   _cs,
  isDefined,
} from '@togglecorp/fujs';
import Select, { Props as SelectProps } from 'react-select';

import InputContainer from '#components/InputContainer';

import styles from './styles.module.scss';

type ValueType = string | number;

interface Option {
  value: ValueType;
  label: string;
}

const emptyOptionList: Option[] = [];

interface BaseProps {
  className?: string;
  actions?: React.ReactNode;
  icons?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode,
  label?: React.ReactNode,
  disabled?: boolean;
  pending?: boolean;
  readOnly?: boolean;
  options?: Option[];
  placeholder?: string;
  isOptionDisabled?: SelectProps<Option>['isOptionDisabled'];
  isClearable?: boolean;
}

type Props<N, V extends ValueType> = BaseProps & ({
  isMulti?: false;
  name: N;
  onChange: (newValue: V, name: N) => void;
  value: V | undefined | null;
} | {
  isMulti: true;
  name: N;
  onChange: (newValue: V[], name: N) => void;
  value: V[] | undefined | null;
})

function SelectInput<N, V extends ValueType>(props: Props<N, V>) {
  const {
    className,
    actions,
    icons,
    error,
    hint,
    label,
    disabled,
    pending,
    readOnly,
    name,
    value,
    options = emptyOptionList,
    isMulti,
    onChange,
    ...otherSelectInputProps
  } = props;

  const handleChange = React.useCallback((newValue) => {
    if (!props.onChange) {
      return;
    }

    if (isDefined(newValue)) {
      if (props.isMulti) {
        props.onChange(newValue.map((d: Option) => d.value), name);
      } else {
        props.onChange(newValue.value, name);
      }
    } else {
      if (props.isMulti) {
        props.onChange([], name);
      } else {
        props.onChange(undefined as unknown as V, name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, props.isMulti, props.onChange]);

  const selectValue = React.useMemo(() => {
    if (!props.isMulti) {
      return options.find(o => (
        String(props.value) === String(o.value)
      )) ?? null;
    }

    return options.filter(
      o => (props.value || []).findIndex(
        v => String(v) === String(o.value)
      ) !== -1
    );
  }, [props.isMulti, options, props.value]);

  return (
    <InputContainer
      className={_cs(
        disabled && styles.disabled,
        styles.selectInput,
        className,
      )}
      actions={actions}
      icons={icons}
      hint={hint}
      error={error}
      label={label}
      disabled={disabled}
      input={(
        <Select
          {...otherSelectInputProps}
          className={styles.select}
          classNamePrefix="go"
          readOnly={readOnly}
          onChange={handleChange}
          value={selectValue}
          options={options}
          isMulti={isMulti}
          isDisabled={pending || disabled}
          isLoading={pending}
        />
      )}
    />
  );
}

export default SelectInput;

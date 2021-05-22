import React from 'react';
import {
   _cs,
  isDefined,
} from '@togglecorp/fujs';
import Select, { Props as SelectProps } from 'react-select';

import InputContainer from '#components/InputContainer';

import styles from './styles.module.scss';


interface Option {
  value: string | number;
  label: string;
}

const emptyOptionList: Option[] = [];
type Key = string | number | undefined;

interface BaseProps<N> {
  className?: string;
  actions?: React.ReactNode;
  icons?: React.ReactNode;
  error?: React.ReactNode,
  label?: React.ReactNode,
  disabled?: boolean;
  pending?: boolean;
  readOnly?: boolean;
  name: N;
  isMulti?: boolean,
  options?: Option[];
  placeholder?: string;
  isOptionDisabled?: SelectProps<Option>['isOptionDisabled'];
}

type Props<N extends Key, V extends Key> = BaseProps<N> & ({
  isMulti?: false;
  value: V;
  onChange: (newValue: V, name: N) => void;
} | {
  isMulti: true;
  value: V[] | undefined;
  onChange: (newValue: V[], name: N) => void;
})

function SelectInput<N extends Key, V extends Key>(props: Props<N, V>) {
  const {
    className,
    actions,
    icons,
    error,
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

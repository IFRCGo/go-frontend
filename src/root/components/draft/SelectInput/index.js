import React from 'react';
import {
   _cs,
  isDefined,
} from '@togglecorp/fujs';
import Select from 'react-select';

import InputContainer from '#components/draft/InputContainer';

import styles from './styles.module.scss';

const emptyList = [];

function SelectInput(props) {
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
    options,
    isMulti,
    onChange,
    ...otherSelectInputProps
  } = props;

  const handleChange = React.useCallback((newValue) => {
    if (!onChange) {
      return;
    }

    if (isDefined(newValue)) {
      if (isMulti) {
        onChange(newValue.map(d => d.value), name);
      } else {
        onChange(newValue.value, name);
      }
    } else {
      onChange(isMulti ? emptyList : undefined, name);
    }
  }, [name, isMulti, onChange]);

  const selectValue = React.useMemo(() => {
    if (!isMulti) {
      return options.find(o => (
        String(value) === String(o.value)
      )) ?? null;
    }

    return options.filter(
      o => (value || []).findIndex(
        v => String(v) === String(o.value)
      ) !== -1
    );
  }, [isMulti, options, value]);

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

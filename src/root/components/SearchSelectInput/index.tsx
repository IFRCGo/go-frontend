import React from 'react';
import {
  isDefined,
  unique,
} from '@togglecorp/fujs';
import AsyncSelect from 'react-select/async';

import styles from './styles.module.scss';

import InputContainer from '#components/InputContainer';
import { getSelectInputNoOptionsMessage } from '#utils/utils';

export interface Option {
  value: string | number;
  label: string;
}

const emptyOptionList: Option[] = [];

type Key = string | number | undefined;

interface BaseProps<N, V extends Key> {
  className?: string;
  actions?: React.ReactNode;
  icons?: React.ReactNode;
  error?: React.ReactNode,
  label?: React.ReactNode,
  disabled?: boolean;
  pending?: boolean;
  readOnly?: boolean;
  name: N;
  value: V;
  loadOptions: (value: string | undefined, callback: (opt: Option[]) => void) => void;
  isMulti?: boolean,
  onChange: (newValue: V, name: N) => void;
  placeholder?: string;
  initialOptions?: Option[];
  defaultOptions?: boolean;
}

type Props<N extends Key, V extends Key> = BaseProps<N, V> & ({
  isMulti?: false;
  value: V;
  onChange: (newValue: V, name: N) => void;
} | {
  isMulti: true;
  value: V[];
  onChange: (newValue: V[], name: N) => void;
})

function SearchSelectInput<N extends Key, V extends Key>(props: Props<N, V>) {
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
    loadOptions,
    isMulti,
    onChange,
    initialOptions = emptyOptionList,
    defaultOptions,
    ...otherSelectInputProps
  } = props;

  const [options, setOptions] = React.useState<Option[]>(initialOptions);

  React.useEffect(() => {
    if (initialOptions.length > 0) {
      setOptions(
        prevOptions => unique(
          [
            ...prevOptions,
            ...initialOptions,
          ],
          o => o.value
        ) ?? [],
      );
    }
  }, [initialOptions]);

  const timeoutRef = React.useRef<number | undefined>();

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
      ));
    }

    return options.filter(
      o => (props.value || []).findIndex(
        v => String(v) === String(o.value)
      ) !== -1
    );
  }, [props.isMulti, options, props.value]);

  const handleLoadOptions = React.useCallback((searchText, callback) => {
    if (!isDefined(searchText)) {
      callback(emptyOptionList);
    }

    const localCallback = (currentOptions: Option[]) => {
      if (currentOptions?.length > 0) {
        setOptions(
          prevOptions => unique(
            [
              ...prevOptions,
              ...currentOptions,
            ],
            o => o.value
          ) ?? [],
        );
      }
      callback(currentOptions);
    };

    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      loadOptions(searchText, localCallback);
    }, 350);
  }, [setOptions, loadOptions]);

  return (
    <InputContainer
      className={className}
      actions={actions}
      icons={icons}
      error={error}
      label={label}
      disabled={disabled}
      input={(
        <AsyncSelect
          {...otherSelectInputProps}
          className={styles.select}
          classNamePrefix="go"
          readOnly={readOnly}
          onChange={handleChange}
          value={selectValue}
          loadOptions={handleLoadOptions}
          isMulti={isMulti}
          isDisabled={pending || disabled}
          isLoading={pending}
          noOptionsMessage={getSelectInputNoOptionsMessage as unknown as (obj: { inputValue: string }) => string}
          defaultOptions={defaultOptions}
        />
      )}
    />
  );
}

export default SearchSelectInput;

import React from 'react';
import { _cs } from '@togglecorp/fujs';

import InputLabel from '../InputLabel';
import InputError from '../InputError';
import List from '../List';
import Radio, { Props as RadioProps } from './Radio';

import styles from './styles.module.scss';

export interface Props<N, O, V, RRP extends RadioProps<V>> {
  className?: string;
  options: O[];
  name: N;
  value: V | undefined;
  onChange: (value: V | undefined, name: N) => void;
  radioKeySelector: (option: O) => V;
  radioLabelSelector: (option: O) => React.ReactNode;
  radioDescriptionSelector?: (option: O) => React.ReactNode;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  labelContainerClassName?: string;
  hintContainerClassName?: string;
  errorContainerClassName?: string;
  radioListContainerClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  radioRenderer?: (p: RRP) => React.ReactElement;
  radioRendererParams?: (o: O) => Omit<RRP, 'inputName' | 'label' | 'name' | 'onClick' | 'value'>;
}

function RadioInput<
  N extends string | number,
  O extends object,
  V extends string | number,
RRP extends RadioProps<V>,
>(props: Props<N, O, V, RRP>) {
  const {
    className,
    name,
    options,
    value,
    onChange,
    radioKeySelector,
    radioLabelSelector,
    radioDescriptionSelector,
    label,
    labelContainerClassName,
    radioListContainerClassName,
    error,
    errorContainerClassName,
    radioRenderer = Radio,
    radioRendererParams: radioRendererParamsFromProps,
    disabled,
    readOnly,
  } = props;

  const handleRadioClick = React.useCallback((radioKey) => {
    if (onChange && !readOnly) {
      onChange(radioKey, name);
    }
  }, [readOnly, onChange, name]);

  const radioRendererParams: (
    k: V,
    i: O,
  ) => RRP = React.useCallback((key: V, item: O) => {
    const radioProps: Pick<RRP, 'inputName' | 'label' | 'name' | 'onClick' | 'value' | 'disabled' | 'readOnly' | 'description'> = {
      inputName: name,
      label: radioLabelSelector(item),
      description: radioDescriptionSelector ? radioDescriptionSelector(item) : undefined,
      name: key,
      onClick: handleRadioClick,
      value: key === value,
      disabled,
      readOnly,
    };

    const combinedProps = {
      ...(radioRendererParamsFromProps ? radioRendererParamsFromProps(item) : undefined),
      ...radioProps,
    } as RRP;

    return combinedProps;
  }, [
    name,
    radioLabelSelector,
    value,
    handleRadioClick,
    radioRendererParamsFromProps,
    disabled,
    readOnly,
    radioDescriptionSelector,
  ]);

  return (
    <div
      className={_cs(
        styles.radioInput,
        disabled && styles.disabled,
        className,
      )}
    >
      <InputLabel
        className={labelContainerClassName}
        disabled={disabled}
      >
        { label }
      </InputLabel>
      <div className={_cs(styles.radioListContainer, radioListContainerClassName)}>
        <List<O, RadioProps<V> & RRP, V, any, any>
          data={options}
          rendererParams={radioRendererParams}
          renderer={radioRenderer}
          keySelector={radioKeySelector}
          />
        </div>
      <InputError className={errorContainerClassName}>
        {error}
      </InputError>
    </div>
  );
}

export default RadioInput;

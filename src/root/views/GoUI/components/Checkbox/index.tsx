import React, { useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';

import DefaultCheckmark, { CheckmarkProps } from './Checkmark';

import styles from './styles.module.scss';

export interface Props<N> {
  className?: string;
  checkmark?: (p: CheckmarkProps) => React.ReactElement;
  checkmarkClassName?: string;
  disabled?: boolean;
  error?: React.ReactNode;
  indeterminate?: boolean;
  invertedLogic?: boolean;
  label?: React.ReactNode;
  labelContainerClassName?: string;
  name: N;
  onChange: (value: boolean, name: N) => void;
  readOnly?: boolean;
  tooltip?: string;
  value: boolean | undefined | null;
}

function Checkbox<N>(props: Props<N>) {
  const {
    className: classNameFromProps,
    checkmark: Checkmark = DefaultCheckmark,
    checkmarkClassName,
    disabled,
    error,
    indeterminate,
    invertedLogic = false,
    label,
    labelContainerClassName,
    name,
    onChange,
    readOnly,
    tooltip,
    value,
    ...otherProps
  } = props;

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const v = e.currentTarget.checked;
      onChange(
        invertedLogic ? !v : v,
        name,
      );
    },
    [name, onChange, invertedLogic],
  );

  const checked = invertedLogic ? !value : value;

  const className = _cs(
    styles.checkbox,
    classNameFromProps,
    !indeterminate && checked && styles.checked,
    disabled && styles.disabledCheckbox,
    readOnly && styles.readOnly,
  );


  return (
    <label
      className={className}
      title={tooltip}
    >
      <div className={styles.inner}>
        <Checkmark
          className={_cs(checkmarkClassName, styles.checkmark)}
          value={checked ?? false}
          indeterminate={indeterminate}
          aria-hidden="true"
        />
        <input
          onChange={handleChange}
          className={styles.input}
          type="checkbox"
          checked={checked ?? false}
          disabled={disabled || readOnly}
          readOnly={readOnly}
          {...otherProps}
        />
      </div>
      <div className={labelContainerClassName}>
        {label}
      </div>
      {error && (
        <div className={labelContainerClassName}>
          {error}
        </div>
      )}
    </label>
  );
}

export default Checkbox;

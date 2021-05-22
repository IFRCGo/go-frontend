import React, { useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';

import DefaultCheckmark, { CheckmarkProps } from './Checkmark';

import styles from './styles.module.scss';

type OptionKey = string | number;

export interface Props<N extends OptionKey> {
  className?: string;
  labelContainerClassName?: string;
  checkmark?: (p: CheckmarkProps) => React.ReactElement;
  checkmarkClassName?: string;
  label?: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  indeterminate?: boolean;
  tooltip?: string;
  value: boolean | undefined | null;
  onChange: (value: boolean, name: N) => void;
  name: N;
}

function Checkbox<N extends OptionKey>(props: Props<N>) {
  const {
    label,
    tooltip,
    checkmark: Checkmark = DefaultCheckmark,
    className: classNameFromProps,
    value,
    disabled,
    readOnly,
    onChange,
    checkmarkClassName,
    labelContainerClassName,
    indeterminate,
    name,
    ...otherProps
  } = props;

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const v = e.currentTarget.checked;
      onChange(v, name);
    },
    [name, onChange],
  );

  const className = _cs(
    'go-checkbox',
    styles.checkbox,
    classNameFromProps,
    indeterminate && styles.indeterminate,
    !indeterminate && value && styles.checked,
    disabled && styles.disabled,
    readOnly && styles.readOnly,
  );

  return (
    <label // eslint-disable-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for
      className={className}
      title={tooltip}
    >
      <Checkmark
        className={_cs(checkmarkClassName, styles.checkmark)}
        value={value ?? false}
        indeterminate={indeterminate}
      />
      <input
        onChange={handleChange}
        className={styles.input}
        type="checkbox"
        checked={value ?? false}
        disabled={disabled || readOnly}
        {...otherProps}
        readOnly
      />
      <div className={_cs(styles.label, labelContainerClassName)}>
        { label }
      </div>
    </label>
  );
}

export default Checkbox;

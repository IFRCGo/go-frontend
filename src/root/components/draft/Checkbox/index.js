import React from 'react';
import {
    MdCheckBox,
    MdCheckBoxOutlineBlank,
    MdIndeterminateCheckBox,
} from 'react-icons/md';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

function Checkbox(props) {
  const {
    className,
    indeterminate,
    label,
    onChange,
    readOnly,
    disabled,
    value,
    name,
  } = props;

  const handleChange = React.useCallback((e) => {
    const v = e.currentTarget.checked;
    if (onChange) {
      onChange(v, name);
    }
  }, [name, onChange]);


  return (
    <label
      className={_cs(
        'go-checkbox',
        styles.checkbox,
        className,
        value && styles.checked,
      )}
    >
      <div className={styles.checkmark}>
        { indeterminate && (
          <MdIndeterminateCheckBox className={styles.checkIcon} />
        )}
        {value && !indeterminate && (
          <MdCheckBox
            className={styles.checkIcon}
          />
        )}
        {!value && !indeterminate && (
          <MdCheckBoxOutlineBlank
            className={styles.checkIcon}
          />
        )}
      </div>
      <div className={styles.label}>
        { label }
      </div>
      <input
        onChange={handleChange}
        className={styles.input}
        type="checkbox"
        checked={value ?? false}
        disabled={disabled || readOnly}
      />
    </label>
  );
}

export default Checkbox;

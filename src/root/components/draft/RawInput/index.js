import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

function RawInput(props) {
  const {
    className,
    onChange,
    elementRef,
    value,
    name,
    ...otherProps
  } = props;

  const handleChange = React.useCallback((e) => {
    const v = e.target.value;

    if (onChange) {
      onChange(
        v === '' ? undefined : v,
        name,
        e,
      );
    }
  }, [name, onChange]);

  return (
    <input
      {...otherProps}
      ref={elementRef}
      className={_cs(
        'go-raw-input',
        styles.rawInput,
        className,
      )}
      name={name}
      onChange={handleChange}
      value={value ?? ''}
    />
  );
}

export default RawInput;

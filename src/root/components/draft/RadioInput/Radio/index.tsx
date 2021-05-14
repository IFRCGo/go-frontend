import React from 'react';
import {
  _cs,
  isDefined,
} from '@togglecorp/fujs';
import {
  IoRadioButtonOn,
  IoRadioButtonOff,
} from 'react-icons/io5';

import InputElementFragments from '../../InputElementFragments';

import styles from './styles.module.scss';

export interface Props<N> {
  className?: string;
  inputName?: string | number;
  label?: React.ReactNode;
  description?: React.ReactNode;
  name: N;
  onClick: (name: N) => void;
  value: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

function Radio<N extends string | number>(props: Props<N>) {
  const {
    name,
    label,
    description,
    className,
    value,
    inputName,
    onClick,
    disabled,
    readOnly,
  } = props;

  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick(name);
    }
  }, [name, onClick]);

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for
    <label
      className={_cs(
        styles.radio,
        value && styles.active,
        className,
        disabled && styles.disabled,
        readOnly && styles.readOnly,
      )}
    >
      <InputElementFragments
        icons={value ? (
          <IoRadioButtonOn className={styles.icon} />
        ) : (
          <IoRadioButtonOff className={styles.icon} />
        )}
        childrenContainerClassName={styles.children}
      >
        {label}
        <div className={styles.description}>
          {description}
        </div>
      </InputElementFragments>
      <input
        className={styles.input}
        type="radio"
        name={isDefined(inputName) ? String(inputName) : undefined}
        checked={value}
        onClick={handleClick}
        disabled={disabled}
        readOnly
      />
    </label>
  );
}

export default Radio;

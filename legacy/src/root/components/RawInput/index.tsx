import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

export interface Props<N> extends Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'value' | 'name' | 'label'> {
    className?: string;
    name: N;
    value: string | undefined | null;
    onChange?: (
        value: string | undefined,
        name: N,
        e?: React.FormEvent<HTMLInputElement> | undefined,
    ) => void;
    elementRef?: React.Ref<HTMLInputElement>;
}

function RawInput<N>(props: Props<N>) {
  const {
    className,
    onChange,
    elementRef,
    value,
    name,
    ...otherProps
  } = props;

  const handleChange = React.useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value;

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
      name={typeof name === 'string' ? name : undefined}
      onChange={handleChange}
      value={value ?? ''}
    />
  );
}

export default RawInput;

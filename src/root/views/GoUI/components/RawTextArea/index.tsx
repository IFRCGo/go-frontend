import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

export interface Props<N> extends Omit<React.HTMLProps<HTMLTextAreaElement>, 'ref' | 'onChange' | 'value' | 'name'> {
  className?: string;
  name: N;
  value: string | undefined | null;
  onChange?: (
    value: string | undefined,
    name: N,
    e?: React.FormEvent<HTMLTextAreaElement> | undefined,
  ) => void;
  elementRef?: React.Ref<HTMLTextAreaElement>;
}

function RawTextArea<N>(props: Props<N>) {
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
    <textarea
      {...otherProps}
      ref={elementRef}
      className={_cs(
        styles.rawInput,
        className,
      )}
      name={typeof name === 'string' ? name : undefined}
      onChange={handleChange}
      value={value ?? ''}
    />
  );
}

export default RawTextArea;

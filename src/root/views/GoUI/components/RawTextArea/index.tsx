import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { NameType } from '#goui/components/types';

import styles from './styles.module.scss';

export interface Props<N extends NameType> extends Omit<React.HTMLProps<HTMLTextAreaElement>, 'ref' | 'onChange' | 'value' | 'name'> {
  className?: string;
  name: N;
  value: string | undefined | null;
  onChange: (
    value: string | undefined,
    name: N,
    e?: React.ChangeEvent<HTMLTextAreaElement> | undefined,
  ) => void;
  elementRef?: React.Ref<HTMLTextAreaElement>;
}

function RawTextArea<N extends NameType>(props: Props<N>) {
  const {
    className,
    onChange,
    elementRef,
    value,
    name,
    ...otherProps
  } = props;

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e?.target?.value;

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
      name={name}
      onChange={handleChange}
      value={value ?? ''}
    />
  );
}

export default RawTextArea;

import React from 'react';

import { Props as InputContainerProps } from '#components/InputContainer';
import RawInput, { Props as RawInputProps } from '#components/RawInput';
import styles from './styles.module.scss';
import SearchInputContainer from '#components/SearchInputContainer';

type InheritedProps<T> = (Omit<InputContainerProps, 'input'> & RawInputProps<T>);
export interface Props<T extends string | undefined> extends InheritedProps<T> {
  inputElementRef?: React.RefObject<HTMLInputElement>;
  inputClassName?: string;
}

function SearchInput<T extends string | undefined>(props: Props<T>) {
  const {
    className,
    actions,
    icons,
    error,
    hint,
    label,
    disabled,
    readOnly,
    errorOnTooltip,
    inputClassName,
    type = 'search',
    ...otherInputProps
  } = props;

  return (
    <SearchInputContainer
      className={styles.searchInputContainer}
      actions={actions}
      icons={icons}
      hint={hint}
      error={error}
      label={label}
      disabled={disabled}
      errorOnTooltip={errorOnTooltip}
      input={(
        <div className={styles.searchText}>
          <RawInput
            {...otherInputProps}
            readOnly={readOnly}
            disabled={disabled}
            className={styles.rawInput}
            type={type}
          />
        </div>
      )}
    />
  );
}

export default SearchInput;

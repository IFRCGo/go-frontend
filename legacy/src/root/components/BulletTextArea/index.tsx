import React from 'react';

import InputContainer, { Props as InputContainerProps } from '#components/InputContainer';
import RawTextArea, { Props as RawTextAreaProps } from '#components/RawTextArea';

const BULLET = '•';
const KEYCODE_ENTER = 13;

type InheritedProps<T> = (Omit<InputContainerProps, 'input'> & RawTextAreaProps<T>);
export interface Props<T extends string | undefined> extends InheritedProps<T> {
    inputElementRef?: React.RefObject<HTMLInputElement>;
    inputClassName?: string;
}

function TextArea<T extends string | undefined>(props: Props<T>) {
  const {
    className,
    actions,
    icons,
    error,
    label,
    disabled,
    readOnly,
    inputClassName,
    name,
    onChange,
    ...otherInputProps
  } = props;

  const handleInputFocus = React.useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (!onChange) {
      return;
    }

    if (e.target.value === '') {
      onChange(`${BULLET} `, name);
    }
  }, [onChange, name]);

  const handleKeyUp = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!onChange) {
      return;
    }

    if (e.keyCode === KEYCODE_ENTER) {
      onChange(`${e.currentTarget.value}${BULLET} `, name);
    }

  }, [onChange, name]);

  return (
    <InputContainer
      className={className}
      actions={actions}
      icons={icons}
      error={error}
      label={label}
      disabled={disabled}
      input={(
        <RawTextArea
          rows={5}
          {...otherInputProps}
          name={name}
          readOnly={readOnly}
          disabled={disabled}
          onChange={onChange}
          className={inputClassName}
          onFocus={handleInputFocus}
          onKeyUp={handleKeyUp}
        />
      )}
    />
  );
}

export default TextArea;

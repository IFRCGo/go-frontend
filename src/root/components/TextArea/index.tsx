import React from 'react';
// import { _cs } from '@togglecorp/fujs';

import InputContainer, { Props as InputContainerProps } from '#components/InputContainer';
import RawTextArea, { Props as RawTextAreaProps } from '#components/RawTextArea';

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
    hint,
    disabled,
    readOnly,
    inputClassName,
    errorOnTooltip,
    ...otherInputProps
  } = props;

  return (
    <InputContainer
      className={className}
      actions={actions}
      icons={icons}
      error={error}
      hint={hint}
      label={label}
      disabled={disabled}
      errorOnTooltip={errorOnTooltip}
      input={(
        <RawTextArea
          rows={5}
          {...otherInputProps}
          readOnly={readOnly}
          disabled={disabled}
          className={inputClassName}
        />
      )}
    />
  );
}

export default TextArea;

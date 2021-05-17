import React from 'react';
// import { _cs } from '@togglecorp/fujs';

import InputContainer, { Props as InputContainerProps } from '#components/draft/InputContainer';
import RawTextArea, { Props as RawTextAreaProps } from '#components/draft/RawTextArea';

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
    ...otherInputProps
  } = props;

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
          readOnly={readOnly}
          disabled={disabled}
          className={inputClassName}
        />
      )}
    />
  );
}

export default TextArea;

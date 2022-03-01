import React from 'react';

import InputContainer, { Props as InputContainerProps } from '#components/InputContainer';

type InheritedProps<T> = Omit<InputContainerProps, 'input'>;
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
        <div className={inputClassName}>
          Woo hoo
        </div>
      )}
    />
  );
}

export default TextArea;

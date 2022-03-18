import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { RawEditorSettings } from 'tinymce';
import { _cs } from '@togglecorp/fujs';

import InputContainer, { Props as InputContainerProps } from '#components/InputContainer';

import styles from './styles.module.scss';

const editorSettings: Omit<RawEditorSettings, 'selector' | 'target'> = {
  menubar: false,
};

type InheritedProps<T> = Omit<InputContainerProps, 'input'> & {
  value: string | undefined;
  name: T;
  onChange?: (
    value: string | undefined,
    name: T,
  ) => void;
}
export interface Props<T extends string | undefined> extends InheritedProps<T> {
    inputElementRef?: React.RefObject<HTMLInputElement>;
    inputClassName?: string;
}

function RichTextArea<T extends string | undefined>(props: Props<T>) {
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
    value,
    onChange,
    ...otherInputProps
  } = props;

  const handleChange = React.useCallback((newValue: string | undefined) => {
    if (onChange) {
      if (newValue === '') {
        onChange(undefined, name);
      } else {
        onChange(newValue, name);
      }
    }
  }, [onChange, name]);

  return (
    <InputContainer
      className={_cs(styles.richTextArea, className)}
      actions={actions}
      icons={icons}
      error={error}
      label={label}
      disabled={disabled}
      input={(
        <Editor
          {...otherInputProps}
          apiKey={process.env.REACT_APP_TINY_API_KEY}
          init={editorSettings}
          value={value}
          onEditorChange={handleChange}
        />
      )}
    />
  );
}

export default RichTextArea;

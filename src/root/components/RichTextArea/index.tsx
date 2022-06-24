import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { RawEditorSettings } from 'tinymce';
import { _cs } from '@togglecorp/fujs';
import { tinyApiKey } from '#config';

import InputContainer, { Props as InputContainerProps } from '#components/InputContainer';

import styles from './styles.module.scss';

const editorSettings: Omit<RawEditorSettings, 'selector' | 'target'> = {
  menubar: false, // https://www.tiny.cloud/docs/advanced/available-toolbar-buttons
  plugins: ['advlist autolink lists link help code'],
  toolbar: 'undo redo | formatselect | ' +
    'bold italic underlined | alignleft aligncenter alignright alignjustify |' +
    'bullist numlist outdent indent | code removeformat | help',
  // https://www.tiny.cloud/docs/configure/content-filtering/#invalid_styles
  invalid_styles: {'*': 'opacity'},
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
    placeholder?: string;
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

  if (props.placeholder !== undefined) {
    editorSettings.placeholder =  props.placeholder;
  }

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
          apiKey={tinyApiKey}
          init={editorSettings}
          value={value}
          onEditorChange={handleChange}
        />
      )}
    />
  );
}

export default RichTextArea;

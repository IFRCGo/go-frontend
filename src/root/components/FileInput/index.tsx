import React, { useCallback, useMemo } from 'react';
import { _cs } from '@togglecorp/fujs';

import InputContainer, { Props as InputContainerProps } from '#components/InputContainer';
import RawInput, { Props as RawInputProps } from '#components/RawInput';
import { useButtonFeatures } from '#components/Button';
import styles from './styles.module.scss';

export const isValidFile = (fileName: string, mimeType: string, acceptString?: string) => {
  // if there is no accept string, anything is valid
  if (!acceptString) {
    return true;
  }
  const extensionMatch = /\.\w+$/.exec(fileName);
  const mimeMatch = /^.+\//.exec(mimeType);


  const fileTypeList = acceptString.split(/,\s+/);
  return fileTypeList.some((fileType) => {
    // check mimeType such as image/png or image/*
    if (mimeType === fileType || (!!mimeMatch && `${mimeMatch[0]}*` === fileType)) {
      return true;
    }
    return !!extensionMatch && extensionMatch[0].toLowerCase() === fileType.toLowerCase();
  });
};

type InheritedProps<T> = (Omit<InputContainerProps, 'input'> & Omit<RawInputProps<T>, 'onChange' | 'value'>);
export type Props<T extends string> = InheritedProps<T> & {
  inputElementRef?: React.RefObject<HTMLInputElement>;
  inputClassName?: string;
  showStatus?: boolean;
  labelClassName?: string;

  overrideStatus?: boolean;
  status?: string;
} & ({
  multiple: true;
  value: File[] | undefined | null;
  onChange?: (files: File[], name: T) => void;
} | {
  multiple?: false;
  value: File | undefined | null;
  onChange?: (files: File | undefined, name: T) => void;
});

function FileInput<T extends string>(props: Props<T>) {
  const {
    actions,
    className,
    disabled,
    error,
    icons,
    label,
    readOnly,
    inputElementRef,
    inputClassName,
    value: _,
    onChange: __,
    overrideStatus,
    status: statusFromProps,
    name,
    multiple,
    accept,
    labelClassName,
    children,
    showStatus,
    ...fileInputProps
  } = props;

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || !props.onChange) {
        return;
      }

      const fileList = Array.from(files);
      const validFiles = fileList.filter((f) => isValidFile(f.name, f.type, accept));
      if (validFiles.length <= 0) {
        return;
      }

      if (!props.multiple) {
        const [firstFile] = validFiles;
        props.onChange(firstFile, name);
      } else {
        props.onChange(validFiles, name);
      }
    },
    // eslint-disable-next-line
    [accept, props.multiple, props.onChange, name],
  );

  const handleChange = useCallback((
    _: string | undefined, __: T, e?: React.FormEvent<HTMLInputElement>,
  ) => {
    if (e) {
      const { files } = (e.target as HTMLInputElement);
      handleFiles(files);
    }
  }, [handleFiles]);

  const {
    className: buttonLabelClassName,
    children: buttonLabelChildren,
  } = useButtonFeatures({
    variant: 'secondary',
    className: labelClassName,
    disabled,
    children: (
      <>
        {children}
        <RawInput<T>
          {...fileInputProps}
          className={styles.input}
          elementRef={inputElementRef}
          readOnly={readOnly}
          disabled={disabled}
          value={undefined}
          name={name}
          onChange={handleChange}
          multiple={multiple}
          accept={accept}
          type="file"
        />
      </>
    ),
  });

  // eslint-disable-next-line react/destructuring-assignment

  const status = useMemo(
    () => {
      if (!props.multiple) {
        const singleFile = props.value;
        return singleFile ? singleFile.name : 'No file chosen';
      }

      const multipleFile = props.value;
      if (!multipleFile || multipleFile.length === 0) {
        return 'No file chosen';
      }
      if (multipleFile.length > 1) {
        return `${multipleFile.length} files selected`;
      }

      return multipleFile[0]?.name;
    },
    // eslint-disable-next-line react/destructuring-assignment
    [props.value, props.multiple],
  );

  const visibleStatus = overrideStatus
    ? statusFromProps
    : status;

  return (
    <InputContainer
      actions={actions}
      className={_cs(className, styles.fileInput)}
      disabled={disabled}
      error={error}
      icons={(
        <>
          {icons}
          <label
            className={buttonLabelClassName}
          >
            {buttonLabelChildren}
          </label>
        </>
      )}
      label={label}
      readOnly={readOnly}
      input={(
        <div
          className={_cs(
            styles.inputWrapper,
            inputClassName,
          )}
        >
          {showStatus && (
            <div className={styles.status}>
              {visibleStatus}
            </div>
          )}
        </div>
      )}
    />
  );
}

export default FileInput;

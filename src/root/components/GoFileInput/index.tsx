import React, { useCallback, useState } from 'react';

import { useLazyRequest } from '#utils/restRequest';
import { FileInput, FileInputProps } from '#components/FileInput';

interface Option {
  id: number;
  title: string;
  file: string; // this is a url
}

interface Props<T extends string> extends Omit<FileInputProps<T>, 'overrideStatus' | 'status' | 'value' | 'onChange' | 'multiple'>  & ({
  multiple: true;
  value: number[];
  onChange: (value: number[] | undefined, name: T) => void;
} | {
  multiple?: false;
  value: number;
  onChange: (value: number | undefined, name: T) => void;
})

function GoFileInput<T extends string>(props: Props<T>) {
  const {
    value: valueFromProps,
    disabled,
    name,
    onChange,
    multiple,
    ...otherProps
  } = props;

  const [value, setValue] = useState<File | File[] | undefined>();

  const {
    pending,
    trigger,
  } = useLazyRequest<Option, File>({
    formData: true,
    url: 'server://files/',
    method: 'POST',
    body: ctx => ctx,
    onSuccess: (response) => {
      onChange(response, name);
    },
    onFailure: () => {
      console.error('Could not upload file!');
    },
  });

  const handleChange = useCallback(
    (file: File | File[] | undefined) => {
      setValue(file);

      if (file) {
        trigger(file);
      } else {
        onChange(undefined, name);
      }
    },
    [trigger, name, onChange],
  );

  let currentStatus;
  if (pending) {
    currentStatus = 'Uploading file'; // FIXME add translations
  } else if (!valueFromProps) {
    currentStatus = 'No file selected'; // FIXME add translations
  }  else {
    currentStatus = `${valueFromProps.length} files selected`
  }

  return (
    <FileInput
      {...otherProps}
      disabled={disabled || pending}
      name={name}
      overrideStatus
      status={currentStatus}
      value={value}
      onChange={handleChange}
      multiple={multiple}
    />
  );
}
export default GoFileInput;

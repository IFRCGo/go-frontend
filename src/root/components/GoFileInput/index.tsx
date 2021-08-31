import React, { useCallback } from 'react';

import { useLazyRequest } from '#utils/restRequest';
import { IoClose } from 'react-icons/io5';
import Button from '#components/Button';
import FileInput, {Props as FileInputProps } from '#components/FileInput';

interface Option {
  id: number;
  file: string; // this is a url
}

type Props<T extends string> =  Omit<FileInputProps<T>, 'overrideStatus' | 'status' | 'value' | 'onChange' | 'multiple'> & ({
  multiple: true;
  value?: number[];
  onChange: (value: number[] | undefined, name: T) => void;
} | {
  multiple?: false;
  value?: number;
  onChange: (value: number | undefined, name: T) => void;
})

function GoFileInput<T extends string>(props: Props<T>) {
  const {
    value,
    disabled,
    name,
    actions,
    ...otherProps
  } = props;

  const {
    pending,
    trigger,
    context,
  } = useLazyRequest<Option | Option[], { file: FileInputProps<T>['value'] }>({
    formData: true,
    url: props.multiple ? 'api/v2/dref-files/multiple/' : 'api/v2/dref-files/',
    method: 'POST',
    body: ctx => ctx,
    onSuccess: (response) => {
      if (props.multiple) {
        const ids = (response as Option[]).map(v => v.id);
        props.onChange(ids, name);
      } else {
        const { id } = response as Option;
        props.onChange(id, name);
      }
    },
    onFailure: () => {
      console.error('Could not upload file!');
    },
  });

  const handleChange = useCallback(
    (file: FileInputProps<T>['value']) => {
      if (file) {
        trigger({ file });
      } else {
        props.onChange(undefined, name);
      }
    },

    //eslint-disable-next-line
    [trigger, name, props.onChange],
  );

  let currentStatus;
  if (pending) {
    currentStatus = 'Uploading file';
  } else if (!value) {
    currentStatus = 'No file selected';
  }  else {
    currentStatus = Array.isArray(value) ? `${value.length} files selected` : '1 file selected';
  }

  const handleClear = useCallback(() => {
    props.onChange(undefined, name);
    //eslint-disable-next-line
  }, [props.onChange]);

  return (
    <FileInput
      {...otherProps}
      actions={(
        <>
          {actions}
          {value && (
            <Button
              onClick={handleClear}
              disabled={disabled}
              variant="action"
              name={undefined}
              title="Clear"
            >
              <IoClose />
            </Button>
        )}
        </>
      )}
      disabled={disabled || pending}
      name={name}
      overrideStatus
      status={currentStatus}
      value={context?.file}
      onChange={handleChange}
    />
  );
}
export default GoFileInput;

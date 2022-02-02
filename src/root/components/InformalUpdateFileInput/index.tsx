import React, { useCallback } from 'react';
import {
  _cs,
  isDefined,
  randomString,
} from '@togglecorp/fujs';
import { IoClose } from 'react-icons/io5';
import {
  EntriesAsList,
  PartialForm,
  SetValueArg,
  useFormArray,
  useFormObject
} from '@togglecorp/toggle-form';

import { useLazyRequest } from '#utils/restRequest';
import Button from '#components/Button';
import FileInput, { Props as FileInputProps } from '#components/FileInput';
import useAlert from '#hooks/useAlert';
import TextInput from '#components/TextInput';
import {
  ImageData,
  InformalUpdateFields
} from '#views/InformalUpdateApplicationForm/common';
import { ImageDataType } from '#views/InformalUpdateApplicationForm/useInformalUpdateFormOptions';

import styles from './styles.module.scss';

type Value = PartialForm<InformalUpdateFields>;
const defaultFormValues: PartialForm<ImageData> = {};
interface Option {
  id: number;
  file: string; // this is a url
}

interface PreviewProps {
  file: string;
  value: PartialForm<ImageDataType>;
  index: number;
  onChange: (value: SetValueArg<PartialForm<ImageData>>, index: number) => void;
  onRemove?: (index: number) => void;
}

// TODO: verify the file is an image before preview
function Preview(props: PreviewProps) {
  const {
    onRemove,
    value,
    index,
    onChange
  } = props;

  const onValueChange = useFormObject(index, onChange, defaultFormValues);

  if (!value?.file) {
    return null;
  }

  const isPreviewable = value?.file.match(/.(jpg|jpeg|png|gif)$/i);

  const removeButton = (
    <Button
      name={index}
      onClick={onRemove}
      className={styles.removeButton}
    >
      <IoClose />
    </Button>
  );

  if (!isPreviewable) {
    return (
      <div className={styles.noPreview}>
        {removeButton}
        Preview not available!
      </div>
    );
  }

  return (
    <div>
      <div className={styles.preview}>
        <img
          className={styles.image}
          src={value?.file}
        />
        {removeButton}
      </div>
      <TextInput
        className={styles.captionText}
        name="caption"
        value={value.caption}
        label="Captions"
        onChange={onValueChange}
      />
    </div>
  );
}

type Props<T extends string> = Omit<FileInputProps<T>, 'overrideStatus' | 'status' | 'value' | 'onChange' | 'multiple' | 'onCaptionValueChange'> & {
  fileIdToUrlMap?: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  allValue: Value;
  onCaptionValueChange: (...entries: EntriesAsList<Value>) => void;
} & ({
  multiple: true;
  value?: number[];
  onChange: (value: number[] | undefined, name: T) => void;
} | {
  multiple?: false;
  value?: number;
  onChange: (value: number | undefined, name: T) => void;
})

function InformalUpdateFileInput<T extends string>(props: Props<T>) {
  const {
    onCaptionValueChange,
    allValue,
    value,
    disabled,
    name,
    actions,
    fileIdToUrlMap,
    setFileIdToUrlMap,
    className,
    ...otherProps
  } = props;
  const alert = useAlert();

  type ImageDetails = typeof allValue.graphics_details;

  const {
    setValue: onImageChange,
    removeValue: onImageRemove,
  } = useFormArray<'graphics_details', PartialForm<ImageData>>(
    'graphics_details',
    onCaptionValueChange,
  );

  const {
    pending,
    trigger: triggerFileUpload,
    context,
  } = useLazyRequest<Option | Option[], { file: FileInputProps<T>['value'] }>({
    formData: true,
    url: props.multiple ? 'api/v2/informal-file/multiple/' : 'api/v2/informal-file/',
    method: 'POST',
    body: ctx => ctx,
    onSuccess: (response) => {
      if (props.multiple) {
        const ids = (response as Option[]).map(v => v.id);
        if (setFileIdToUrlMap) {
          setFileIdToUrlMap((oldMap) => {
            const newMap = {
              ...oldMap,
            };

            (response as Option[]).forEach((o) => {
              newMap[o.id] = o.file;
            });

            return newMap;
          });
        }
        props.onChange([...(props.value ?? []), ...ids], name);

        const newList = (response as Option[])?.map((el) => ({
          clientId: randomString(),
          caption: undefined,
          pk: el.id,
          file: el.file
        }));

        onCaptionValueChange(
          (oldValue: PartialForm<ImageDetails>) => (
            [...(oldValue ?? []), ...(newList ?? [])]
          ),
          'graphics_details' as const,
        );
      } else {
        const option = response as Option;
        const { id } = option;
        props.onChange(id, name);

        if (setFileIdToUrlMap) {
          setFileIdToUrlMap((oldMap) => {
            const newMap = {
              ...oldMap,
            };

            newMap[option.id] = option.file;
            return newMap;
          });
        }
      }
    },
    onFailure: (e) => {
      const serverError = e?.value?.formErrors as { file: string };
      const message = serverError?.file ?? 'Failed to upload the file!';
      alert.show(message, { variant: 'danger' });
      console.error('Could not upload file!', e);
    },
  });

  const handleChange = useCallback(
    (file: FileInputProps<T>['value']) => {
      if (file) {
        triggerFileUpload({ file });
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [triggerFileUpload, name, props.onChange],
  );

  let currentStatus;
  if (pending) {
    currentStatus = 'Uploading file(s)...';
  } else if (!allValue.graphics_details) {
    currentStatus = 'No file selected';
  } else {
    currentStatus = Array.isArray(allValue?.graphics_details) ? `${allValue?.graphics_details.length} files selected` : '1 file selected';
  }

  const handleClear = useCallback(() => {
    onCaptionValueChange([], 'graphics_details');
    // props.onChange(undefined, name);
    //eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [props.onChange, name]);

  //const handleFileRemoveButtonClick = useCallback((id: number) => {
  //  if (props.multiple) {
  //    const newValue = [...(props.value ?? [])];
  //    const i = newValue.findIndex(f => f === id);
  //    if (i === -1) {
  //      return;
  //    }

  //    newValue.splice(i, 1);
  //    props.onChange(newValue, name);
  //  } else {
  //    props.onChange(undefined, name);
  //  }
  //  //eslint-disable-next-line  react-hooks/exhaustive-deps
  //}, [props.value, props.onChange, props.multiple, name]);

  if (props.multiple) {
    return (
      <div className={_cs(styles.goFileInput, className)}>
        <FileInput
          {...otherProps}
          multiple
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
          value={context?.file as (File[] | null | undefined)}
          onChange={handleChange}
        />
        <div className={styles.previewList}>
          {allValue?.graphics_details?.filter(item => item.file !== undefined || null)?.map((el, i) => (
            <Preview
              key={i}
              index={i}
              value={el}
              //file={fileIdToUrlMap?.[el.id]}
              onRemove={onImageRemove}
              onChange={onImageChange}
              file={''}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={_cs(styles.goFileInput, className)}>
      <FileInput
        {...otherProps}
        multiple={false}
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
        value={context?.file as (File | null | undefined)}
        onChange={handleChange}
      />
      {isDefined(value) && (
        <>
          <div className={styles.previewList}>
            {/*<Preview
              id={value as number}
              file={fileIdToUrlMap?.[value as number]}
              onRemoveButtonClick={handleFileRemoveButtonClick}
            />*/}
          </div>


        </>
      )}
    </div>
  );
}
export default InformalUpdateFileInput;

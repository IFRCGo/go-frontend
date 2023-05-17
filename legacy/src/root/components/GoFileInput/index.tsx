import React, { useCallback } from 'react';
import {
  _cs,
  isDefined,
} from '@togglecorp/fujs';
import {
  IoClose,
  IoDocumentTextOutline,
} from 'react-icons/io5';
import { MdDownload } from 'react-icons/md';
import { internal } from '@togglecorp/toggle-form';

import { useLazyRequest } from '#utils/restRequest';
import Button from '#components/Button';
import RawButton from '#components/RawButton';
import FileInput, {
  Props as FileInputProps
} from '#components/FileInput';
import useAlert from '#hooks/useAlert';

import styles from './styles.module.scss';

interface Option {
  id: number;
  file: string; // this is a url
}

interface PreviewProps<ID extends number> {
  id: ID,
  file?: string;
  onRemoveButtonClick?: (id: ID) => void;
}

export function Preview<ID extends number>(props: PreviewProps<ID>) {
  const {
    id,
    file,
    onRemoveButtonClick,
  } = props;

  if (!file) {
    return null;
  }

  const isPreviewable = file.match(/.(jpg|jpeg|png|gif)$/i);

  const removeButton = (
    <RawButton
      name={id}
      onClick={onRemoveButtonClick}
      className={styles.removeButton}
    >
      <IoClose />
    </RawButton>
  );

  if (!isPreviewable) {
    return (
      <div
        className={styles.noPreview}
      >
        {removeButton}
        <IoDocumentTextOutline fontSize="6rem" />
        <a
          title="Download file"
          href={file}
          className={styles.downloadLink}
        >
          <MdDownload />
        </a>
      </div>
    );
  }

  return (
    <div className={styles.preview}>
      <img
        className={styles.image}
        src={file}
      />
      {removeButton}
    </div>
  );
}

export type Props<T extends string, OMISSION extends string = never> = Omit<FileInputProps<T>, 'overrideStatus' | 'status' | 'value' | 'onChange' | 'multiple'> & Omit<{
  fileIdToUrlMap?: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  url: string;
  hidePreview?: boolean;
  hideClearButton?: boolean;
}, OMISSION> & ({
  multiple: true;
  value: number[] | undefined | null;
  onChange: (value: number[] | undefined, name: T) => void;
} | {
  multiple?: false;
  value: number | undefined | null;
  onChange: (value: number | undefined, name: T) => void;
})

function GoFileInput<T extends string>(props: Props<T>) {
  const {
    value,
    disabled,
    name,
    actions,
    fileIdToUrlMap,
    setFileIdToUrlMap,
    className,
    url,
    hidePreview,
    hideClearButton,
    ...otherProps
  } = props;

  const alert = useAlert();

  const {
    pending,
    trigger: triggerFileUpload,
    context,
  } = useLazyRequest<Option | Option[], { file: FileInputProps<T>['value'] }>({
    formData: true,
    url,
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
      const serverError = e?.value?.formErrors as {
        file: string,
        [internal]: string,
      } | undefined;
      const message = `Failed to upload the file! ${serverError?.file ?? serverError?.[internal] ?? ''}`;
      alert.show(
        message,
        { variant: 'danger' },
      );
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

  let hasSelection = false;

  if (!value) {
    hasSelection = false;
  } else if (Array.isArray(value) && value.length === 0) {
    hasSelection = false;
  } else {
    hasSelection = true;
  }

  let currentStatus;
  if (pending) {
    currentStatus = 'Uploading file(s)...';
  } else if (!value) {
    currentStatus = 'No file selected';
  } else {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        currentStatus = `${value.length} files selected`;
      }
    } else {
      currentStatus = '1 file selected';
    }
  }


  const handleClear = useCallback(() => {
    props.onChange(undefined, name);
    //eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [props.onChange, name]);

  const handleFileRemoveButtonClick = useCallback((id: number) => {
    if (props.multiple) {
      const newValue = [...(props.value ?? [])];
      const i = newValue.findIndex(f => f === id);
      if (i === -1) {
        return;
      }

      newValue.splice(i, 1);
      props.onChange(newValue, name);
    } else {
      props.onChange(undefined, name);
    }
    //eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [props.value, props.onChange, props.multiple, name]);

  if (props.multiple) {
    return (
      <div className={_cs(styles.goFileInput, className)}>
        <FileInput
          {...otherProps}
          multiple
          actions={(
            <>
              {actions}
              {!hideClearButton && hasSelection && (
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
        {!hidePreview && (
          <div className={styles.previewList}>
            {props.value?.map((fileId) => (
              <Preview
                key={fileId}
                id={fileId}
                file={fileIdToUrlMap?.[fileId]}
                onRemoveButtonClick={handleFileRemoveButtonClick}
              />
            ))}
          </div>
        )}
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
            {!hideClearButton && hasSelection && (
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
      {isDefined(value) && !hidePreview && (
        <div className={styles.previewList}>
          <Preview
            id={value as number}
            file={fileIdToUrlMap?.[value as number]}
            onRemoveButtonClick={handleFileRemoveButtonClick}
          />
        </div>
      )}
    </div>
  );
}
export default GoFileInput;

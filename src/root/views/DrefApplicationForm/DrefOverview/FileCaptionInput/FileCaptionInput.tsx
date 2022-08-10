import React from 'react';
import DREFFileInput from '#components/DREFFileInput';
import TextInput from '#components/TextInput';
import { DrefFields, FileWithCaption } from '../../common';
import { EntriesAsList, PartialForm, useFormObject } from '@togglecorp/toggle-form';
import { valueContainerCSS } from 'react-select/src/components/containers';
import { SetValueArg } from '#types/common';
import { Preview } from '#components/GoFileInput';
import { randomString, _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

type Value = PartialForm<FileWithCaption>;

interface Props<T extends string | number> {
  className?: string;
  value: Value | undefined;
  fileIdToUrlMap: Record<number, string>;
  onChange: (value: SetValueArg<Value> | undefined, name: T) => void;
  name: T;
}

function FileCaptionInput<T extends string | number>(props: Props<T>) {
  const {
    className,
    name,
    value,
    fileIdToUrlMap,
    onChange,
  } = props;

  console.warn(value, name);

  const onImageChange = useFormObject(name, onChange, {});
  const fileUrl = React.useMemo(() =>
    value?.id ? fileIdToUrlMap[value.id] : undefined
    , [value, fileIdToUrlMap]);

  console.warn(value, name);
  console.warn({ fileUrl });

  const onRemove = React.useCallback(() => {
    onChange(undefined, name);
  }, [
    onChange,
    name,
  ]);

  return (
    <div
      className={_cs(styles.imageInput, className)}
    >
      <Preview
        id={Number(randomString())}
        file={fileUrl}
        onRemoveButtonClick={onRemove}
      />
      <TextInput
        className={styles.captionInput}
        name="caption"
        value={value?.caption}
        onChange={onImageChange}
      />
    </div>
  );
}

export default FileCaptionInput;
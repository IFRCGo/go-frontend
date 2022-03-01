import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
  PartialForm,
  ArrayError,
  useFormObject,
  getErrorObject,
} from '@togglecorp/toggle-form';

import {
  SetValueArg,
} from '#types';

import TextInput from '#components/TextInput';
import { Preview } from '#components/GoFileInput';
import { FileWithCaption } from '../../common';

import styles from './styles.module.scss';

type MapType = PartialForm<FileWithCaption>;
const defaultValue: MapType = {};

interface Props {
  value: MapType;
  error: ArrayError<FileWithCaption> | undefined;
  onChange: (value: SetValueArg<MapType>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
  fileIdToUrlMap: Record<number, string>
  className?: string;
}

function MapInput(props: Props) {
  const {
    value,
    error: errorFromProps,
    onChange,
    onRemove,
    index,
    fileIdToUrlMap,
    className,
  } = props;

  const onFieldChange = useFormObject(index, onChange, defaultValue);
  const error = (value && value.client_id && errorFromProps)
    ? getErrorObject(errorFromProps?.[value.client_id])
    : undefined;

  const fileUrl = value?.id ? fileIdToUrlMap[value.id] : undefined;

  return (
    <div className={_cs(styles.mapInput, className)}>
      <Preview
        id={index}
        file={fileUrl}
        onRemoveButtonClick={onRemove}
      />
      <TextInput
        className={styles.captionInput}
        name="caption"
        value={value?.caption}
        error={error?.caption}
        onChange={onFieldChange}
      />
    </div>
  );
}

export default MapInput;

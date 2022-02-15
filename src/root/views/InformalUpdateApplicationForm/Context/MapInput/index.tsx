import React from 'react';
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
}

function MapInput(props: Props) {
  const {
    value,
    error: errorFromProps,
    onChange,
    onRemove,
    index,
    fileIdToUrlMap,
  } = props;

  const onFieldChange = useFormObject(index, onChange, defaultValue);
  const error = (value && value.clientId && errorFromProps)
    ? getErrorObject(errorFromProps?.[value.clientId])
    : undefined;

  const fileUrl = value?.file ? fileIdToUrlMap[value.file] : undefined;

  return (
    <div className={styles.mapInput}>
      <Preview
        id={index}
        file={fileUrl}
        onRemoveButtonClick={onRemove}
      />
      <TextInput
        name="caption"
        value={value?.caption}
        error={error?.caption}
        onChange={onFieldChange}
      />
    </div>
  );
}

export default MapInput;

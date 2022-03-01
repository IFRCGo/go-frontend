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

type GraphicsType = PartialForm<FileWithCaption>;
const defaultValue: GraphicsType = {};

interface Props {
  className?: string;
  value: GraphicsType;
  error: ArrayError<FileWithCaption> | undefined;
  onChange: (value: SetValueArg<GraphicsType>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
  fileIdToUrlMap: Record<number, string>
}

function GraphicsInput(props: Props) {
  const {
    value,
    error: errorFromProps,
    onChange,
    onRemove,
    index,
    className,
    fileIdToUrlMap,
  } = props;

  const onFieldChange = useFormObject(index, onChange, defaultValue);
  const error = (value && value.client_id && errorFromProps)
    ? getErrorObject(errorFromProps?.[value.client_id])
    : undefined;

  const fileUrl = value?.id ? fileIdToUrlMap[value.id] : undefined;

  return (
    <div className={_cs(styles.graphicInput, className)}>
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
        placeholder="Enter a caption"
      />
    </div>
  );
}

export default GraphicsInput;

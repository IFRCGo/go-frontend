import React from 'react';
import { IoTrash } from 'react-icons/io5';
import {
  ArrayError,
  getErrorObject,
  PartialForm,
  useFormObject,
} from '@togglecorp/toggle-form';
import { randomString } from '@togglecorp/fujs';

import Button from '#components/Button';
import TextInput from '#components/TextInput';
import { SetValueArg } from '#utils/common';

import { Reference } from '../../common';

import styles from './styles.module.scss';

const defaultReferenceValue: PartialForm<Reference> = {
  clientId: randomString(),
};

export interface Props {
  value: PartialForm<Reference>;
  error: ArrayError<Reference> | undefined;
  onChange: (value: SetValueArg<PartialForm<Reference>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
}

function ReferenceInput(props: Props) {
  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    onRemove,
  } = props;

  const onFieldChange = useFormObject(index, onChange, defaultReferenceValue);
  const error = (value && value.clientId && errorFromProps)
    ? getErrorObject(errorFromProps?.[value.clientId])
    : undefined;

  return (
    <div className={styles.partners}>
      <div className={styles.inputs}>
        <TextInput
          label="name"
          name="source"
          value={value?.source}
          onChange={onFieldChange}
          error={error?.source}
        />
        <TextInput
          label="url"
          name="url"
          value={value?.url}
          onChange={onFieldChange}
          error={error?.url}
        />
      </div>
      <Button
        name={index}
        onClick={onRemove}
        variant="action"
        disabled={index === 0}
      >
        <IoTrash />
      </Button>
    </div>
  );
}

export default ReferenceInput;

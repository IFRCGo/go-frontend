import React from 'react';
import { IoTrash } from 'react-icons/io5';
import {
  ArrayError,
  getErrorObject,
  PartialForm,
  SetValueArg,
  useFormObject,
} from '@togglecorp/toggle-form';
import { randomString } from '@togglecorp/fujs';

import Button from '#components/Button';
import TextArea from '#components/TextArea';

import { Action } from '../../../common';

import styles from './styles.module.scss';

type Value = PartialForm<Action>;

const defaultActionValue: PartialForm<Action> = {
  clientId: randomString(),
};

export interface Props {
  value: Value;
  error: ArrayError<Action> | undefined;
  onChange: (value: SetValueArg<PartialForm<Action>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
}

function Actions(props: Props) {
  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    onRemove,
  } = props;

  const onFieldChange = useFormObject(index, onChange, defaultActionValue);
  const error = (value && value.clientId && errorFromProps)
    ? getErrorObject(errorFromProps?.[value.clientId])
    : undefined;

  return (
    <div className={styles.inputs}>
      <TextArea
        label="Early Actions"
        name="early_act"
        value={value?.early_act}
        onChange={onFieldChange}
        error={error?.early_act}
      />
      <Button
        name={index}
        className={styles.removeButton}
        onClick={onRemove}
        variant="action"
        disabled={index === 0}
      >
        <IoTrash />
      </Button>
    </div>
  );
}

export default Actions;

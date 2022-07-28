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

import { Action, EapsFields } from '../../../common';

import styles from './styles.module.scss';

const defaultActionValue: PartialForm<Action> = {
  clientId: randomString(),
};

interface Props {
  value: PartialForm<Action>;
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
      <TextInput
        label="Early Actions"
        name="early_act"
        value={value.early_act}
        onChange={onFieldChange}
        error={error?.early_act}
      />
      <div>
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
    </div>
  );
}

export default Actions;

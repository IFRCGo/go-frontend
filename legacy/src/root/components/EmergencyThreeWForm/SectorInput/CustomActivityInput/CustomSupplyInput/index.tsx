import React from 'react';
import {
  PartialForm,
  ArrayError,
  useFormObject,
  getErrorObject,
} from '@togglecorp/toggle-form';
import { IoTrash } from 'react-icons/io5';

import { SetValueArg } from '#utils/common';
import {
  CustomSupply,
} from '../../../useEmergencyThreeWOptions';

import Button from '#components/Button';
import NumberInput from '#components/NumberInput';
import TextInput from '#components/TextInput';

import styles from './styles.module.scss';

type Value = PartialForm<CustomSupply>;
const defaultValue: Value = {};

interface Props {
  onChange: (value: SetValueArg<Value>, index: number) => void;
  index: number;
  value: Value;
  error: ArrayError<CustomSupply> | undefined;
  onRemove: (index: number) => void;
}

function CustomSupplyInput(props: Props) {
  const {
    index,
    value,
    onChange,
    error: errorFromProps,
    onRemove,
  } = props;

  const setFieldValue = useFormObject(index, onChange, defaultValue);
  const error = (value && value.client_id && errorFromProps)
    ? getErrorObject(errorFromProps[value.client_id])
    : undefined;

  return (
    <div className={styles.customSupplyInput}>
      <TextInput
        className={styles.item}
        name={"item" as const}
        label="Item"
        value={value?.item}
        onChange={setFieldValue}
        error={error?.item}
      />
      <NumberInput
        className={styles.count}
        name="count"
        label="Count"
        value={value?.count}
        onChange={setFieldValue}
        error={error?.count}
      />
      <Button
        className={styles.removeButton}
        name={index}
        onClick={onRemove}
        variant="action"
      >
        <IoTrash />
      </Button>
    </div>
  );
}

export default CustomSupplyInput;

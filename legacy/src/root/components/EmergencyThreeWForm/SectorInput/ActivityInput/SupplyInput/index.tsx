import React from 'react';
import {
  PartialForm,
  ArrayError,
  useFormObject,
  getErrorObject,
} from '@togglecorp/toggle-form';
import { IoTrash } from 'react-icons/io5';

import { SetValueArg } from '#utils/common';
import { NumericValueOption } from '#types';
import {
  Supply,
} from '../../../useEmergencyThreeWOptions';

import Button from '#components/Button';
import NumberInput from '#components/NumberInput';
import SelectInput from '#components/SelectInput';

import styles from './styles.module.scss';

type Value = PartialForm<Supply>;
const defaultValue: Value = {};

interface Props {
  supplyOptions: NumericValueOption[];
  onChange: (value: SetValueArg<Value>, index: number) => void;
  index: number;
  value: Value;
  error: ArrayError<Supply> | undefined;
  onRemove: (index: number) => void;
}

function SupplyInput(props: Props) {
  const {
    index,
    value,
    onChange,
    error: errorFromProps,
    supplyOptions,
    onRemove,
  } = props;

  const setFieldValue = useFormObject(index, onChange, defaultValue);
  const error = (value && value.item && errorFromProps)
    ? getErrorObject(errorFromProps[value.item])
    : undefined;

  return (
    <div className={styles.supplyInput}>
      <SelectInput
        className={styles.item}
        name={"item" as const}
        label="Item"
        value={value?.item}
        onChange={setFieldValue}
        error={error?.item}
        options={supplyOptions}
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

export default SupplyInput;

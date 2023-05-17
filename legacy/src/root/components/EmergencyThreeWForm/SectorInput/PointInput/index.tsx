import React from 'react';
import {
  PartialForm,
  ArrayError,
  useFormObject,
  getErrorObject,
} from '@togglecorp/toggle-form';
import { IoTrash } from 'react-icons/io5';

import { SetValueArg } from '#utils/common';
import { Point } from '../../useEmergencyThreeWOptions';

import Button from '#components/Button';
import NumberInput from '#components/NumberInput';
import TextInput from '#components/TextInput';

import styles from './styles.module.scss';

type Value = PartialForm<Point>;
const defaultValue: Value = {};

interface Props {
  onChange: (value: SetValueArg<Value>, index: number) => void;
  index: number;
  value: Value;
  error: ArrayError<Point> | undefined;
  onRemove: (index: number) => void;
}

function PointInput(props: Props) {
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
    <div className={styles.pointInput}>
      <TextInput
        className={styles.descriptionInput}
        label="Description"
        name="description"
        value={value?.description}
        error={error?.description}
        onChange={setFieldValue}
      />
      <NumberInput
        className={styles.locationInput}
        label="Latitude"
        name="latitude"
        value={value?.latitude}
        error={error?.latitude}
        onChange={setFieldValue}
      />
      <NumberInput
        className={styles.locationInput}
        label="Longitude"
        name="longitude"
        value={value?.longitude}
        error={error?.longitude}
        onChange={setFieldValue}
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

export default PointInput;

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

import { EapsFields, Risk } from '../../../common';

import styles from './styles.module.scss';

type Value = PartialForm<EapsFields>;
type SetValueArg<T> = T | ((value: T) => T);

const defaultRiskValue: PartialForm<Risk> = {
  clientId: randomString(),
};

interface Props {
  value: PartialForm<Risk>;
  error: ArrayError<Risk> | undefined;
  onChange: (value: SetValueArg<PartialForm<Risk>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
}

function Risks(props: Props) {

  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    onRemove,
  } = props;


  const onFieldChange = useFormObject(index, onChange, defaultRiskValue);
  const error = (value && value.clientId && errorFromProps)
    ? getErrorObject(errorFromProps?.[value.clientId])
    : undefined;

  return (
    <div className={styles.inputs}>
      <TextInput
        label="Priortised risk"
        name="prioritized_risks"
        value={value?.risks}
        onChange={onFieldChange}
        error={error?.risks}
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

export default Risks;

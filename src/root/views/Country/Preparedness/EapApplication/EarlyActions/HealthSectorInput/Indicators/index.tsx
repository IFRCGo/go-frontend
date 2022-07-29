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
import SelectInput from '#components/SelectInput';

import {
  Indicator,
  StringValueOption,
} from '../../../common';

import styles from './styles.module.scss';

type Value = PartialForm<Indicator>;

type SetValueArg<T> = T | ((value: T) => T);
const defaultIndicatorsValue: PartialForm<Indicator> = {
  clientId: randomString(),
};

interface Props {
  value: Value;
  error: ArrayError<Indicator> | undefined;
  onChange: (value: SetValueArg<PartialForm<Indicator>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
  earlyActionIndicatorsOptions: StringValueOption[];
}

function Indicators(props: Props) {

  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    onRemove,
    earlyActionIndicatorsOptions,
  } = props;

  const onFieldChange = useFormObject(index, onChange, defaultIndicatorsValue);
  const error = (value && value.clientId && errorFromProps)
    ? getErrorObject(errorFromProps?.[value.clientId])
    : undefined;

  return (
    <div className={styles.partners}>
      <div className={styles.inputs}>
        <SelectInput
          label="Indicators"
          name={"indicator" as const}
          value={value?.indicator}
          onChange={onFieldChange}
          error={error?.indicator}
          options={earlyActionIndicatorsOptions}
        />
        <TextInput
          label="Indicator Value"
          name={"indicator_value"}
          value={value?.indicator_value}
          onChange={onFieldChange}
          error={error?.indicator_value}
        />
      </div>
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

export default Indicators;

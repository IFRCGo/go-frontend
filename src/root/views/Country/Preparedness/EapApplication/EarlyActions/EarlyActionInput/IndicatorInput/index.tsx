import React from 'react';
import { IoTrash } from 'react-icons/io5';
import {
  ArrayError,
  getErrorObject,
  PartialForm,
  SetValueArg,
  useFormObject,
} from '@togglecorp/toggle-form';
import { listToMap, randomString } from '@togglecorp/fujs';

import Button from '#components/Button';
import TextInput from '#components/TextInput';
import SelectInput from '#components/SelectInput';

import {
  Indicator,
  StringValueOption,
} from '../../../common';

import styles from './styles.module.scss';

type Value = PartialForm<Indicator>;

const defaultIndicatorsValue: PartialForm<Indicator> = {
  clientId: randomString(),
};

export interface Props {
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

  const indicatorOptionMap = React.useMemo(() => (
    listToMap(
      earlyActionIndicatorsOptions,
      d => d.value ?? '',
      d => true,
    )
  ), [earlyActionIndicatorsOptions]);

  const filteredIndicatorOptions = indicatorOptionMap
    ? earlyActionIndicatorsOptions.filter(n => indicatorOptionMap[n.value])
    : [];

  return (
    <div className={styles.partners}>
      <div className={styles.inputs}>
        <SelectInput
          label="Indicators"
          name={"indicator" as const}
          value={value?.indicator}
          onChange={onFieldChange}
          error={error?.indicator}
          options={filteredIndicatorOptions}
        />
        <TextInput
          label="Indicator Value"
          name={"indicator_value"}
          value={value?.indicator_value}
          onChange={onFieldChange}
          error={error?.indicator_value}
        />
      </div>
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

export default Indicators;

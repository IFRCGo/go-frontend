import Button from '#components/Button';
import InputSection from '#components/InputSection';
import NumberInput from '#components/NumberInput';
import TextInput from '#components/TextInput';
import languageContext from '#root/languageContext';
import { SetValueArg } from '#utils/common';
import { Indicator, StringValueOption } from '#views/DrefApplicationForm/common';
import { randomString } from '@togglecorp/fujs';
import { ArrayError, getErrorObject, PartialForm, useFormObject } from '@togglecorp/toggle-form';
import React from 'react';
import { IoTrash } from 'react-icons/io5';
import styles from './styles.module.scss';


const defaultIndicatorValue: PartialForm<Indicator> = {
  clientId: randomString(),
};

interface Props {
  value: PartialForm<Indicator>;
  error: ArrayError<Indicator> | undefined;
  onChange: (value: SetValueArg<PartialForm<Indicator>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
  showActualFieldOperational?: boolean;
}

function IndicatorInput(props: Props) {
  const { strings } = React.useContext(languageContext);

  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    onRemove,
    showActualFieldOperational,
  } = props;

  const onFieldChange = useFormObject(index, onChange, defaultIndicatorValue);
  const error = (value && value.clientId && errorFromProps)
    ? getErrorObject(errorFromProps?.[value.clientId])
    : undefined;

  return (
    <div className={styles.indicator}>
      <TextInput
        label="Title"
        name="title"
        value={value.title}
        onChange={onFieldChange}
        error={error?.title}
      />
      <NumberInput
        label="Target"
        name="target"
        value={value.target}
        onChange={onFieldChange}
        error={error?.target}
      />
      {
        showActualFieldOperational && (
          <NumberInput
            label="Actual"
            name="actual"
            value={value.actual}
            onChange={onFieldChange}
            error={error?.actual}
          />
        )
      }
      <Button
        name={index}
        onClick={onRemove}
        variant="action"
      >
        <IoTrash />
      </Button>
    </div>
  );
}

export default IndicatorInput;

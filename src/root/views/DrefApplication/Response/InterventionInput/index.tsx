import React from 'react';
import { randomString } from '@togglecorp/fujs';
import {
  PartialForm,
  ArrayError,
  useFormObject,
} from '@togglecorp/toggle-form';

import {
  Intervention,
  StringValueOption,
} from '../../common';

import TextArea from '#components/TextArea';
import NumberInput from '#components/NumberInput';
import InputSection from '#components/InputSection';

type SetValueArg<T> = T | ((value: T) => T);

const defaultInterventionValue: PartialForm<Intervention> = {
  clientId: randomString(),
};

interface Props {
  value: PartialForm<Intervention>;
  error: ArrayError<Intervention> | undefined;
  onChange: (value: SetValueArg<PartialForm<Intervention>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
  interventionOptions: StringValueOption[];
}

function InterventionInput(props: Props) {
  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    interventionOptions,
  } = props;

  const interventionLabel = React.useMemo(() => (
    interventionOptions.find(n => n.value === value.title)?.label
  ), [interventionOptions, value]);

  const onFieldChange = useFormObject(index, onChange, defaultInterventionValue);
  const error = (value && value.clientId && errorFromProps)
    ? errorFromProps.members?.[value.clientId]
    : undefined;

  return (
    <InputSection
      title={interventionLabel}
      multiRow
      twoColumn
    >
      <NumberInput
        label="Budget"
        name="budget"
        value={value.budget}
        onChange={onFieldChange}
        error={error?.fields?.budget}
      />
      <NumberInput
        label="Persons Targeted"
        name="persons_targeted"
        value={value.persons_targeted}
        onChange={onFieldChange}
        error={error?.fields?.budget}
      />
      <TextArea
        label="Description"
        name="description"
        value={value.description}
        onChange={onFieldChange}
        error={error?.fields?.description}
      />
    </InputSection>
  );
}

export default InterventionInput;

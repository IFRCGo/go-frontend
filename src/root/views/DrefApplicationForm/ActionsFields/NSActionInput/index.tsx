import React from 'react';
import { randomString } from '@togglecorp/fujs';
import {
  PartialForm,
  ArrayError,
  useFormObject,
} from '@togglecorp/toggle-form';

import TextArea from '#components/TextArea';
import InputSection from '#components/InputSection';

import {
  NsAction,
  StringValueOption,
} from '../../common';

type SetValueArg<T> = T | ((value: T) => T);

const defaultNsActionValue: PartialForm<NsAction> = {
  clientId: randomString(),
};

interface Props {
  value: PartialForm<NsAction>;
  error: ArrayError<NsAction> | undefined;
  onChange: (value: SetValueArg<PartialForm<NsAction>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
  nsActionOptions: StringValueOption[];
}

function NsActionInput(props: Props) {
  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    nsActionOptions,
  } = props;

  const nsActionLabel = React.useMemo(() => (
    nsActionOptions.find(n => n.value === value.title)?.label
  ), [nsActionOptions, value]);

  const onFieldChange = useFormObject(index, onChange, defaultNsActionValue);
  const error = (value && value.clientId && errorFromProps)
    ? errorFromProps.members?.[value.clientId]
    : undefined;

  return (
    <InputSection
      title={nsActionLabel}
    >
      <TextArea
        name="description"
        value={value.description}
        onChange={onFieldChange}
        error={error?.fields?.description}
      />
    </InputSection>
  );
}

export default NsActionInput;

import React from 'react';
import { randomString } from '@togglecorp/fujs';
import {
  PartialForm,
  ArrayError,
  useFormObject,
} from '@togglecorp/toggle-form';
import { IoTrash } from 'react-icons/io5';

import TextArea from '#components/TextArea';
import Button from '#components/Button';
import InputSection from '#components/InputSection';

import {
  Need,
  StringValueOption,
} from '../../common';

import styles from './styles.module.scss';

type SetValueArg<T> = T | ((value: T) => T);

const defaultNeedValue: PartialForm<Need> = {
  clientId: randomString(),
};

interface Props {
  value: PartialForm<Need>;
  error: ArrayError<Need> | undefined;
  onChange: (value: SetValueArg<PartialForm<Need>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
  needOptions: StringValueOption[];
}

function NeedInput(props: Props) {
  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    needOptions,
    onRemove,
  } = props;

  const needLabel = React.useMemo(() => (
    needOptions.find(n => n.value === value.title)?.label
  ), [needOptions, value]);

  const onFieldChange = useFormObject(index, onChange, defaultNeedValue);
  const error = (value && value.clientId && errorFromProps)
    ? errorFromProps.members?.[value.clientId]
    : undefined;

  return (
    <InputSection
      title={needLabel}
      contentSectionClassName={styles.content}
    >
      <TextArea
        name="description"
        value={value.description}
        onChange={onFieldChange}
        error={error?.fields?.description}
      />
      <Button
        className={styles.removeButton}
        name={index}
        onClick={onRemove}
        variant="action"
      >
        <IoTrash />
      </Button>
    </InputSection>
  );
}

export default NeedInput;

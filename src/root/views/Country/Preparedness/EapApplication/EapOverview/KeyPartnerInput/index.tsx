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
import { SetValueArg } from '#utils/common';

import { KeyPartner } from '../../common';

import styles from './styles.module.scss';

const defaultKeyPartnersValue: PartialForm<KeyPartner> = {
  clientId: randomString(),
};

export interface Props {
  value: PartialForm<KeyPartner>;
  error: ArrayError<KeyPartner> | undefined;
  onChange: (value: SetValueArg<PartialForm<KeyPartner>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
}

function KeyPartnerInput(props: Props) {
  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    onRemove,
  } = props;

  const onFieldChange = useFormObject(index, onChange, defaultKeyPartnersValue);
  const error = (value && value.clientId && errorFromProps)
    ? getErrorObject(errorFromProps?.[value.clientId])
    : undefined;

  return (
    <div className={styles.partners}>
      <div className={styles.inputs}>
        <TextInput
          label="name"
          name="name"
          value={value?.name}
          onChange={onFieldChange}
          error={error?.name}
        />
        <TextInput
          label="url"
          name="url"
          value={value?.url}
          onChange={onFieldChange}
          error={error?.url}
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

export default KeyPartnerInput;

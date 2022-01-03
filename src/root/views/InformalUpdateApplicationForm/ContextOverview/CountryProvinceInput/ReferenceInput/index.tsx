import React, { useContext } from 'react';
import { PartialForm, ArrayError, useFormObject } from '@togglecorp/toggle-form';
import { IoTrash } from 'react-icons/io5';
import { MdModeEditOutline } from 'react-icons/md';

import Button from '#components/Button';
import DateInput from '#components/DateInput';
import InputSection from '#components/InputSection';
import TextInput from '#components/TextInput';
import languageContext from '#root/languageContext';
import { ReferenceData } from '#views/InformalUpdateApplicationForm/common';
import { ReferenceType } from '#views/InformalUpdateApplicationForm/useInformalUpdateFormOptions';

import styles from './styles.module.scss';

type SetValueArg<T> = T | ((value: T) => T);
const defaultFormValues: PartialForm<ReferenceData> = {
  clientId: 'test',
};

interface Props {
  value: PartialForm<ReferenceType>;
  error: ArrayError<ReferenceType> | undefined;
  onChange: (value: SetValueArg<PartialForm<ReferenceData>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
}

function ReferenceInput(props: Props) {
  const { strings } = useContext(languageContext);
  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    onRemove,
  } = props;

  const onValueChange = useFormObject(index, onChange, defaultFormValues);

  const error = (value && value.clientId && errorFromProps)
    ? errorFromProps.members?.[value.clientId]
    : undefined;

  return (
    <InputSection
      className={styles.referenceEdit}
    >
      <DateInput
        className={styles.inputDate}
        name="reference_date"
        value={value.reference_date}
        onChange={onValueChange}
        error={error?.fields?.reference_date}
      />
      <TextInput
        className={styles.inputName}
        name="reference_name"
        value={value.reference_name}
        onChange={onValueChange}
        error={error?.fields?.reference_name}
        readOnly={true}
      />
      <TextInput
        className={styles.inputUrl}
        name="reference_url"
        value={value.reference_url}
        onChange={onValueChange}
        error={error?.fields?.reference_url}
      />
      <div className={styles.inputButton}>
        <Button
          className={styles.removeButton}
          name={index}
          onClick={onRemove}
          variant="action"
        // disabled={index === 0}
        >
          <MdModeEditOutline />
        </Button>
        <Button
          className={styles.removeButton}
          name={index}
          onClick={onRemove}
          variant="action"
        // disabled={index === 0}
        >
          <IoTrash />
        </Button>
      </div>

    </InputSection>
  );
}

export default ReferenceInput;

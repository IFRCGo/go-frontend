import React from 'react';
import {
  randomString,
} from '@togglecorp/fujs';
import {
  PartialForm,
  ArrayError,
  useFormObject,
} from '@togglecorp/toggle-form';
import { IoTrash } from 'react-icons/io5';

import TextArea from '#components/TextArea';
import BulletTextArea from '#components/BulletTextArea';
import Button from '#components/Button';
import NumberInput from '#components/NumberInput';
import InputSection from '#components/InputSection';
import LanguageContext from '#root/languageContext';

import {
  Intervention,
  StringValueOption,
} from '../../common';


import styles from './styles.module.scss';

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
  const { strings } = React.useContext(LanguageContext);

  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    interventionOptions,
    onRemove,
  } = props;

  const interventionLabel = React.useMemo(() => (
    interventionOptions.find(n => n.value === value.title)?.label
  ), [interventionOptions, value]);

  const onFieldChange = useFormObject(index, onChange, defaultInterventionValue);
  const error = (value && value.clientId && errorFromProps)
    ? errorFromProps.members?.[value.clientId]
    : undefined;

  return (
    <div className={styles.interventionInput}>
      <InputSection
        className={styles.inputSection}
        title={interventionLabel}
        multiRow
        twoColumn
        normalDescription
        description={(
          <>
            <NumberInput
              label="Budget"
              name="budget"
              value={value.budget}
              onChange={onFieldChange}
              error={error?.fields?.budget}
            />
            <NumberInput
              label="Persons Targeted"
              name="person_targeted"
              value={value.person_targeted}
              onChange={onFieldChange}
              error={error?.fields?.person_targeted}
            />
          </>
        )}
      >
        <TextArea
          label="Indicator"
          name="indicator"
          value={value.indicator}
          onChange={onFieldChange}
          error={error?.fields?.indicator}
        />
        <BulletTextArea
          label={strings.drefFormListOfActivities}
          name="description"
          value={value.description}
          onChange={onFieldChange}
          error={error?.fields?.description}
        />
      </InputSection>
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

export default InterventionInput;

import React from 'react';
import { isNotDefined, randomString, _cs } from '@togglecorp/fujs';
import {
  PartialForm,
  useForm,
  SetValueArg,
  useFormObject,
} from '@togglecorp/toggle-form';

import usePerProcessOptions from '../../usePerProcessOptions';
import { assessmentSchema } from '#views/PerProcess/usePerProcessOptions';
import {
  booleanOptionKeySelector,
  optionLabelSelector,
  PerAssessmentForm,
} from '../../common';
import Container from '#components/Container';
import TextArea from '#components/TextArea';
import RadioInput from '#components/RadioInput';

import styles from './styles.module.scss';

// type SetValueArg<T> = T | ((value: T) => T);

type Value = PerAssessmentForm;
type InputValue = PartialForm<Value>;

interface Props {
  className?: string;
  name: string | number | undefined;
  onChange: (value: SetValueArg<InputValue>, index: number) => void;
  // onRemove: (index: number) => void;
  index: number;
  value: InputValue | undefined | null;
  // error: ArrayError<PerAssessmentForm> | undefined;
}

function QuestionInput(props: Props) {
  const {
    className,
    name,
    // error: errorFromProps,
    onChange,
    // onRemove,
    index,
    value,
  } = props;

  const {
    yesNoOptions,
  } = usePerProcessOptions(value);

  const {
    value: initialValue,
    setFieldValue: onValueChange,
  } = useForm(
    assessmentSchema,
    { value: {} }
  );
  const onFieldChange = useFormObject(index, onChange, () => ({ benchmark_id: index }));

  return (
    <>
      <Container
        className={styles.inputSection}
        contentClassName={styles.questionContent}
        description={value?.question}
      >
        <TextArea
          className={styles.noteSection}
          label='Notes'
          name="description"
          value={value?.description}
          placeholder="This is placeholder"
          onChange={onFieldChange}
          rows={2}
        />
        <div className={styles.answers}>
          <RadioInput
            name="answer"
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value?.answer}
            onChange={onFieldChange}
          />
        </div>
      </Container>
    </>
  );
}

export default QuestionInput;

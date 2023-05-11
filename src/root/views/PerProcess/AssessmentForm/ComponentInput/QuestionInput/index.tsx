import React from 'react';

import { isNotDefined } from '@togglecorp/fujs';
import { useRequest } from '@togglecorp/toggle-request';
import { PartialForm, SetBaseValueArg, useForm } from '@togglecorp/toggle-form';

import { ListResponse } from '#utils/restRequest';
import { Assessment, booleanOptionKeySelector, optionLabelSelector, perAssessmentFields, PerOverviewFields } from '#views/PerProcess/common';
import usePerProcessOptions, { assessmentSchema } from '../../../usePerProcessOptions';
import Container from '#components/Container';
import RadioInput from '#components/RadioInput';
import TextArea from '#components/TextArea';

import styles from './styles.module.scss';

type Value = PartialForm<Assessment>;

interface Props {
  id: string;
  onValueSet: (value: SetBaseValueArg<Value>) => void;
  index: string;
}

function QuestionInput(props: Props) {
  const {
    id,
    index,
    onValueSet,
  } = props;

  const {
    value,
    error: formError,
    validate,
    setFieldValue: onValueChange,
    setError: onErrorSet,
  } = useForm(assessmentSchema, { value: {} as PartialForm<Assessment> });

  const {
    yesNoOptions,
  } = usePerProcessOptions(value);

  console.log('value', value);

  const {
    pending: fetchingComponents,
    response: questionResponse,
  } = useRequest<ListResponse<Assessment>, unknown, {}>({
    skip: isNotDefined(id),
    url: `api/v2/per-formquestion/?component=${id}`,
  });

  // const handleSubmit = React.useCallback((finalValues) => {
  //   onValueSet(finalValues);
  //   submitRequest(finalValues);
  // }, [onValueSet, submitRequest]);

  return (
    <>
      {questionResponse?.results.map((question, i) => (
        <>
          <div className={styles.dot} />
          <div className={styles.dotConnector}>
            <Container
              description={
                `${question?.component?.component_num}. ${i + 1} ${question?.question}`
              }
              className={styles.inputSection}
              contentClassName={styles.questionContent}
            >
              <TextArea
                key={question.id}
                id={question.id}
                className={styles.noteSection}
                label='Notes'
                name='description'
                value={value?.description}
                onChange={onValueChange}
                placeholder={undefined}
                error={undefined}
                rows={2}
              />
              <div className={styles.answers}>
                <RadioInput
                  name={"is_benchmark" as const}
                  options={yesNoOptions}
                  keySelector={booleanOptionKeySelector}
                  labelSelector={optionLabelSelector}
                  value={value?.is_benchmark}
                  onChange={onValueChange}
                />
              </div>
            </Container>
          </div>
        </>
      ))}
      <TextArea
        name={undefined} value={undefined}>
      </TextArea>
    </>
  );
}

export default QuestionInput;
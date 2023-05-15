import React from 'react';

import { isNotDefined } from '@togglecorp/fujs';
import { useRequest } from '@togglecorp/toggle-request';
import { EntriesAsList, PartialForm } from '@togglecorp/toggle-form';

import { ListResponse } from '#utils/restRequest';
import { booleanOptionKeySelector, emptyNumericOptionList, optionLabelSelector, PerAssessmentForm, PerFormAnswer, PerOverviewFields } from '#views/PerProcess/common';
import usePerProcessOptions from '../../../usePerProcessOptions';
import Container from '#components/Container';
import RadioInput from '#components/RadioInput';
import TextArea from '#components/TextArea';

import styles from './styles.module.scss';

type Value = PartialForm<PerAssessmentForm>;

interface Props {
  id: string;
  value: Value;
}

function QuestionInput(props: Props) {
  const {
    id,
    value,
  } = props;

  const {
    yesNoOptions,
  } = usePerProcessOptions(value);

  console.log('value', value);

  const {
    pending: fetchingComponents,
    response: questionResponse,
  } = useRequest<ListResponse<PerAssessmentForm>, unknown, {}>({
    skip: isNotDefined(id),
    url: `api/v2/per-formquestion/?component=${id}`,
  });

  // const {
  //   pending: fetchingAnswer,
  //   response: answerResponse,
  // } = useRequest<ListResponse<PerFormAnswer>, unknown, {}>({
  //   url: `api/v2/per-formanswer/`
  // });

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
                `${question?.question_num}. ${i + 1} ${question?.question}`
              }
              className={styles.inputSection}
              contentClassName={styles.questionContent}
            >
              <TextArea
                className={styles.noteSection}
                label='Notes'
                name={value?.description}
                value={value?.description}
                placeholder={undefined}
                rows={2}
              />
              <div className={styles.answers}>
                <RadioInput
                  name={"status" as const}
                  options={yesNoOptions}
                  keySelector={booleanOptionKeySelector}
                  labelSelector={optionLabelSelector}
                  value={value}
                  onChange={undefined}
                />
              </div>
            </Container>
          </div>
        </>
      ))}
      <TextArea
        name={undefined}
        value={undefined}
      >
      </TextArea>
    </>
  );
}

export default QuestionInput;

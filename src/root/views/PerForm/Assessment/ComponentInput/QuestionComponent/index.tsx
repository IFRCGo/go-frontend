import React from 'react';
import Container from '#components/Container';
import { ListResponse } from '#utils/restRequest';
import { ComponentQuestion, PerOverviewFields } from '#views/PerForm/common';
import { isNotDefined } from '@togglecorp/fujs';
import { EntriesAsList, PartialForm } from '@togglecorp/toggle-form';
import { useRequest } from '@togglecorp/toggle-request';
import styles from './styles.module.scss';
import TextArea from '#components/TextArea';

type Value = PartialForm<PerOverviewFields>;

interface Props {
  id: string;
  value?: Value;
  onValueChange?: (...entries: EntriesAsList<Value>) => void;
  index: number;
}

function QuestionComponent(props: Props) {
  const {
    id,
    index,
    value,
    onValueChange,
  } = props;

  console.log('value', value);

  const {
    pending: fetchingComponents,
    response: questionResponse,
  } = useRequest<ListResponse<ComponentQuestion>, unknown, {}>({
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
              <div className={styles.answers}
              >
                <label>
                  <input
                    type='radio'
                    name='yes-no-na'
                    value='no'
                  />
                  Yes
                </label>
                <label>
                  <input
                    type='radio'
                    name='yes-no-na'
                    value='no'
                  />
                  No
                </label>
                <label>
                  <input
                    type='radio'
                    name='yes-no-na'
                    value='no'
                  />
                  Not Revised
                </label>
              </div>
            </Container>
          </div>
        </>
      ))}
    </>
  );
}

export default QuestionComponent;
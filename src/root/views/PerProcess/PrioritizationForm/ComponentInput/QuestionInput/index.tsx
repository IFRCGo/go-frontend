import React from 'react';
import { useRequest } from '@togglecorp/toggle-request';
import { isNotDefined } from '@togglecorp/fujs';
import { EntriesAsList, PartialForm } from '@togglecorp/toggle-form';

import { ListResponse } from '#utils/restRequest';
import { Assessment, PerOverviewFields } from '#views/PerProcess/common';
import Container from '#components/Container';

import styles from './styles.module.scss';

type Value = PartialForm<PerOverviewFields>;

interface Props {
  id: string;
  value?: Value;
  onValueChange?: (...entries: EntriesAsList<Value>) => void;
  index: number;
}

function QuestionInput(props: Props) {
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
        <Container
          description={` ${i + 1} ${question.question}`}
          className={styles.inputSection}
          contentClassName={styles.questionContent}
        >
        </Container>
      ))}
    </>
  );
}

export default QuestionInput;
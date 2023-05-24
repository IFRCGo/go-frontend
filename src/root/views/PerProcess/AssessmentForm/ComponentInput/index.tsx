import React from 'react';

import { ListResponse, useRequest } from '#utils/restRequest';
import ExpandableContainer from '#components/ExpandableContainer';
import SelectInput from '#components/SelectInput';
import {
  StringValueOption,
} from '#types';
import {
  PerAssessmentForm,
} from '../../common';

import styles from './styles.module.scss';
import { assessmentSchema } from '#views/PerProcess/usePerProcessOptions';
import { PartialForm, SetValueArg, useForm, useFormArray, useFormObject } from '@togglecorp/toggle-form';
import QuestionInput from '../QuestionInput';

type Value = PartialForm<PerAssessmentForm>;

interface Props {
  className?: string;
  // error: ArrayError<Value> | undefined;
  onChange: (value: SetValueArg<Value>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
  value: Value;
  areaId: number;
  componentId: number | string;
  formStatusOptions: StringValueOption[];
}
const defaultComponentValue: Value = {};

function ComponentsInput(props: Props) {
  const {
    onChange,
    value,
    onRemove,
    areaId,
    componentId,
    index,
    // error,
    formStatusOptions,
  } = props;

  const {
    response: questionResponse,
  } = useRequest<ListResponse<PerAssessmentForm>>({
    url: `api/v2/per-formquestion/`,
    query: {
      area_id: areaId,
      component: componentId,
    },
  });

  const onFieldChange = useFormObject(index, onChange, defaultComponentValue);

  const {
    setValue: setBenchmarkValue,
    // removeValue: removeBenchmarkValue,
  } = useFormArray('component_responses', onFieldChange);

  const {
    value: initialValue,
    setFieldValue,
  } = useForm(assessmentSchema, { value: {} as PartialForm<PerAssessmentForm> });

  console.warn('status', initialValue);

  return (
    <>
      <ExpandableContainer
        heading={`Component ${index + 1}: ${value?.title}`}
        headingSize='small'
        sub
        actions={
          <SelectInput
            className={styles.improvementSelect}
            name='status'
            options={formStatusOptions}
            onChange={setFieldValue}
            value={initialValue?.status}
          />
        }
      >
        {questionResponse?.results.map((q, i) => (
          <QuestionInput
            index={i}
            value={q}
            key={q.id}
            onChange={setBenchmarkValue}
          // onRemove={removeBenchmarkValue}
          />
        ))}
        {/* <div className={styles.dot} /> */}
      </ExpandableContainer>
    </>
  );
}
export default ComponentsInput;
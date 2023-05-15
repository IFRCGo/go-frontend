import React from 'react';
import { isNotDefined, randomString, _cs } from '@togglecorp/fujs';
import { PartialForm, ArrayError, useFormObject, getErrorObject, useFormArray, useForm } from '@togglecorp/toggle-form';

import { compareString } from '#utils/utils';
import { ListResponse, useRequest } from '#utils/restRequest';
import ExpandableContainer from '#components/ExpandableContainer';
import SelectInput from '#components/SelectInput';
import QuestionInput from './QuestionInput';

import {
  emptyNumericOptionList,
  Component,
  PerAssessmentForm,
} from '../../common';

import styles from './styles.module.scss';
import { assessmentSchema } from '#views/PerProcess/usePerProcessOptions';

type SetValueArg<T> = T | ((value: T) => T);

type Value = PartialForm<PerAssessmentForm>;

const defaultComponentValue: PartialForm<PerAssessmentForm> = {
  id: randomString(),
};

interface Props {
  className?: string;
  id: string;
  error: ArrayError<PerAssessmentForm> | undefined;
  onChange: (value: SetValueArg<PartialForm<PerAssessmentForm>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
}

function ComponentsInput(props: Props) {
  const {
    className,
    id,
    error: errorFromProps,
    onChange,
    onRemove,
    index,
  } = props;

  const {
    value,
    setFieldValue,
  } = useForm(
    assessmentSchema,
    { value: {} }
  );

  const {
    pending: fetchingComponents,
    response: componentResponse,
  } = useRequest<ListResponse<Component>>({
    skip: isNotDefined(id),
    url: `api/v2/per-formcomponent/?area_id=${id}`,
  });

  const {
    pending: fetchingFormStatus,
    response: formStatusResponse,
  } = useRequest<ListResponse<PerAssessmentForm>>({
    url: `api/v2/per-options/`,
  });


  const onFieldChange = useFormObject(index, onChange, defaultComponentValue);
  const error = (value && value.id && errorFromProps)
    ? getErrorObject(errorFromProps?.[value.id])
    : undefined;

  const {
    setValue: setBenchmarkValue,
    removeValue: removeBenchmarkValue,
  } = useFormArray('benchmark', setFieldValue);

  return (
    <>
      {
        componentResponse?.results.map((component) => (
          <ExpandableContainer
            className={_cs(styles.customActivity, styles.errored)}
            componentRef={undefined}
            heading={`Component ${component.component_num} : ${component.title}`}
            // actionsContainerClassName={styles}
            headingSize='small'
            sub
            actions={
              <SelectInput
                className={styles.improvementSelect}
                name={undefined}
                onChange={onFieldChange}
                options={undefined}
                value={undefined}
              />
            }
          >
            <QuestionInput
              key={component.id}
              id={component.id}
              onChange={setBenchmarkValue}
              onRemove={removeBenchmarkValue}
              value={value}
            />
            <div className={styles.dot} />
          </ExpandableContainer>
        ))
      }
    </>
  );
}

export default ComponentsInput;

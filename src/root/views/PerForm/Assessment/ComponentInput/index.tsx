import React from 'react';
import { isNotDefined, _cs } from '@togglecorp/fujs';
import { useForm, PartialForm, SetBaseValueArg } from '@togglecorp/toggle-form';

import { compareString } from '#utils/utils';
import { ListResponse, useRequest } from '#utils/restRequest';
import ExpandableContainer from '#components/ExpandableContainer';
import SelectInput from '#components/SelectInput';

import {
  PerOverviewFields,
  FormComponentStatus,
  emptyNumericOptionList,
  Component,
} from '../../common';
import QuestionComponent from './QuestionComponent';

import styles from './styles.module.scss';
import { assessmentSchema } from '#views/PerForm/usePerFormOptions';

type Value = PartialForm<PerOverviewFields>;

interface Props {
  className?: string;
  onValueSet: (value: SetBaseValueArg<Value>) => void;
  id?: string;
}

function ComponentsInput(props: Props) {
  const {
    className,
    onValueSet,
    id,
  } = props;

  const {
    value,
    setFieldValue: onValueChange,
    setError: onErrorSet,
  } = useForm(assessmentSchema, { value: {} as PartialForm<PerOverviewFields> });

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
  } = useRequest<ListResponse<FormComponentStatus>>({
    url: `api/v2/per-options/`,
  });

  const formStatusOptions = React.useMemo(() => (
    formStatusResponse?.results?.map(d => ({
      value: d.key,
      label: d.value,
    })).sort(compareString) ?? emptyNumericOptionList
  ), [formStatusResponse]);

  return (
    <>
      {
        componentResponse?.results.map((component, i) => (
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
                name='improvement'
                onChange={onValueChange}
                options={formStatusOptions}
                pending={fetchingFormStatus}
              />
            }
          >
            <QuestionComponent
              index={i}
              id={component.id}
              value={value}
              onValueChange={onValueChange}
            />
            <div className={styles.dot} />
          </ExpandableContainer>
        ))
      }
    </>
  );
}

export default ComponentsInput;

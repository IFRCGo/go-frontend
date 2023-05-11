import React from 'react';
import { isNotDefined, _cs } from '@togglecorp/fujs';
import { useForm, PartialForm, EntriesAsList } from '@togglecorp/toggle-form';

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

import styles from './styles.module.scss';
import { assessmentSchema } from '#views/PerProcess/usePerProcessOptions';
import QuestionInput from './QuestionInput';

type Value = PartialForm<PerOverviewFields>;

interface Props {
  className?: string;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  id?: string;
}

function ComponentsInput(props: Props) {
  const {
    className,
    onValueChange,
    id,
  } = props;

  const {
    value,
    setFieldValue,
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
                onChange={setFieldValue}
                options={formStatusOptions}
                pending={fetchingFormStatus}
              />
            }
          >
            <QuestionInput
              index={component.id}
              id={component.id}
              value={value}
              onValueChange={setFieldValue}
            />
            <div className={styles.dot} />
          </ExpandableContainer>
        ))
      }
    </>
  );
}

export default ComponentsInput;

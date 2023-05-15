import React from 'react';
import { isNotDefined, _cs } from '@togglecorp/fujs';
import { EntriesAsList, PartialForm } from '@togglecorp/toggle-form';

import { ListResponse, useRequest } from '#utils/restRequest';
import { compareString } from '#utils/utils';
import ExpandableContainer from '#components/ExpandableContainer';

import {
  PerOverviewFields,
  FormComponentStatus,
  emptyNumericOptionList,
  PerWorkPlanForm,
  PerAssessmentForm,
} from '../../common';
import QuestionList from './QuestionInput';
import TextInput from '#components/TextInput';

import styles from './styles.module.scss';

type Value = PartialForm<PerAssessmentForm>;

interface Props {
  id?: string;
  value?: Value;
  onValueChange?: (...entries: EntriesAsList<Value>) => void;
}

function ComponentsInput(props: Props) {
  const {
    value,
    onValueChange,
    id,
  } = props;

  const {
    pending: fetchingComponents,
    response: componentResponse,
  } = useRequest<ListResponse<PerWorkPlanForm>>({
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

  console.warn('value', value);

  return (
    <>
      {
        componentResponse?.results.map((component, i) => (
          <ExpandableContainer
            className={_cs(styles.customActivity, styles.errored)}
            componentRef={undefined}
            heading={`Component ${i + 1} : ${component.title}`}
            // actionsContainerClassName={styles}
            headingSize="small"
            sub
            actions={
              <TextInput
                className={styles.improvementSelect}
                name="description"
                value={value?.description}
                onChange={onValueChange}
              />
            }
          >
            <QuestionList
              index={i}
              id={component.id}
              value={value}
              onValueChange={onValueChange}
            />
          </ExpandableContainer>
        ))
      }
    </>
  );
}

export default ComponentsInput;

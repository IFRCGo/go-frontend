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
  Component,
} from '../../common';
import QuestionList from './QuestionComponent';
import SelectInput from '#components/SelectInput';

import styles from './styles.module.scss';

type Value = PartialForm<PerOverviewFields>;

interface Props {
  id?: string;
  value?: Value;
  onValueChange?: (...entries: EntriesAsList<Value>) => void;
}

function ComponentsList(props: Props) {
  const {
    value,
    onValueChange,
    id,
  } = props;

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
              <SelectInput
                className={styles.improvementSelect}
                name="improvement"
                onChange={onValueChange}
                options={formStatusOptions}
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

export default ComponentsList;

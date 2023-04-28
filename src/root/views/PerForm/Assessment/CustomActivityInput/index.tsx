import React from 'react';
import { isNotDefined, _cs } from '@togglecorp/fujs';
import { EntriesAsList, PartialForm } from '@togglecorp/toggle-form';

import { ListResponse, useRequest } from '#utils/restRequest';
import { BooleanValueOption } from '#types';
import ExpandableContainer from '#components/ExpandableContainer';
import Container from '#components/Container';
import TextArea from '#components/TextArea';
import SelectInput from '#components/SelectInput';

import RadioInput from '#components/RadioInput';
import {
  booleanOptionKeySelector,
  optionLabelSelector,
  Component,
  ComponentQuestion,
  PerOverviewFields,
} from '../../common';

import styles from './styles.module.scss';

// type Value = PartialForm<PerOverviewFields>;

interface Props {
  yesNoOptions?: BooleanValueOption[];
  onValueChange?: (...entries: EntriesAsList<null>) => void;
  id: string;
}

type Value = PartialForm<ComponentQuestion>;

interface QuestionProps {
  id: string;
  value?: Value;
  yesNoOptions?: BooleanValueOption[];
  onValueChange?: (...entries: EntriesAsList<Value>) => void;
}

function QuestionComponent(props: QuestionProps) {
  const {
    id,
    value,
    onValueChange,
    yesNoOptions,
  } = props;

  const {
    pending: fetchingComponents,
    response: questionResponse,
  } = useRequest<ListResponse<ComponentQuestion>>({
    skip: isNotDefined(id),
    url: `api/v2/per-formquestion/?component=${id}`,
  });

  return (
    <>
      {questionResponse?.results.map((qn) => (
        <>
          <div className={styles.dot} />
          <div className={styles.dotConnector}>
            <Container
              description={qn.question}
              className={styles.inputSection}
              contentClassName={styles.questionContent}
            >
              <TextArea
                className={styles.noteSection}
                name="details"
                label="Notes"
                placeholder={undefined}
                value={value?.description}
                onChange={onValueChange}
                error={undefined}
                rows={2}
              />
              <div
                className={styles.answers}
              >
                <RadioInput
                  name={"text" as const}
                  options={yesNoOptions}
                  keySelector={booleanOptionKeySelector}
                  labelSelector={optionLabelSelector}
                  value={undefined}
                  onChange={onValueChange}
                  error={undefined}
                />
                {/* <label>
                  <input
                    type="radio"
                    name="yes-no-na"
                    value="no"
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="yes-no-na"
                    value="no"
                  />
                  No
                </label>
                <label>
                  <input
                    type="radio"
                    name="yes-no-na"
                    value="no"
                  />
                  Not Revised
                </label> */}
              </div>
            </Container>
          </div>
        </>
      ))}
    </>
  );
}

function CustomActivityInput(props: Props) {
  const childrefRef = React.useRef(null);
  const {
    yesNoOptions,
    onValueChange,
    // data,
    id,
  } = props;

  const {
    pending: fetchingComponents,
    response: componentResponse,
  } = useRequest<ListResponse<Component>>({
    skip: isNotDefined(id),
    url: `api/v2/per-formcomponent/?area_id=${id}`,
  });

  return (
    <>
      {
        componentResponse?.results.map((component) => (
          <ExpandableContainer
            className={_cs(styles.customActivity, styles.errored)}
            componentRef={undefined}
            heading={`Component: ${component.title}`}
            // actionsContainerClassName={styles}
            headingSize="small"
            sub
            // actions={
            //   <>
            //     <SelectInput
            //       className={styles.improvementSelect}
            //       name="improvement"
            //       onChange={() => { }}
            //       value={""}
            //     />
            //   </>
            // }
          >
            <QuestionComponent id={component.id} />
            <div className={styles.dot} />
          </ExpandableContainer>
        ))
      }
    </>
  );
}

export default CustomActivityInput;

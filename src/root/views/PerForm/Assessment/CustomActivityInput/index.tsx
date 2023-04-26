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
} from '../../common';

import styles from './styles.module.scss';

interface Props {
  yesNoOptions?: BooleanValueOption[];
  onValueChange?: (...entries: EntriesAsList<null>) => void;
  id: string;
}

type Value = PartialForm<ComponentQuestion>;

interface QuestionProps {
  id: string;
  yesNoOptions?: BooleanValueOption[];
  onValueChange?: (...entries: EntriesAsList<Value>) => void;
}

function QuestionComponent(props: QuestionProps) {
  const {
    id,
    yesNoOptions,
    onValueChange,
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
        <Container
          description={qn.question}
          className={styles.inputSection}
          contentClassName={styles.questionContent}
        >
          <div className={styles.bullets} />
          <TextArea
            className={styles.noteSection}
            name="details"
            label="Notes"
            placeholder={undefined}
            value={qn.description}
            onChange={onValueChange}
            error={undefined}
            rows={2}
            disabled
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
              onChange={undefined}
              error={undefined}
            />
            <label>
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
            </label>
          </div>
        </Container>
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
            actions={
              <>
                <SelectInput
                  className={styles.improvementSelect}
                  name="improvement"
                  onChange={() => { }}
                  value={""}
                />
              </>
            }
          >
            <QuestionComponent id={component.id} />
          </ExpandableContainer>
        ))
      }
    </>
  );
}

export default CustomActivityInput;

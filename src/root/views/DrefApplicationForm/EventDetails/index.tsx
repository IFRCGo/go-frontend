import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import TextInput from '#components/TextInput';
import SelectInput from '#components/SelectInput';
import LanguageContext from '#root/languageContext';

import {
  optionLabelSelector,
  NumericValueOption,
  BooleanValueOption,
  booleanOptionKeySelector,
  DrefFields,
} from '../common';


import styles from './styles.module.scss';
import RadioInput from '#components/RadioInput';
import TextArea from '#components/TextArea';

type Value = PartialForm<DrefFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  yesNoOptions: BooleanValueOption[];
}

function EventDetails(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    error,
    onValueChange,
    value,
    yesNoOptions,
  } = props;


  return (
    <>
      <Container>
        <InputSection
          title={strings.eventDetailsTitle}
          description={strings.eventDescription}
        >
          <SelectInput options={[]} />
        </InputSection>
      </Container>
      <Container
        heading={strings.previousOperations}
        className={styles.previousOperations}
      >
        <InputSection
          title={strings.affectSameArea}
        >
          <RadioInput
            name="affect_same_area"
            options={yesNoOptions}
            radioKeySelector={booleanOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            value={value.affect_same_area}
            onChange={onValueChange}
            error={error?.fields?.affect_same_area}
          />
        </InputSection>
        <InputSection
          title={strings.affectedthePopulationTitle}
        >
          <RadioInput
            name="affect_same_population"
            options={yesNoOptions}
            radioKeySelector={booleanOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            value={value.affect_same_population}
            onChange={onValueChange}
            error={error?.fields?.affect_same_population}
          />
        </InputSection>
        {!value.affect_same_population && <InputSection
          title={strings.eventDetailsSpecify}
        >
          <TextInput
            placeholder="Same region not same communities"
            name="affect_same_population_text"
            value={value.affect_same_population_text}
            onChange={onValueChange}
            error={error?.fields?.affect_same_population_text}
          />
        </InputSection>}
        <InputSection
          title={strings.nsRespond}
        >
          <RadioInput
            name="ns_respond"
            options={yesNoOptions}
            radioKeySelector={booleanOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            value={value.ns_respond}
            onChange={onValueChange}
            error={error?.fields?.ns_respond}
          />
        </InputSection>
        <InputSection
          title={strings.nsRequest}
        >
          <RadioInput
            name="ns_request_fund"
            options={yesNoOptions}
            radioKeySelector={booleanOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            value={value.ns_request_fund}
            onChange={onValueChange}
            error={error?.fields?.ns_request_fund}
          />
        </InputSection>
        <InputSection
          title={strings.lessonsLearned}
          oneColumn
          multiRow
        >
          <TextArea
            name="lessons_learned"
            onChange={onValueChange}
            value={value.lessons_learned}
            error={error?.fields?.lessons_learned}
            placeholder="Max 500 characters"
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.descriptionEvent}
        className={styles.eventDetails}
      >
        <InputSection
          title={strings.anticipatoryActionWhen}
          oneColumn
          multiRow
        >
          <TextArea
            name="event_description"
            onChange={onValueChange}
            value={value.event_description}
            error={error?.fields?.event_description}
            placeholder="Max 800 characters"
          />
        </InputSection>
        <InputSection
          title={strings.scopeAndScaleEvent}
          oneColumn
          multiRow
        >
          <TextArea
            name="event_scope"
            onChange={onValueChange}
            value={value.event_scope}
            error={error?.fields?.event_scope}
            placeholder="Max 800 characters"
          />
        </InputSection>
      </Container>
    </>
  );
}

export default EventDetails;

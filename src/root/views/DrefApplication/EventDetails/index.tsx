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
  optionDescriptionSelector,
  Option,
  FormType,
  NumericValueOption,
  BooleanValueOption,
  booleanOptionKeySelector,
} from '../common';

import styles from './styles.module.scss';
import RadioInput from '#components/RadioInput';
import TextArea from '#components/TextArea';

type Value = PartialForm<FormType>;
interface Props {
  disasterTypeOptions: NumericValueOption[];
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  statusOptions: NumericValueOption[];
  value: Value;
  yesNoOptions: BooleanValueOption[];
  countryOptions: NumericValueOption[];
  districtOptions: NumericValueOption[];
  fetchingCountries?: boolean;
  fetchingDistricts?: boolean;
  fetchingDisasterTypes?: boolean;
  initialEventOptions?: Option[];
}

function EventDetails(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    countryOptions,
    fetchingCountries,
    error,
    onValueChange,
    value,
    yesNoOptions,
  } = props;

  return (
    <>
      <Container sub>
        <InputSection
          title="Copy data from an existing field report"
          description="These field reports have already been filtered by the country and disaster type that you have entered. Selecting field report will pre-fill matching fields in this report, which you can modify."
        >
          <SelectInput
            error={error?.fields?.country}
            name="country"
            onChange={onValueChange}
            options={countryOptions}
            pending={fetchingCountries}
            value={value.country}
          />
        </InputSection>
      </Container>
      <Container
        heading="PREVIOUS OPERATIONS"
        className={styles.eventDetails}>
        <InputSection
          title="Has a similar event affected the same population"
        >
          <RadioInput
            name="is_covid_report"
            options={yesNoOptions}
            radioKeySelector={booleanOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            radioDescriptionSelector={optionDescriptionSelector}
            value={value.is_covid_report}
            onChange={onValueChange}
            error={error?.fields?.is_covid_report}
          />
        </InputSection>
        <InputSection
          title="Did it affect the same communities?"
        >
          <RadioInput
            name="is_covid_report"
            options={yesNoOptions}
            radioKeySelector={booleanOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            radioDescriptionSelector={optionDescriptionSelector}
            value={value.is_covid_report}
            onChange={onValueChange}
            error={error?.fields?.is_covid_report}
          />
        </InputSection>
        <InputSection
          title="Did the NS respond?"
        >
          <RadioInput
            name="ns_respond_text"
            options={yesNoOptions}
            radioKeySelector={booleanOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            radioDescriptionSelector={optionDescriptionSelector}
            value={value.ns_respond_text}
            onChange={onValueChange}
            error={error?.fields?.ns_respond_text}
          />
        </InputSection>
        <InputSection
          title="Did the NS request a DREF?"
        >
          <RadioInput
            name="ns_request"
            options={yesNoOptions}
            radioKeySelector={booleanOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            radioDescriptionSelector={optionDescriptionSelector}
            value={value.ns_request}
            onChange={onValueChange}
            error={error?.fields?.ns_request}
          />
        </InputSection>
        <InputSection
          title="If yes, please specify"
        >
          <TextInput
            // label={strings.fieldReportFormTitleSecondaryLabel}
            placeholder="Enter MDR or DREF number"
            name="summary"
            value={value.summary}
            onChange={onValueChange}
            error={error?.fields?.summary}
          />
        </InputSection>
        <InputSection
          title="Mention lessons learned from similar operations and steps to mitigate challenges"
          oneColumn
          multiRow
        >
          <TextArea
            // label={strings.cmpActionDescriptionLabel}
            name="lessons_learned"
            onChange={onValueChange}
            value={value.lessons_learned}
            error={error?.fields?.lessons_learned}
            placeholder="Max 500 characters"
          />
        </InputSection>
      </Container>
      <Container
        heading="DESCRIPTION OF THE EVENT"
        className={styles.eventDetails}>
        <InputSection
          title="What happened, where and when? For imminent and anticipatory action, explain what is expected to happen"
          oneColumn
          multiRow
        >
          <TextArea
            // label={strings.cmpActionDescriptionLabel}
            name="event_description"
            onChange={onValueChange}
            value={value.event_description}
            error={error?.fields?.event_description}
            placeholder="Max 800 characters"
          />
        </InputSection>
        <InputSection
          title="Scope and scale of the event"
          oneColumn
          multiRow
        >
          <TextArea
            // label={strings.cmpActionDescriptionLabel}
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

import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
  getErrorObject,
} from '@togglecorp/toggle-form';

import RadioInput from '#components/RadioInput';
import Container from '#components/Container';
import languageContext from '#root/languageContext';
import InputSection from '#components/InputSection';
import TextArea from '#components/TextArea';

import {
  booleanOptionKeySelector,
  BooleanValueOption,
  DrefOperationalUpdateFields,
  optionLabelSelector,
} from '../common';

type Value = PartialForm<DrefOperationalUpdateFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  yesNoOptions: BooleanValueOption[];
}

function EventDetails(props: Props) {
  const { strings } = React.useContext(languageContext);
  const {
    value,
    error: formError,
    onValueChange,
    yesNoOptions,
  } = props;
  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError]
  );

  return (
    <>
      <Container
        heading={strings.drefOperationalUpdateSummaryChangeHeading}
      >
        <InputSection
          title={strings.drefOperationalUpdateSummaryAreYouChangingTimeFrame}
        >
          <RadioInput
            name={"changing_the_timeframe" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.changing_the_timeframe}
            onChange={onValueChange}
            error={error?.changing_the_timeframe}
          />
        </InputSection>
        <InputSection
          title={strings.drefOperationalUpdateSummaryAreYouChangingStrategy}
        >
          <RadioInput
            name={"changing_the_operational_strategy" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.changing_the_operational_strategy}
            onChange={onValueChange}
            error={error?.changing_the_operational_strategy}
          />
        </InputSection>
        <InputSection
          title={strings.drefOperationalUpdateSummaryAreYouChangingTargetPopulation}
        >
          <RadioInput
            name={"changing_the_target_population" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.changing_the_target_population}
            onChange={onValueChange}
            error={error?.changing_the_target_population}
          />
        </InputSection>
        <InputSection
          title={strings.drefOperationalUpdateSummaryAreYouChangingGeographicalLocation}
        >
          <RadioInput
            name={"changing_the_geographical_location" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.changing_the_geographical_location}
            onChange={onValueChange}
            error={error?.changing_the_geographical_location}
          />
        </InputSection>
        <InputSection
          title={strings.drefOperationalUpdateSummaryAreYouChangingBudget}
        >
          <RadioInput
            name={"changing_the_budget" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.changing_the_budget}
            onChange={onValueChange}
            error={error?.changing_the_budget}
          />
        </InputSection>
        <InputSection
          title={strings.drefOperationalUpdateSummaryRequestForSecondAllocation}
        >
          <RadioInput
            name={"request_for_second_allocation" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.request_for_second_allocation}
            onChange={onValueChange}
            error={error?.request_for_second_allocation}
          />
        </InputSection>

        <InputSection title={strings.drefOperationalUpdateSummaryExplain}>
          <TextArea
            name="explain_summary"
            value={value.explain_summary}
            onChange={onValueChange}
            error={error?.explain_summary}
            placeholder={strings.drefOperationalUpdateSummaryExplain}
          />
        </InputSection>

      </Container>
      <Container
        heading={strings.drefOperationalUpdateDescriptionOfEventHeading}>
        <InputSection title={strings.drefOperationalUpdateDescriptionOfEventLabel}>
          <TextArea
            name="has_anything_changed"
            value={value.has_anything_changed}
            onChange={onValueChange}
            error={error?.has_anything_changed}
            placeholder={strings.drefOperationalUpdateDescriptionOfEventLabel}
          />
        </InputSection>
      </Container>
    </>
  );
}

export default EventDetails;

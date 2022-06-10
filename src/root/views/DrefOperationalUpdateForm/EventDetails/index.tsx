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

import DREFFileInput from '#components/DREFFileInput';

type Value = PartialForm<DrefOperationalUpdateFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  yesNoOptions: BooleanValueOption[];
  isImminentOnset: boolean;
  fileIdToUrlMap?: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

function EventDetails(props: Props) {
  const { strings } = React.useContext(languageContext);
  const {
    value,
    error: formError,
    onValueChange,
    yesNoOptions,
    isImminentOnset,
    fileIdToUrlMap,
    setFileIdToUrlMap,
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
            name={"changing_timeframe_operation" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.changing_timeframe_operation}
            onChange={onValueChange}
            error={error?.changing_timeframe_operation}
          />
        </InputSection>
        <InputSection
          title={strings.drefOperationalUpdateSummaryAreYouChangingStrategy}
        >
          <RadioInput
            name={"changing_operation_strategy" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.changing_operation_strategy}
            onChange={onValueChange}
            error={error?.changing_operation_strategy}
          />
        </InputSection>
        <InputSection
          title={strings.drefOperationalUpdateSummaryAreYouChangingTargetPopulation}
        >
          <RadioInput
            name={"changing_target_population_of_operation" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.changing_target_population_of_operation}
            onChange={onValueChange}
            error={error?.changing_target_population_of_operation}
          />
        </InputSection>
        <InputSection
          title={strings.drefOperationalUpdateSummaryAreYouChangingGeographicalLocation}
        >
          <RadioInput
            name={"changing_geographic_location" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.changing_geographic_location}
            onChange={onValueChange}
            error={error?.changing_geographic_location}
          />
        </InputSection>
        <InputSection
          title={strings.drefOperationalUpdateSummaryAreYouChangingBudget}
        >
          <RadioInput
            name={"changing_budget" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.changing_budget}
            onChange={onValueChange}
            error={error?.changing_budget}
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
            name="summary_of_change"
            value={value.summary_of_change}
            onChange={onValueChange}
            error={error?.summary_of_change}
            placeholder={strings.drefOperationalUpdateSummaryExplain}
          />
        </InputSection>

      </Container>
      <Container
        heading={strings.drefOperationalUpdateDescriptionOfEventHeading}>
        <InputSection title={strings.drefOperationalUpdateDescriptionOfEventLabel}>
          <TextArea
            name="change_since_request"
            value={value.change_since_request}
            onChange={onValueChange}
            error={error?.change_since_request}
            placeholder={strings.drefOperationalUpdateDescriptionOfEventLabel}
          />
        </InputSection>
        <InputSection
          title={!isImminentOnset ? strings.drefFormWhatWhereWhen : strings.drefFormImmientDisaster}
          oneColumn
          multiRow
        >
          <TextArea
            name="event_description"
            onChange={onValueChange}
            value={value.event_description}
            error={error?.event_description}
          />
        </InputSection>
        {isImminentOnset &&
          <InputSection
            title={strings.drefFormTargetCommunities}
            oneColumn
            multiRow
          >
            <TextArea
              name="anticipatory_actions"
              onChange={onValueChange}
              value={value.anticipatory_actions}
              error={error?.anticipatory_actions}
            />
          </InputSection>
        }
        <InputSection
          title={strings.drefFormUploadPhotos}
        >
          <DREFFileInput
            name="event_map"
            value={value.event_map}
            onChange={onValueChange}
            accept="image/*"
            showStatus
            error={error?.event_map}
            fileIdToUrlMap={fileIdToUrlMap}
            setFileIdToUrlMap={setFileIdToUrlMap}
          >
            Select images
          </DREFFileInput>
        </InputSection>
        <InputSection
          title={strings.drefFormScopeAndScaleEvent}
          description={strings.drefFormScopeAndScaleDescription}
          oneColumn
          multiRow
        >
          <TextArea
            name="event_scope"
            onChange={onValueChange}
            value={value.event_scope}
            error={error?.event_scope}
          />
        </InputSection>
      </Container>
    </>
  );
}

export default EventDetails;

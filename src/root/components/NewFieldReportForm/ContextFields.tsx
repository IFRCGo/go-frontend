import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';

import InputSection from '#components/draft/InputSection';
import RadioInput from '#components/draft/RadioInput';
import DateInput from '#components/draft/DateInput';
import TextInput from '#components/draft/TextInput';
import SearchSelectInput from '#components/draft/SearchSelectInput';
import SelectInput from '#components/draft/SelectInput';

import LanguageContext from '#root/languageContext';
import { fetchEventsFromApi } from '#views/field-report-form/data-utils';

import {
  ReportType,
  optionKeySelector,
  optionLabelSelector,
  optionDescriptionSelector,
  Option,
  FormType,
} from './common';

type Value = PartialForm<FormType>;
interface Props {
    disasterTypeOptions: Option[];
    error: Error<Value> | undefined;
    onValueChange: (...entries: EntriesAsList<Value>) => void;
    statusOptions: Option[];
    value: Value;
    yesNoOptions: Option[];
    reportType: ReportType;
}

function ContextFields(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    disasterTypeOptions,
    error,
    onValueChange,
    statusOptions,
    value,
    yesNoOptions,
    reportType,
  } = props;

  const [
    startDateSectionDescription,
    startDateSectionTitle,
  ] = React.useMemo(() => {
    const descriptionMap: {
      [key in ReportType]: string;
    } = {
      EPI: strings.fieldsStep1StartDateDescriptionEPI,
      EVT: strings.fieldsStep1StartDateDescriptionEVT,
      EW: strings.fieldsStep1StartDateDescriptionEW,
    };

    const titleMap: {
      [key in ReportType]: string;
    } = {
      EVT: strings.fieldsStep1StartDateLabelStartDate,
      EPI: strings.fieldsStep1StartDateLabelEPI,
      EW: strings.fieldsStep1StartDateLabelEW,
    };

    return [
      descriptionMap[reportType],
      titleMap[reportType],
    ];
  }, [strings, reportType]);

  return (
    <>
      <InputSection
        title={strings.fieldReportFormStatusLabel}
      >
        <RadioInput
          name="status"
          options={statusOptions}
          radioKeySelector={optionKeySelector}
          radioLabelSelector={optionLabelSelector}
          radioDescriptionSelector={optionDescriptionSelector}
          value={value.status}
          error={error?.fields?.status}
          onChange={onValueChange}
        />
      </InputSection>
      <InputSection
        title={strings.fieldReportFormCovidLabel}
      >
        <RadioInput
          name="is_covid_report"
          options={yesNoOptions}
          radioKeySelector={optionKeySelector}
          radioLabelSelector={optionLabelSelector}
          radioDescriptionSelector={optionDescriptionSelector}
          value={value.is_covid_report}
          onChange={onValueChange}
          error={error?.fields?.is_covid_report}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep1SummaryLabel}
        description={strings.fieldsStep1SummaryDescription}
      >
        <div>
          <SearchSelectInput
            label={strings.fieldReportFormTitleSelectLabel}
            placeholder={strings.fieldReportFormTitleSelectPlaceholder}
            name="event"
            value={value.event}
            onChange={onValueChange}
            loadOptions={fetchEventsFromApi}
            error={error?.fields?.event}
          />
          <TextInput
            label={strings.fieldReportFormTitleSecondaryLabel}
            placeholder={strings.fieldReportFormTitleInputPlaceholder}
            name="title"
            value={value.title}
            onChange={onValueChange}
            error={error?.fields?.title}
          />
        </div>
      </InputSection>
      <InputSection
        title={strings.fieldsStep1DisasterTypeLabel}
        description={strings.fieldsStep1DisasterTypeDescription}
      >
        <SelectInput
          name="disaster_type"
          value={value.disaster_type}
          options={disasterTypeOptions}
          onChange={onValueChange}
          error={error?.fields?.disaster_type}
        />
      </InputSection>
      <InputSection
        title={startDateSectionTitle}
        description={startDateSectionDescription}
      >
        <DateInput
          name="start_date"
          value={value.start_date}
          onChange={onValueChange}
          error={error?.fields?.start_date}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep1AssistanceLabel}
        description={strings.fieldsStep1AssistanceDescription}
      >
        <RadioInput
          name="assistance"
          options={yesNoOptions}
          radioKeySelector={optionKeySelector}
          radioLabelSelector={optionLabelSelector}
          radioDescriptionSelector={optionDescriptionSelector}
          value={value.assistance}
          onChange={onValueChange}
          error={error?.fields?.assistance}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep1NSAssistanceLabel}
        description={strings.fieldsStep1NSAssistanceDescription}
      >
        <RadioInput
          name="ns_assistance"
          options={yesNoOptions}
          radioKeySelector={optionKeySelector}
          radioLabelSelector={optionLabelSelector}
          radioDescriptionSelector={optionDescriptionSelector}
          value={value.ns_assistance}
          onChange={onValueChange}
          error={error?.fields?.ns_assistance}
        />
      </InputSection>
    </>
  );
}

export default ContextFields;

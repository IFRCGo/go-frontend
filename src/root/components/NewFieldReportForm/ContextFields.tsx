import React from 'react';
import { isDefined } from '@togglecorp/fujs';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';

import Container from '#components/draft/Container';
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
  STATUS_EARLY_WARNING,
  DISASTER_TYPE_EPIDEMIC,
  NumericValueOption,
  numericOptionKeySelector,
  BooleanValueOption,
  booleanOptionKeySelector,
} from './common';

const isEpidemic = (o: Option) => o.value === DISASTER_TYPE_EPIDEMIC;

type Value = PartialForm<FormType>;
interface Props {
  disasterTypeOptions: Option[];
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  statusOptions: NumericValueOption[];
  value: Value;
  yesNoOptions: BooleanValueOption[];
  reportType: ReportType;
  countryOptions: Option[];
  districtOptions: Option[];
  fetchingCountries: boolean;
  fetchingDistricts: boolean;
}

function ContextFields(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    countryOptions,
    districtOptions,
    fetchingCountries,
    fetchingDistricts,
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
    countrySectionTitle,
    countrySectionDescription,
  ] = React.useMemo(() => {
    type MapByReportType = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      [key in ReportType]: string | undefined;
    }

    const startDateDescriptionMap: MapByReportType = {
      EW: strings.fieldsStep1StartDateDescriptionEW,
      COVID: strings.fieldsStep1StartDateDescriptionEPI,
      EPI: strings.fieldsStep1StartDateDescriptionEPI,
      EVT: strings.fieldsStep1StartDateDescriptionEVT,
    };

    const startDateTitleMap: MapByReportType = {
      EW: strings.fieldsStep1StartDateLabelEW,
      COVID: strings.fieldsStep1StartDateLabelEPI,
      EPI: strings.fieldsStep1StartDateLabelEPI,
      EVT: strings.fieldsStep1StartDateLabelStartDate,
    };

    const countryTitleMap: MapByReportType = {
      EW: strings.fieldsStep1CountryLabelEW,
      COVID: strings.fieldsStep1CountryLabelAffected,
      EPI: strings.fieldsStep1CountryLabelAffected,
      EVT: strings.fieldsStep1CountryLabelAffected,
    };

    const countryDescriptionMap: MapByReportType = {
      EW: strings.fieldsStep1CountryDescriptionEW,
      COVID: undefined,
      EPI: undefined,
      EVT: undefined,
    };

    return [
      startDateDescriptionMap[reportType],
      startDateTitleMap[reportType],
      countryTitleMap[reportType],
      countryDescriptionMap[reportType],
    ];
  }, [strings, reportType]);

  return (
    <Container
      // FIXME: use translation
      heading="Context"
    >
      <InputSection
        title={strings.fieldReportFormStatusLabel}
      >
        <RadioInput
          name="status"
          options={statusOptions}
          radioKeySelector={numericOptionKeySelector}
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
          radioKeySelector={booleanOptionKeySelector}
          radioLabelSelector={optionLabelSelector}
          radioDescriptionSelector={optionDescriptionSelector}
          value={value.is_covid_report}
          onChange={onValueChange}
          error={error?.fields?.is_covid_report}
          disabled={value.status === STATUS_EARLY_WARNING}
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
            name="summary"
            value={value.summary}
            onChange={onValueChange}
            error={error?.fields?.summary}
          />
        </div>
      </InputSection>
      <InputSection
        title={strings.fieldsStep1DisasterTypeLabel}
        description={strings.fieldsStep1DisasterTypeDescription}
      >
        <SelectInput
          name="dtype"
          isOptionDisabled={value.status === STATUS_EARLY_WARNING ? isEpidemic : undefined}
          value={value.dtype}
          options={disasterTypeOptions}
          onChange={onValueChange}
          error={error?.fields?.dtype}
          disabled={value.is_covid_report}
        />
      </InputSection>
      <InputSection
        title={countrySectionTitle}
        description={countrySectionDescription}
      >
        <SelectInput
          error={error?.fields?.country}
          label={strings.projectFormCountryLabel}
          name="country"
          onChange={onValueChange}
          options={countryOptions}
          pending={fetchingCountries}
          value={value.country}
        />
        <SelectInput
          disabled={!isDefined(value.country)}
          pending={fetchingDistricts}
          error={error?.fields?.districts}
          isMulti
          label={strings.projectFormDistrictLabel}
          name="districts"
          onChange={onValueChange}
          options={districtOptions}
          value={value.districts}
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
          name="request_assistance"
          options={yesNoOptions}
          radioKeySelector={booleanOptionKeySelector}
          radioLabelSelector={optionLabelSelector}
          radioDescriptionSelector={optionDescriptionSelector}
          value={value.request_assistance}
          onChange={onValueChange}
          error={error?.fields?.request_assistance}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep1NSAssistanceLabel}
        description={strings.fieldsStep1NSAssistanceDescription}
      >
        <RadioInput
          name="ns_request_assistance"
          options={yesNoOptions}
          radioKeySelector={booleanOptionKeySelector}
          radioLabelSelector={optionLabelSelector}
          radioDescriptionSelector={optionDescriptionSelector}
          value={value.ns_request_assistance}
          onChange={onValueChange}
          error={error?.fields?.ns_request_assistance}
        />
      </InputSection>
    </Container>
  );
}

export default ContextFields;

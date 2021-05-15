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
  STATUS_EARLY_WARNING,
  DISASTER_TYPE_EPIDEMIC,
} from '#utils/field-report-constants';

import {
  ReportType,
  optionKeySelector,
  optionLabelSelector,
  optionDescriptionSelector,
  Option,
  FormType,
} from './common';

const isEpidemic = (o: Option) => String(o.value) === DISASTER_TYPE_EPIDEMIC;

type Value = PartialForm<FormType>;
interface Props {
  disasterTypeOptions: Option[];
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  statusOptions: Option[];
  value: Value;
  yesNoOptions: Option[];
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
          isOptionDisabled={value.status === STATUS_EARLY_WARNING ? isEpidemic : undefined}
          value={value.disaster_type}
          options={disasterTypeOptions}
          onChange={onValueChange}
          error={error?.fields?.disaster_type}
          disabled={value.is_covid_report === 'true'}
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
    </Container>
  );
}

export default ContextFields;

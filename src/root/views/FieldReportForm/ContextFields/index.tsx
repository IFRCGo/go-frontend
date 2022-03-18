import React from 'react';
import { isDefined } from '@togglecorp/fujs';
import {
  PartialForm,
  Error,
  EntriesAsList,
  getErrorObject,
} from '@togglecorp/toggle-form';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import RadioInput from '#components/RadioInput';
import DateInput from '#components/DateInput';
import TextInput from '#components/TextInput';
import SearchSelectInput, { Option as SearchSelectOption } from '#components/SearchSelectInput';
import SelectInput from '#components/SelectInput';
import LanguageContext from '#root/languageContext';

import {
  ReportType,
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
  fetchEventsFromApi,
} from '../common';

import styles from './styles.module.scss';

const isEpidemic = (o: Option) => o.value === DISASTER_TYPE_EPIDEMIC;

type Value = PartialForm<FormType>;
interface Props {
  disasterTypeOptions: NumericValueOption[];
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  statusOptions: NumericValueOption[];
  value: Value;
  yesNoOptions: BooleanValueOption[];
  reportType: ReportType;
  countryOptions: NumericValueOption[];
  countryIsoOptions: NumericValueOption[];
  districtOptions: NumericValueOption[];
  fetchingCountries?: boolean;
  fetchingDistricts?: boolean;
  fetchingDisasterTypes?: boolean;
  initialEventOptions?: Option[];
  eventOptions: NumericValueOption[];
}

function ContextFields(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    countryOptions,
    districtOptions,
    fetchingCountries,
    fetchingDistricts,
    fetchingDisasterTypes,
    disasterTypeOptions,
    error: formError,
    onValueChange,
    statusOptions,
    value,
    yesNoOptions,
    reportType,
    initialEventOptions,
    eventOptions,
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

  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError]
  );

  return (
    <Container
      // FIXME: use translation
      heading="Context"
      className={styles.contextFields}
    >
      <InputSection
        title={strings.fieldReportFormStatusLabel}
      >
        <RadioInput
          name={"status" as const}
          options={statusOptions}
          keySelector={numericOptionKeySelector}
          labelSelector={optionLabelSelector}
          descriptionSelector={optionDescriptionSelector}
          value={value.status}
          error={error?.status}
          onChange={onValueChange}
        />
      </InputSection>
      <InputSection
        title={strings.fieldReportFormCovidLabel}
      >
        <RadioInput
          name={"is_covid_report" as const}
          options={yesNoOptions}
          keySelector={booleanOptionKeySelector}
          labelSelector={optionLabelSelector}
          descriptionSelector={optionDescriptionSelector}
          value={value.is_covid_report}
          onChange={onValueChange}
          error={error?.is_covid_report}
          disabled={value.status === STATUS_EARLY_WARNING}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep1SummaryLabel}
        description={strings.fieldsStep1SummaryDescription}
      >
        <table>
          <tbody>
           <tr>
             <td>
                <SearchSelectInput
                  label={strings.fieldReportFormTitleSelectLabel}
                  placeholder={strings.fieldReportFormTitleSelectPlaceholder}
                  name={"event" as const}
                  value={value.event}
                  onChange={onValueChange}
                  loadOptions={fetchEventsFromApi}
                  initialOptions={initialEventOptions as SearchSelectOption[]}
                  error={error?.event}
                />
             </td>
           </tr>
           <tr>
             <td>
                <TextInput
                  label={strings.fieldReportFormTitleSecondaryLabel}
                  placeholder={strings.fieldReportFormTitleInputPlaceholder}
                  name="summary"
                  value={value.summary}
                  maxLength={100}
                  onChange={onValueChange}
                  error={error?.summary}
                />
             </td>
             <td>
                <TextInput
                  label={strings.fieldReportUpdateNo}
                  placeholder="1"
                  name="event"
                  value={eventOptions.find(x => x.value===value.event)?.label}
                  error={error?.event}
                />
             </td>
           </tr>
          </tbody>
        </table>   
      </InputSection>
      <InputSection
        title={countrySectionTitle}
        description={countrySectionDescription}
      >
        <SelectInput
          error={error?.country}
          label={strings.projectFormCountryLabel}
          name={"country" as const}
          onChange={onValueChange}
          options={countryOptions}
          pending={fetchingCountries}
          value={value.country}
        />
        <SelectInput
          disabled={!isDefined(value.country)}
          pending={fetchingDistricts}
          error={error?.districts}
          isMulti
          label={strings.projectFormDistrictLabel}
          name={"districts" as const}
          onChange={onValueChange}
          options={districtOptions}
          value={value.districts}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep1DisasterTypeLabel}
        description={strings.fieldsStep1DisasterTypeDescription}
      >
        <SelectInput
          name={"dtype" as const}
          isOptionDisabled={value.status === STATUS_EARLY_WARNING ? isEpidemic : undefined}
          value={value.dtype}
          options={disasterTypeOptions}
          pending={fetchingDisasterTypes}
          onChange={onValueChange}
          error={error?.dtype}
          disabled={value.is_covid_report}
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
          error={error?.start_date}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep1AssistanceLabel}
        description={strings.fieldsStep1AssistanceDescription}
      >
        <RadioInput
          name={"request_assistance" as const}
          options={yesNoOptions}
          keySelector={booleanOptionKeySelector}
          labelSelector={optionLabelSelector}
          descriptionSelector={optionDescriptionSelector}
          value={value.request_assistance}
          onChange={onValueChange}
          error={error?.request_assistance}
          clearable
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep1NSAssistanceLabel}
        description={strings.fieldsStep1NSAssistanceDescription}
      >
        <RadioInput
          name={"ns_request_assistance" as const}
          options={yesNoOptions}
          keySelector={booleanOptionKeySelector}
          labelSelector={optionLabelSelector}
          descriptionSelector={optionDescriptionSelector}
          value={value.ns_request_assistance}
          onChange={onValueChange}
          error={error?.ns_request_assistance}
          clearable
        />
      </InputSection>
    </Container>
  );
}

export default ContextFields;

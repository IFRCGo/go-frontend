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
  ReportType,
  optionLabelSelector,
  optionDescriptionSelector,
  Option,
  FormType,
  STATUS_EARLY_WARNING,
  DISASTER_TYPE_EPIDEMIC,
  NumericValueOption,
  BooleanValueOption,
  booleanOptionKeySelector,
} from '../common';

import styles from './styles.module.scss';
import RadioInput from '#components/RadioInput';
import TextArea from '#components/TextArea';

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
    reportType,
  } = props;

  const [
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
    <>
      <Container>
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
            disabled={value.status === STATUS_EARLY_WARNING}
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
            disabled={value.status === STATUS_EARLY_WARNING}
          />
        </InputSection>
        <InputSection
          title="Did the NS respond?"
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
          title="Did the NS request a DREF?"
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
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
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
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
            placeholder="Max 800 characters"
          />
        </InputSection>
        <InputSection
          title="Scope and scale of the event"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
            placeholder="Max 800 characters"
          />
        </InputSection>
      </Container>
    </>
  );
}

export default EventDetails;

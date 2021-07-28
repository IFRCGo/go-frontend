import React from 'react';
import { isDefined } from '@togglecorp/fujs';
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
import DateInput from '#components/DateInput';

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

function DrefOverview(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    countryOptions,
    districtOptions,
    fetchingCountries,
    fetchingDistricts,
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
    <Container
      // FIXME: use translation
      heading="Essential Information"
      className={styles.drefOverview}
    >
      <InputSection
        title={strings.fieldsStep1SummaryLabel}
      >
        <div>
          <TextInput
            // label={strings.fieldReportFormTitleSecondaryLabel}
            // placeholder={strings.fieldReportFormTitleInputPlaceholder}
            name="summary"
            value={value.summary}
            onChange={onValueChange}
            error={error?.fields?.summary}
          />
        </div>
      </InputSection>
      <InputSection
        title="Disaster details*"
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
      <InputSection
        title="Disaster Details*"
      >
        <SelectInput
          error={error?.fields?.country}
          label="DISASTER TYPE"
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
          label="TYPE OF ONSET"
          name="districts"
          onChange={onValueChange}
          options={districtOptions}
          value={value.districts}
        />
      </InputSection>
      <InputSection
        title="Number of people affected/ number of people at risk"
        description={countrySectionDescription}
      >
        <div>
          <TextInput
            // label={strings.fieldReportFormTitleSecondaryLabel}
            // placeholder={strings.fieldReportFormTitleInputPlaceholder}
            name="summary"
            value={value.summary}
            onChange={onValueChange}
            error={error?.fields?.summary}
          />
        </div>
        <div>
          <TextInput
            // label={strings.fieldReportFormTitleSecondaryLabel}
            // placeholder={strings.fieldReportFormTitleInputPlaceholder}
            name="summary"
            value={value.summary}
            onChange={onValueChange}
            error={error?.fields?.summary}
          />
        </div>
      </InputSection>
      <InputSection
        title="Requested Amount"
        description={countrySectionDescription}
      >
        <div>
          <TextInput
            // label={strings.fieldReportFormTitleSecondaryLabel}
            // placeholder={strings.fieldReportFormTitleInputPlaceholder}
            name="summary"
            value={value.summary}
            onChange={onValueChange}
            error={error?.fields?.summary}
          />
        </div>
      </InputSection>
      <InputSection
        title="Emergency appeal planned"
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
      <Container
        heading="TIMEFRAMES"
        className={styles.drefOverview}>
        <InputSection
          title="Disaster date/ trigger date"
        >
          <DateInput
            name="start_date"
            value={value.start_date}
            onChange={onValueChange}
            error={error?.fields?.start_date}
          />
        </InputSection>
        <InputSection
          title="Date NS response started"
        >
          <DateInput
            name="start_date"
            value={value.start_date}
            onChange={onValueChange}
            error={error?.fields?.start_date}
          />
        </InputSection>
      </Container>
    </Container>
  );
}

export default DrefOverview;

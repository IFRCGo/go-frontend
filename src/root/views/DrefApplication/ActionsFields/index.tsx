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

function ActionsFields(props: Props) {
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
      <Container
        heading="NATIONAL SOCIETY ACTIONS"
        className={styles.ActionsFields}>
        <InputSection
          title=""
          description="Select the needs that apply."
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
        heading="Other Actors"
        className={styles.ActionsFields}>
        <InputSection
          title="Government has requested international assistance"
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
          title="National authorities"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
            placeholder="If selected, max 300 characters"
          />
        </InputSection>
        <InputSection
          title="RCRC Partner NSs"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
            placeholder="If selected, max 300 characters"
          />
        </InputSection>
        <InputSection
          title="ICRC"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
            placeholder="If selected, max 300 characters"
          />
        </InputSection>
        <InputSection
          title="UN or other actors"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
            placeholder="If selected, max 300 characters"
          />
        </InputSection>
        <InputSection
          title="List major coordination mechanism in place"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
            placeholder="If selected, max 300 characters"
          />
        </InputSection>
      </Container>
      <Container
        heading="NEEDS IDENTIFIED"
        className={styles.eventDetails}>
        <InputSection
          title=""
          description="Select the needs that apply."
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
          title="Any identified gaps/limitations in the assessment*"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
            placeholder="Max 300 characters"
          />
        </InputSection>
      </Container>
    </>
  );
}

export default ActionsFields;

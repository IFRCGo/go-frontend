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
  NumericValueOption,
  BooleanValueOption,
  booleanOptionKeySelector,
} from '../common';

import styles from './styles.module.scss';
import RadioInput from '#components/RadioInput';
import DateInput from '#components/DateInput';
import NumberInput from '#components/NumberInput';
import { StringValueOption } from '#views/FieldReportForm/common';

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
  nationalSocietyOptions: StringValueOption[];
  fetchingCountries?: boolean;
  fetchingDistricts?: boolean;
  fetchingDisasterTypes?: boolean;
  fetchingNationalSociety?: boolean;
}

function DrefOverview(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    countryOptions,
    districtOptions,
    fetchingCountries,
    fetchingNationalSociety,
    fetchingDistricts,
    fetchingDisasterTypes,
    disasterTypeOptions,
    nationalSocietyOptions,
    error,
    onValueChange,
    value,
    yesNoOptions,
  } = props;

  return (
    <>
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
              name="title"
              value={value.title}
              onChange={onValueChange}
              error={error?.fields?.title}
            />
          </div>
        </InputSection>
        <InputSection
          title="Name of National Society*"
        >
          <SelectInput
            error={error?.fields?.national_society}
            name="national_society"
            onChange={onValueChange}
            options={nationalSocietyOptions}
            pending={fetchingNationalSociety}
            value={value.national_society}
          />
        </InputSection>
        <InputSection
          title="Disaster Details*"
        >
          <div>
            <SelectInput
              error={error?.fields?.disaster_type}
              label="Disaster type"
              name="disaster_type"
              onChange={onValueChange}
              options={disasterTypeOptions}
              pending={fetchingDisasterTypes}
              value={value.disaster_type}
            />
            <SelectInput
              error={error?.fields?.type_of_onset}
              label="Disaster Categories"
              name="type_of_onset"
              onChange={onValueChange}
              // options={districtOptions}
              // pending={fetchingDistricts}
              value={value.type_of_onset}
            />
          </div>
          <SelectInput
            error={error?.fields?.disaster_category_level}
            label="Type of onset"
            name="disaster_category_level"
            onChange={onValueChange}
            // options={districtOptions}
            // pending={fetchingDistricts}
            value={value.disaster_category_level}
          />
        </InputSection>
        <InputSection
          title="Affected country and province/region*"
        >
          <div>
            <SelectInput
              pending={fetchingCountries}
              error={error?.fields?.country}
              name="country"
              onChange={onValueChange}
              options={countryOptions}
              value={value.country}
            />
          </div>
          <div>
            <SelectInput
              pending={fetchingDistricts}
              isMulti={true}
              error={error?.fields?.country_district}
              name="country_district"
              onChange={onValueChange}
              options={districtOptions}
              value={value.country_district}
            />
            <button>Add country</button>
          </div>
        </InputSection>
        <InputSection
          title="Number of people affected/ number of people at risk"
        >
          <NumberInput
            // label={strings.fieldReportFormTitleSecondaryLabel}
            // placeholder={strings.fieldReportFormTitleInputPlaceholder}
            name="num_affected"
            value={value.num_affected}
            onChange={onValueChange}
            error={error?.fields?.num_affected}
          />
        </InputSection>
        <InputSection
          title="Name of People to be assisted"
        >
          <NumberInput
            // label={strings.fieldReportFormTitleSecondaryLabel}
            // placeholder={strings.fieldReportFormTitleInputPlaceholder}
            name="num_assisted"
            value={value.num_assisted}
            onChange={onValueChange}
            error={error?.fields?.num_assisted}
          />
        </InputSection>
        <InputSection
          title="Requested Amount"
        >
          <div>
            <NumberInput
              // label={strings.fieldReportFormTitleSecondaryLabel}
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="amount_requested"
              value={value.amount_requested}
              onChange={onValueChange}
              error={error?.fields?.amount_requested}
            />
          </div>
        </InputSection>
        <InputSection
          title="Emergency appeal planned"
        >
          <RadioInput
            name="emergency_appeal_planned"
            options={yesNoOptions}
            radioKeySelector={booleanOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            radioDescriptionSelector={optionDescriptionSelector}
            value={value.emergency_appeal_planned}
            onChange={onValueChange}
            error={error?.fields?.emergency_appeal_planned}
          />
        </InputSection>
        <InputSection
          title="Upload map">
        </InputSection>
      </Container>
      <Container
        heading="TIMEFRAMES"
        className={styles.drefOverview}>
        <InputSection
          title="Disaster date/ trigger date"
        >
          <DateInput
            name="disaster_date"
            value={value.disaster_date}
            onChange={onValueChange}
            error={error?.fields?.disaster_date}
          />
        </InputSection>
        <InputSection
          title="Date NS response started"
        >
          <DateInput
            name="ns_respond_date"
            value={value.ns_respond_date}
            onChange={onValueChange}
            error={error?.fields?.ns_respond_date}
          />
        </InputSection>
      </Container>
    </>
  );
}

export default DrefOverview;

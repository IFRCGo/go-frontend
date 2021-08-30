import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
  useFormArray,
} from '@togglecorp/toggle-form';
import {
  randomString,
  isNotDefined,
} from '@togglecorp/fujs';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import Button from '#components/Button';
import TextInput from '#components/TextInput';
import SelectInput from '#components/SelectInput';
import LanguageContext from '#root/languageContext';
import RadioInput from '#components/RadioInput';
import DateInput from '#components/DateInput';
import NumberInput from '#components/NumberInput';
import GoFileInput from '#components/GoFileInput';

import {
  optionLabelSelector,
  DrefFields,
  NumericValueOption,
  BooleanValueOption,
  booleanOptionKeySelector,
  CountryDistrict,
  ONSET_IMMINENT,
} from '../common';
import { CountryDistrictType } from '../useDrefFormOptions';
import CountryDistrictInput from './CountryDistrictInput';
import styles from './styles.module.scss';

type Value = PartialForm<DrefFields>;
interface Props {
  disasterTypeOptions: NumericValueOption[];
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  yesNoOptions: BooleanValueOption[];
  countryOptions: NumericValueOption[];
  nationalSocietyOptions: NumericValueOption[];
  disasterCategoryOptions: NumericValueOption[];
  onsetOptions: NumericValueOption[];
  fetchingCountries?: boolean;
  fetchingDisasterTypes?: boolean;
  fetchingNationalSociety?: boolean;
}

function DrefOverview(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    countryOptions,
    fetchingCountries,
    fetchingNationalSociety,
    fetchingDisasterTypes,
    disasterTypeOptions,
    nationalSocietyOptions,
    error,
    onValueChange,
    value,
    yesNoOptions,
    disasterCategoryOptions,
    onsetOptions,
  } = props;

  const {
    onValueChange: onCountryDistrictChange,
    onValueRemove: onCountryDistrictRemove,
  } = useFormArray<'country_district', PartialForm<CountryDistrict>>(
    'country_district',
    onValueChange,
  );

  type CountryDistricts = typeof value.country_district;

  const handleCountryDistrictAdd = React.useCallback(() => {
    const clientId = randomString();
    const newList: PartialForm<CountryDistrictType> = {
      clientId,
    };

    onValueChange(
      (oldValue: PartialForm<CountryDistricts>) => (
        [...(oldValue ?? []), newList]
      ),
      'country_district' as const,
    );
  }, [onValueChange]);

  const isImminentOnset = value.type_of_onset === ONSET_IMMINENT;

  // FIXME: use translations
  return (
    <>
      <Container
        heading={strings.essentialInformation}
        className={styles.essentialInformation}
      >
        <InputSection title={strings.drefFormTitle}>
          <TextInput
            name="title"
            value={value.title}
            onChange={onValueChange}
            error={error?.fields?.title}
          />
        </InputSection>
        <InputSection
          title={strings.nationalSociety}
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
          title={strings.disasterDetails}
          multiRow
          twoColumn
        >
          <SelectInput
            error={error?.fields?.disaster_type}
            label={strings.disasterTypeLabel}
            name="disaster_type"
            onChange={onValueChange}
            options={disasterTypeOptions}
            pending={fetchingDisasterTypes}
            value={value.disaster_type}
          />
          <SelectInput
            error={error?.fields?.type_of_onset}
            label={strings.typeOfOnsetLabel}
            name="type_of_onset"
            onChange={onValueChange}
            options={onsetOptions}
            value={value.type_of_onset}
          />
          <SelectInput
            error={error?.fields?.disaster_category}
            label={strings.disasterCategoryLabel}
            name="disaster_category"
            onChange={onValueChange}
            options={disasterCategoryOptions}
            value={value.disaster_category}
          />
        </InputSection>
        <InputSection
          title={isImminentOnset ? strings.affectedCountryAndProvinceImminent : strings.affectedCountryAndProvince}
          multiRow
          oneColumn
        >
          {value.country_district?.map((c, i) => (
            <CountryDistrictInput
              key={c.clientId}
              index={i}
              value={c}
              onChange={onCountryDistrictChange}
              onRemove={onCountryDistrictRemove}
              error={error?.fields?.country_district}
              countryOptions={countryOptions}
              fetchingCountries={fetchingCountries}
            />
          ))}
          <div className={styles.actions}>
            <Button
              name={undefined}
              onClick={handleCountryDistrictAdd}
              variant="secondary"
            >
              Add Country
            </Button>
          </div>
        </InputSection>
        <InputSection
          title={strings.peopleAffected}
        >
          <NumberInput
            name="num_affected"
            value={value.num_affected}
            onChange={onValueChange}
            error={error?.fields?.num_affected}
          />
        </InputSection>
        <InputSection
          title={strings.requestAmount}
        >
          <NumberInput
            name="amount_requested"
            value={value.amount_requested}
            onChange={onValueChange}
            error={error?.fields?.amount_requested}
          />
        </InputSection>
        <InputSection
          title={strings.emergencyAppealPlanned}
        >
          <RadioInput
            name="emergency_appeal_planned"
            options={yesNoOptions}
            radioKeySelector={booleanOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            value={value.emergency_appeal_planned}
            onChange={onValueChange}
            error={error?.fields?.emergency_appeal_planned}
          />
        </InputSection>
        <InputSection
          title={strings.uploadMap}
        >
          <GoFileInput
            name="event_map"
            value={value.event_map}
            onChange={onValueChange}
            accept="image/*"
            error={error?.fields?.event_map}
            showStatus
          >
            Upload
          </GoFileInput>
        </InputSection>
      </Container>
      <Container
        heading={strings.timeFrames}
        className={styles.timeframes}
      >
        <InputSection
          title={strings.eventDate}
        >
          <DateInput
            name="event_date"
            value={value.event_date}
            onChange={onValueChange}
            error={error?.fields?.event_date}
          />
        </InputSection>
        <InputSection
          title={strings.goFieldReportDate}
        >
          <DateInput
            name="go_field_report_date"
            value={value.go_field_report_date}
            onChange={onValueChange}
            error={error?.fields?.go_field_report_date}
          />
        </InputSection>
        <InputSection
          title={strings.nsResponseStarted}
        >
          <DateInput
            name="ns_respond_date"
            value={value.ns_respond_date}
            min={value.event_date}
            onChange={onValueChange}
            error={error?.fields?.ns_respond_date}
            disabled={isNotDefined(value.event_date)}
          />
        </InputSection>
      </Container>
    </>
  );
}

export default DrefOverview;

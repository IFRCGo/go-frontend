import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
  useFormArray,
} from '@togglecorp/toggle-form';
import { randomString } from '@togglecorp/fujs';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import Button from '#components/Button';
import TextInput from '#components/TextInput';
import SelectInput from '#components/SelectInput';
import LanguageContext from '#root/languageContext';
import RadioInput from '#components/RadioInput';
import DateInput from '#components/DateInput';
import NumberInput from '#components/NumberInput';
import { StringValueOption } from '#views/FieldReportForm/common';

import {
  optionLabelSelector,
  optionDescriptionSelector,
  DrefFields,
  NumericValueOption,
  BooleanValueOption,
  booleanOptionKeySelector,
  CountryDistrict,
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
  nationalSocietyOptions: StringValueOption[];
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

  type CountryDistricts  = typeof value.country_district;

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

  // FIXME: use translations
  return (
    <>
      <Container
        heading="Essential Information"
        className={styles.essentialInformation}
        sub
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
          multiRow
          twoColumn
        >
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
            label="Type of Onset"
            name="type_of_onset"
            onChange={onValueChange}
            options={onsetOptions}
            value={value.type_of_onset}
          />
          <SelectInput
            error={error?.fields?.disaster_category_level}
            label="Disaster Category"
            name="disaster_category_level"
            onChange={onValueChange}
            options={disasterCategoryOptions}
            value={value.disaster_category_level}
          />
        </InputSection>
        <InputSection
          title="Affected country and province/region*"
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
              onClick={handleCountryDistrictAdd}
              variant="secondary"
            >
              Add Country
            </Button>
          </div>
        </InputSection>
        <InputSection
          title="Number of people affected/ number of people at risk"
        >
          <NumberInput
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
            name="num_assisted"
            value={value.num_assisted}
            onChange={onValueChange}
            error={error?.fields?.num_assisted}
          />
        </InputSection>
        <InputSection
          title="Requested Amount"
        >
          <NumberInput
            name="amount_requested"
            value={value.amount_requested}
            onChange={onValueChange}
            error={error?.fields?.amount_requested}
          />
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
      </Container>
      <Container
        heading="Timeframes"
        className={styles.timeframes}
        sub
      >
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

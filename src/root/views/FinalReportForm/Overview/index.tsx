import React from 'react';
import {
  EntriesAsList,
  Error,
  getErrorObject,
  PartialForm,
  SetBaseValueArg,
  useFormArray,
} from '@togglecorp/toggle-form';
import { IoHelpCircle } from 'react-icons/io5';
import { randomString } from '@togglecorp/fujs';

import Container from '#components/Container';
import DateInput from '#components/DateInput';
import InputSection from '#components/InputSection';
import NumberInput from '#components/NumberInput';
import languageContext from '#root/languageContext';
import Button from '#components/Button';
import TextInput from '#components/TextInput';
import SelectInput from '#components/SelectInput';
import CountryDistrictInput from '#views/DrefApplicationForm/DrefOverview/CountryDistrictInput';

import {
  BooleanValueOption,
  CountryDistrict,
  DrefFinalReportFields,
  NumericValueOption,
  ONSET_IMMINENT,
} from '../common';
import { CountryDistrictType } from '../useDreFinalReportOptions';

import styles from './styles.module.scss';

type Value = PartialForm<DrefFinalReportFields>;
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
  fileIdToUrlMap: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  onValueSet: (value: SetBaseValueArg<Value>) => void;
  userOptions: NumericValueOption[];
  onCreateAndShareButtonClick: () => void;
}

function Overview(props: Props) {
  const { strings } = React.useContext(languageContext);

  const {
    countryOptions,
    fetchingCountries,
    fetchingNationalSociety,
    fetchingDisasterTypes,
    disasterTypeOptions,
    nationalSocietyOptions,
    error: formError,
    onValueChange,
    value,
    yesNoOptions,
    disasterCategoryOptions,
    onsetOptions,
    setFileIdToUrlMap,
    fileIdToUrlMap,
  } = props;

  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError]
  );

  const {
    setValue: onCountryDistrictChange,
    removeValue: onCountryDistrictRemove,
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

  return (
    <>
      <Container
        heading={strings.finalReportEssentialInformationTitle}
        className={styles.essentialInformation}
      >
        <InputSection title={strings.finalReportEssentialTitle}>
          <TextInput
            name="title"
            value={value.title}
            onChange={onValueChange}
            error={error?.title}
            placeholder={strings.finalReportEssentialDescription}
          />
        </InputSection>
        <InputSection
          title={strings.finalReportNationalSociety}
        >
          <SelectInput
            name={"national_society" as const}
            value={value.national_society}
            onChange={onValueChange}
            options={nationalSocietyOptions}
            error={error?.national_society}
            pending={fetchingNationalSociety}
          />
        </InputSection>
        <InputSection
          title={isImminentOnset ? strings.finalReportImminentDisasterDetails : strings.finalReportDisasterDetails}
          multiRow
          twoColumn
        >
          <SelectInput
            error={error?.disaster_type}
            label={isImminentOnset ? strings.finalReportImminentDisasterTypeLabel : strings.finalReportDisasterTypeLabel}
            name={"disaster_type" as const}
            onChange={onValueChange}
            options={disasterTypeOptions}
            pending={fetchingDisasterTypes}
            value={value.disaster_type}
          />
          <SelectInput
            error={error?.type_of_onset}
            label={strings.finalReportTypeOfOnsetLabel}
            name={"type_of_onset" as const}
            onChange={onValueChange}
            options={onsetOptions}
            value={value.type_of_onset}
          />
          <SelectInput
            error={error?.disaster_category}
            label={(
              <>
                {strings.finalReportDisasterCategoryLabel}
                <a
                  className={styles.disasterCategoryHelpLink}
                  target="_blank"
                  title="Click to view Emergency Response Framework"
                  href="https://www.ifrc.org/sites/default/files/2021-07/IFRC%20Emergency%20Response%20Framework%20-%202017.pdf"
                >
                  <IoHelpCircle />
                </a>
              </>
            )}
            name={"disaster_category" as const}
            onChange={onValueChange}
            options={disasterCategoryOptions}
            value={value.disaster_category}
          />
        </InputSection>
        <InputSection
          title={!isImminentOnset ? strings.finalReportAffectedCountryAndProvinceImminent : strings.finalReportRiskCountryLabel}
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
              error={getErrorObject(error?.country_district)}
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
              {strings.finalReportAddCountryLabel}
            </Button>
          </div>
        </InputSection>
        <InputSection
          title={!isImminentOnset ? strings.finalReportPeopleAffected : strings.finalReportRiskPeopleLabel}
        >
          <NumberInput
            name="number_of_people_affected"
            value={value.number_of_people_affected}
            onChange={onValueChange}
            error={error?.number_of_people_affected}
          />
        </InputSection>
        <InputSection
          title={strings.finalReportPeopleTargeted}
        >
          <NumberInput
            name="number_of_people_targeted"
            value={value.number_of_people_targeted}
            onChange={onValueChange}
            error={error?.number_of_people_targeted}
          />
        </InputSection>
        <InputSection
          title={strings.finalReportTotalAllocation}
        >
          <NumberInput
            name="total_dref_allocation"
            value={value.total_dref_allocation}
            onChange={undefined}
            error={error?.total_dref_allocation}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.finalReportTimeFrame}
        className={styles.timeframes}
      >
        <InputSection
          title={strings.finalReportDateOfPublication}
        >
          <DateInput
            name="date_of_publication"
            value={value.date_of_publication}
            onChange={onValueChange}
            error={error?.date_of_publication}
          />
        </InputSection>
        <InputSection
          title={strings.finalReportStartOfOperation}
        >
          <DateInput
            name="new_operational_start_date"
            value={value.new_operational_start_date}
            onChange={onValueChange}
            error={error?.new_operational_start_date}
          />
        </InputSection>
        <InputSection
          title={strings.finalReportTotalOperatingTimeFrame}
        >
          <NumberInput
            name="total_operation_timeframe"
            value={value.total_operation_timeframe}
            onChange={onValueChange}
            error={error?.total_operation_timeframe}
          />
        </InputSection>
      </Container>
    </>
  );
}

export default Overview;

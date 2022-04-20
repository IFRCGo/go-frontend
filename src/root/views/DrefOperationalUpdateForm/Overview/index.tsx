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

import Container from '#components/Container';
import DateInput from '#components/DateInput';
import InputSection from '#components/InputSection';
import NumberInput from '#components/NumberInput';
import languageContext from '#root/languageContext';
import { randomString } from '@togglecorp/fujs';
import Button from '#components/Button';
import TextInput from '#components/TextInput';
import SelectInput from '#components/SelectInput';
import CountryDistrictInput from '#views/DrefApplicationForm/DrefOverview/CountryDistrictInput';
import RadioInput from '#components/RadioInput';
import DREFFileInput from '#components/DREFFileInput';

import {
  booleanOptionKeySelector,
  BooleanValueOption,
  CountryDistrict,
  DrefOperationalUpdateFields,
  NumericValueOption,
  ONSET_IMMINENT,
  optionLabelSelector,
} from '../common';
import { CountryDistrictType } from '../useDrefOperationalUpdateOptions';

import styles from './styles.module.scss';

type Value = PartialForm<DrefOperationalUpdateFields>;
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
        heading={strings.drefFormEssentialInformation}
        className={styles.essentialInformation}
      >
        <InputSection title={strings.drefFormTitle}>
          <TextInput
            name="title"
            value={value.title}
            onChange={onValueChange}
            error={error?.title}
            placeholder={strings.drefFormTitleDescription}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormNationalSociety}
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
          title={isImminentOnset ? strings.drefFormImminentDisasterDetails : strings.drefFormDisasterDetails}
          multiRow
          twoColumn
        >
          <SelectInput
            error={error?.disaster_type}
            label={isImminentOnset ? strings.drefFormImminentDisasterTypeLabel : strings.drefFormDisasterTypeLabel}
            name={"disaster_type" as const}
            onChange={onValueChange}
            options={disasterTypeOptions}
            pending={fetchingDisasterTypes}
            value={value.disaster_type}
          />
          <SelectInput
            error={error?.type_of_onset}
            label={strings.drefFormTypeOfOnsetLabel}
            name={"type_of_onset" as const}
            onChange={onValueChange}
            options={onsetOptions}
            value={value.type_of_onset}
          />
          <SelectInput
            error={error?.disaster_category}
            label={(
              <>
                {strings.drefFormDisasterCategoryLabel}
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
          title={!isImminentOnset ? strings.drefFormAffectedCountryAndProvinceImminent : strings.drefFormRiskCountryLabel}
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
              {strings.drefFormAddCountryLabel}
            </Button>
          </div>
        </InputSection>
        <InputSection
          title={!isImminentOnset ? strings.drefFormPeopleAffected : strings.drefFormRiskPeopleLabel}
        >
          <NumberInput
            name="number_of_people_affected"
            value={value.number_of_people_affected}
            onChange={onValueChange}
            error={error?.number_of_people_affected}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormPeopleTargeted}
        >
          <NumberInput
            name="number_of_people_targeted"
            value={value.number_of_people_targeted}
            onChange={onValueChange}
            error={error?.number_of_people_targeted}
          />
        </InputSection>
        <InputSection
          title={strings.drefOperationalUpdateAdditionalAllocationRequested}
        >
          <NumberInput
            name="additional_allocation"
            value={value.additional_allocation}
            onChange={onValueChange}
            error={error?.additional_allocation}
          />
        </InputSection>
        <InputSection
          title={strings.drefOperationalUpdateTotalAllocation}
        >
          <NumberInput
            name="total_dref_allocation"
            value={value.total_dref_allocation}
            onChange={onValueChange}
            error={error?.total_dref_allocation}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormEmergencyAppealPlanned}
        >
          <RadioInput
            name={"emergency_appeal_planned" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.emergency_appeal_planned}
            onChange={onValueChange}
            error={error?.emergency_appeal_planned}
          />
        </InputSection>
        <InputSection
          title={strings.drerfOperationalUpdateImageLabel}
        >
          <DREFFileInput
            name="images"
            value={value.images}
            onChange={onValueChange}
            accept="image/*"
            multiple
            showStatus
            error={error?.images}
            fileIdToUrlMap={fileIdToUrlMap}
            setFileIdToUrlMap={setFileIdToUrlMap}
          >
            Select images
          </DREFFileInput>
        </InputSection>
        <InputSection
          title={strings.drefOperationalUpdateNumber}
        >
          <NumberInput
            readOnly
            name="operational_update_number"
            value={value.operational_update_number}
            onChange={onValueChange}
            error={error?.operational_update_number}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.drefFormTimeFrames}
        className={styles.timeframes}
      >
        <InputSection
          title={strings.drefOperationalUpdateTimeFrameDateOfEvent}
        >
          <DateInput
            name="update_date"
            value={value.update_date}
            onChange={onValueChange}
            error={error?.update_date}
          />
        </InputSection>
        <InputSection
          title={strings.drefOperationalUpdateTimeFrameReportingTimeFrame}
        >
          <DateInput
            name="reporting_timeframe"
            value={value.reporting_timeframe}
            onChange={onValueChange}
            error={error?.reporting_timeframe}
          />
        </InputSection>
        <InputSection
          title={strings.drefOperationalUpdateTimeFrameExtensionRequested}
        >
          <RadioInput
            name={"is_timeframe_extension_required" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.is_timeframe_extension_required}
            onChange={onValueChange}
            error={error?.is_timeframe_extension_required}
          />
        </InputSection>
        <InputSection
          title={strings.drefOperationalUpdateTimeFrameExtensionRequestedIfYes}
        >
          <DateInput
            name="new_operational_end_date"
            value={value.new_operational_end_date}
            onChange={onValueChange}
            error={error?.new_operational_end_date}
          />
        </InputSection>
        <InputSection
          title={strings.drefOperationalUpdateTimeFrameTotalOperatingTimeFrame}
        >
          <NumberInput
            name="total_operation_timeframe"
            value={value.total_operation_timeframe}
            onChange={onValueChange}
            error={error?.total_operation_timeframe}
          />
        </InputSection>
        <InputSection
          title={strings.drefOperationalUpdateTimeFrameDateOfApproval}
        >
          <DateInput
            name="date_of_approval"
            value={value.date_of_approval}
            onChange={onValueChange}
            error={error?.date_of_approval}
          />
        </InputSection>
      </Container>
    </>
  );
}

export default Overview;

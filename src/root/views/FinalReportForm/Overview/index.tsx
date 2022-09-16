import React from 'react';
import {
  EntriesAsList,
  Error,
  getErrorObject,
  PartialForm,
} from '@togglecorp/toggle-form';
import { IoHelpCircle } from 'react-icons/io5';

import Container from '#components/Container';
import DateInput from '#components/DateInput';
import InputSection from '#components/InputSection';
import NumberInput from '#components/NumberInput';
import languageContext from '#root/languageContext';
import TextInput from '#components/TextInput';
import SelectInput from '#components/SelectInput';
import { ListResponse, useRequest } from '#utils/restRequest';
import { DistrictMini } from '#types/country';
import { compareString } from '#utils/utils';

import {
  DrefFinalReportFields,
  emptyNumericOptionList,
  NumericValueOption,
  ONSET_IMMINENT,
} from '../common';

import styles from './styles.module.scss';

type Value = PartialForm<DrefFinalReportFields>;
interface Props {
  countryOptions: NumericValueOption[];
  fetchingCountries?: boolean;
  fetchingDisasterTypes?: boolean;
  fetchingNationalSociety?: boolean;
  disasterTypeOptions: NumericValueOption[];
  nationalSocietyOptions: NumericValueOption[];
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  disasterCategoryOptions: NumericValueOption[];
  onsetOptions: NumericValueOption[];
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
    disasterCategoryOptions,
    onsetOptions,
  } = props;

  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError]
  );

  const countryQuery = React.useMemo(() => ({
    country: value.country,
    limit: 500,
  }), [value.country]);

  const {
    pending: fetchingDistricts,
    response: districtsResponse,
  } = useRequest<ListResponse<DistrictMini>>({
    skip: !value.country,
    url: 'api/v2/district/',
    query: countryQuery,
  });

  const districtOptions = React.useMemo(() => (
    districtsResponse?.results?.map(d => ({
      value: d.id,
      label: d.name,
    })).sort(compareString) ?? emptyNumericOptionList
  ), [districtsResponse]);

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
          title={isImminentOnset
            ? strings.finalReportImminentDisasterDetails
            : strings.finalReportDisasterDetails}
          multiRow
          twoColumn
        >
          <SelectInput
            error={error?.disaster_type}
            label={isImminentOnset
              ? strings.finalReportImminentDisasterTypeLabel
              : strings.finalReportDisasterTypeLabel}
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
                  title={strings.clickToViewEmergencyResponseFramework}
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
          title={!isImminentOnset
            ? strings.finalReportAffectedCountryAndProvinceImminent
            : strings.finalReportRiskCountryLabel}
          multiRow
          oneColumn
        >
          <SelectInput
            label={strings.drefFormAddCountry}
            pending={fetchingCountries}
            error={error?.country}
            name={"country" as const}
            onChange={onValueChange}
            options={countryOptions}
            value={value.country}

          />
          <SelectInput<"district", number>
            label={strings.drefFormAddRegion}
            pending={fetchingDistricts}
            isMulti={true}
            error={error?.district}
            name="district"
            onChange={onValueChange}
            options={districtOptions}
            value={value.district}
          />
        </InputSection>
        <InputSection
          title={!isImminentOnset
            ? strings.finalReportPeopleAffected
            : strings.finalReportRiskPeopleLabel}
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
            error={error?.total_dref_allocation}
            readOnly
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
            name="operation_start_date"
            value={value.operation_start_date}
            onChange={onValueChange}
            error={error?.operation_start_date}
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

import React, { useCallback, useContext, useMemo } from 'react';
import {
  EntriesAsList,
  Error,
  getErrorObject,
  PartialForm,
  SetBaseValueArg,
} from '@togglecorp/toggle-form';
import { IoHelpCircle } from 'react-icons/io5';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import NumberInput from '#components/NumberInput';
import languageContext from '#root/languageContext';
import TextInput from '#components/TextInput';
import SelectInput from '#components/SelectInput';
import RadioInput from '#components/RadioInput';
import {
  rankedSearchOnList,
  sumSafe,
} from '#utils/common';
import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import { DistrictMini } from '#types/country';
import { compareString } from '#utils/utils';
import SearchSelectInput from '#components/SearchSelectInput';
import { isNotDefined, listToMap } from '@togglecorp/fujs';
import Button from '#components/Button';
import ImageWithCaptionInput from '#views/DrefApplicationForm/DrefOverview/ImageWithCaptionInput';

import {
  booleanOptionKeySelector,
  BooleanValueOption,
  DISASTER_FIRE,
  DISASTER_FLASH_FLOOD,
  DISASTER_FLOOD,
  DrefOperationalUpdateFields,
  emptyNumericOptionList,
  NumericValueOption,
  optionLabelSelector,
} from '../common';

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
  drefTypeOptions: NumericValueOption[] | undefined;
  isImminentDref: boolean;
  isSuddenOnset: boolean;
}

function Overview(props: Props) {
  const { strings } = useContext(languageContext);

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
    userOptions,
    onCreateAndShareButtonClick,
    onValueSet,
    drefTypeOptions,
    isSuddenOnset,
    isImminentDref,
  } = props;

  const error = useMemo(
    () => getErrorObject(formError),
    [formError]
  );

  const suddenDependentValue = isSuddenOnset ? false : value.emergency_appeal_planned;
  onValueChange(suddenDependentValue, 'emergency_appeal_planned');

  const totalDrefAllocation = useMemo(() => (
    sumSafe([
      value.dref_allocated_so_far,
      value.additional_allocation,
    ])
  ), [value.dref_allocated_so_far, value.additional_allocation]);

  onValueChange(totalDrefAllocation, 'total_dref_allocation');
  const countryQuery = useMemo(() => ({
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

  const districtOptions = useMemo(() => (
    districtsResponse?.results?.map(d => ({
      value: d.id,
      label: d.name,
    })).sort(compareString) ?? emptyNumericOptionList
  ), [districtsResponse]);

  const handleTitleChange = useCallback(() => {
    const getCurrentCountryValue = value?.country;
    const countryName = countryOptions.filter((cd) => cd.value === getCurrentCountryValue).map((c) => c.label);
    const filteredDisasterTypeName = disasterTypeOptions.filter((dt) => dt.value === value.disaster_type).map((dt) => dt.label).toString();

    const currentYear = new Date().getFullYear();
    const title = `${countryName} ${filteredDisasterTypeName} ${currentYear}`;
    onValueChange(title, 'title');
  }, [
    countryOptions,
    disasterTypeOptions,
    value.disaster_type,
    value.country,
    onValueChange,
  ]);

  const handleNSChange = useCallback((ns) => {
    onValueSet({
      ...value,
      national_society: ns,
      country: ns,
    });
  }, [
    value,
    onValueSet,
  ]);

  const handleUserSearch = useCallback((input: string | undefined, callback) => {
    if (!input) {
      callback(emptyNumericOptionList);
    }

    callback(rankedSearchOnList(
      userOptions,
      input,
      d => d.label,
    ));
  }, [userOptions]);

  const userMap = useMemo(() => listToMap(
    userOptions,
    u => u.value,
    u => u.label
  ), [userOptions]);

  const initialOptions = useMemo(() => (
    value.users?.map((u) => ({
      label: userMap[u],
      value: u,
    }))
  ), [userMap, value.users]);

  const showManMadeEventInput = value?.disaster_type === DISASTER_FIRE
    || value?.disaster_type === DISASTER_FLASH_FLOOD
    || value?.disaster_category === DISASTER_FLOOD;

  const disasterCategoryLink = "https://www.ifrc.org/sites/default/files/2021-07/IFRC%20Emergency%20Response%20Framework%20-%202017.pdf";
  const totalPopulationRiskImminentLink = "https://ifrcorg.sharepoint.com/sites/IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF%2FHum%20Pop%20Definitions%20for%20DREF%20Form%5F21072022%2Epdf&parent=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF&p=true&ga=1";
  const totalPeopleAffectedSlowSuddenLink = "https://ifrcorg.sharepoint.com/sites/IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF%2FHum%20Pop%20Definitions%20for%20DREF%20Form%5F21072022%2Epdf&parent=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF&p=true&ga=1";
  const peopleTargetedLink = "https://ifrcorg.sharepoint.com/sites/IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF%2FHum%20Pop%20Definitions%20for%20DREF%20Form%5F21072022%2Epdf&parent=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF&p=true&ga=1";
  const peopleInNeedLink = "https://ifrcorg.sharepoint.com/sites/IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF%2FHum%20Pop%20Definitions%20for%20DREF%20Form%5F21072022%2Epdf&parent=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF&p=true&ga=1";

  return (
    <>
      <Container
        className={styles.sharing}
        heading={strings.drefFormSharingHeading}
        visibleOverflow
      >
        <InputSection
          title={strings.drefFormSharingTitle}
          description={strings.drefFormSharingDescription}
        >
          <SearchSelectInput
            name={"users" as const}
            isMulti
            initialOptions={initialOptions}
            value={value.users}
            onChange={onValueChange}
            loadOptions={handleUserSearch}
          />
          {isNotDefined(value.id) && (
            <div className={styles.actions}>
              <Button
                name={undefined}
                variant="secondary"
                disabled={isNotDefined(value.users) || value.users.length === 0}
                onClick={onCreateAndShareButtonClick}
              >
                {strings.drefFormInstantShareLabel}
              </Button>
            </div>
          )}
        </InputSection>
      </Container>
      <Container
        heading={strings.drefFormEssentialInformation}
        className={styles.essentialInformation}
      >
        <InputSection
          title={strings.drefFormNationalSociety}
        >
          <SelectInput
            name={"national_society" as const}
            value={value.national_society}
            onChange={handleNSChange}
            options={nationalSocietyOptions}
            error={error?.national_society}
            pending={fetchingNationalSociety}
          />
        </InputSection>
        <InputSection title={strings.drefOperationalUpdateDREFType}>
          <SelectInput
            error={error?.type_of_dref}
            label={strings.drefOperationalUpdateTypeOfDREF}
            name={"type_of_dref" as const}
            onChange={onValueChange}
            options={drefTypeOptions}
            value={value.type_of_dref}
          />
        </InputSection>
        <InputSection
          title={
            isImminentDref ?
              strings.drefFormImminentDisasterDetails :
              strings.drefFormDisasterDetails
          }
          multiRow
          twoColumn
        >
          <SelectInput
            error={error?.disaster_type}
            label={
              isImminentDref ?
                strings.drefFormImminentDisasterTypeLabel
                : strings.drefFormDisasterTypeLabel
            }
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
          {showManMadeEventInput &&
            <RadioInput
              label={strings.drefFormManMadeEvent}
              name={"is_man_made_event" as const}
              options={yesNoOptions}
              keySelector={booleanOptionKeySelector}
              labelSelector={optionLabelSelector}
              value={value.is_man_made_event}
              onChange={onValueChange}
              error={error?.is_man_made_event}
            />
          }
          <SelectInput
            error={error?.disaster_category}
            label={(
              <>
                {strings.drefFormDisasterCategoryLabel}
                <a
                  className={styles.disasterCategoryHelpLink}
                  target="_blank"
                  title="Click to view Emergency Response Framework"
                  href={disasterCategoryLink}
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
          title={
            !isImminentDref ?
              strings.drefFormAffectedCountryAndProvinceImminent
              : strings.drefFormRiskCountryLabel
          }
          twoColumn
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
        <InputSection title={strings.drefFormTitle}>
          <TextInput
            name="title"
            value={value.title}
            onChange={onValueChange}
            error={error?.title}
          />
          <Button
            className={styles.generateTitleButton}
            name={undefined}
            variant="secondary"
            onClick={handleTitleChange}
          >
            {strings.drefFormGenerateTitle}
          </Button>
        </InputSection>
        <InputSection
          multiRow
          twoColumn
        >
          <NumberInput
            label={isImminentDref ?
              <>
                {strings.drefFormRiskPeopleLabel}
                <a
                  className={styles.peopleTargetedHelpLink}
                  target="_blank"
                  title="Click to view Emergency Response Framework"
                  href={totalPopulationRiskImminentLink}
                >
                  <IoHelpCircle />
                </a>
              </>
              :
              <>
                {strings.drefFormPeopleAffected}
                <a
                  className={styles.peopleTargetedHelpLink}
                  target="_blank"
                  title="Click to view Emergency Response Framework"
                  href={totalPeopleAffectedSlowSuddenLink}
                >
                  <IoHelpCircle />
                </a>
              </>
            }
            name="number_of_people_affected"
            value={value.number_of_people_affected}
            onChange={onValueChange}
            error={error?.number_of_people_affected}
            hint={isImminentDref
              ? strings.drefFormPeopleAffectedDescriptionImminent
              : strings.drefFormPeopleAffectedDescriptionSlowSudden
            }
          />
          <NumberInput
            label={(
              <>
                {
                  isImminentDref
                    ? strings.drefFormEstimatedPeopleInNeed
                    : strings.drefFormPeopleInNeed
                }
                <a
                  className={styles.peopleTargetedHelpLink}
                  target="_blank"
                  title="Click to view Emergency Response Framework"
                  href={peopleInNeedLink}
                >
                  <IoHelpCircle />
                </a>
              </>
            )}
            name="people_in_need"
            value={value.people_in_need}
            onChange={onValueChange}
            error={error?.people_in_need}
            hint={isImminentDref
              ? strings.drefFormPeopleInNeedDescriptionImminent
              : strings.drefFormPeopleInNeedDescriptionSlowSudden
            }
          />
          <NumberInput
            label={(
              <>
                {strings.drefFormPeopleTargeted}
                <a
                  className={styles.peopleTargetedHelpLink}
                  target="_blank"
                  title="Click to view Emergency Response Framework"
                  href={peopleTargetedLink}
                >
                  <IoHelpCircle />
                </a>
              </>
            )}
            name="number_of_people_targeted"
            value={value.number_of_people_targeted}
            onChange={onValueChange}
            error={error?.number_of_people_targeted}
            hint={strings.drefFormPeopleTargetedDescription}
          />
          <div />
        </InputSection>

        <InputSection
          title={strings.drefOperationalUpdateAllocationSoFar}
        >
          <NumberInput
            name="dref_allocated_so_far"
            value={value.dref_allocated_so_far}
            onChange={undefined}
            error={error?.dref_allocated_so_far}
            readOnly
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
            onChange={undefined}
            error={error?.total_dref_allocation}
            readOnly
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
          title={strings.drefFormUploadMap}
          description={strings.drefFormUploadMapDescription}
        >
          <ImageWithCaptionInput
            name={"event_map_file" as const}
            value={value?.event_map_file}
            onChange={onValueChange}
            error={error?.event_map_file}
            fileIdToUrlMap={fileIdToUrlMap}
            setFileIdToUrlMap={setFileIdToUrlMap}
            label={strings.drefFormUploadAnImageLabel}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormUploadCoverImage}
          description={strings.drefFormUploadCoverImageDescription}
        >
          <ImageWithCaptionInput
            name={"cover_image_file" as const}
            value={value?.cover_image_file}
            onChange={onValueChange}
            error={error?.cover_image_file}
            fileIdToUrlMap={fileIdToUrlMap}
            setFileIdToUrlMap={setFileIdToUrlMap}
            label={strings.drefFormUploadAnImageLabel}
          />
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
    </>
  );
}

export default Overview;

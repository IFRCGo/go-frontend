import React, { useCallback } from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
  getErrorObject,
  SetBaseValueArg,
} from '@togglecorp/toggle-form';
import {
  listToMap,
  isNotDefined,
} from '@togglecorp/fujs';
import { IoHelpCircle } from 'react-icons/io5';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import Button from '#components/Button';
import TextInput from '#components/TextInput';
import SelectInput from '#components/SelectInput';
import SearchSelectInput from '#components/SearchSelectInput';
import LanguageContext from '#root/languageContext';
import RadioInput from '#components/RadioInput';
import NumberInput from '#components/NumberInput';
import { rankedSearchOnList } from '#utils/common';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import { DistrictMini } from '#types/country';
import { compareString } from '#utils/utils';

import CopyFieldReportSection from './CopyFieldReportSection';
import {
  optionLabelSelector,
  DrefFields,
  NumericValueOption,
  BooleanValueOption,
  booleanOptionKeySelector,
  ONSET_IMMINENT,
  emptyNumericOptionList,
  // ONSET_SUDDEN,
} from '../common';

import ImageWithCaptionInput from './ImageWithCaptionInput';

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
  fileIdToUrlMap: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  onValueSet: (value: SetBaseValueArg<Value>) => void;
  userOptions: NumericValueOption[];
  onCreateAndShareButtonClick: () => void;
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
    error: formError,
    onValueChange,
    value,
    yesNoOptions,
    disasterCategoryOptions,
    onsetOptions,
    setFileIdToUrlMap,
    fileIdToUrlMap,
    onValueSet,
    userOptions,
    onCreateAndShareButtonClick,
  } = props;

  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError]
  );

  const isImminentOnset = value?.type_of_onset === ONSET_IMMINENT;
  // const isSuddenOnset = value?.type_of_onset === ONSET_SUDDEN ? false : value.emergency_appeal_planned;

  //onValueChange(isSuddenOnset, 'emergency_appeal_planned');

  const handleUserSearch = React.useCallback((input: string | undefined, callback) => {
    if (!input) {
      callback(emptyNumericOptionList);
    }

    callback(rankedSearchOnList(
      userOptions,
      input,
      d => d.label,
    ));
  }, [userOptions]);

  const userMap = React.useMemo(() => listToMap(
    userOptions,
    u => u.value,
    u => u.label
  ), [userOptions]);

  const initialOptions = React.useMemo(() => (
    value.users?.map((u) => ({
      label: userMap[u],
      value: u,
    }))
  ), [userMap, value.users]);

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
            error={error?.national_society}
            name={"national_society" as const}
            onChange={handleNSChange}
            options={nationalSocietyOptions}
            pending={fetchingNationalSociety}
            value={value.national_society}
          />
        </InputSection>
        <CopyFieldReportSection
          value={value}
          onValueSet={onValueSet}
        />
        <InputSection
          title={
            isImminentOnset
              ? strings.drefFormImminentDisasterDetails
              : strings.drefFormDisasterDetails
          }
          multiRow
          twoColumn
        >
          <SelectInput
            error={error?.disaster_type}
            label={
              isImminentOnset
                ? strings.drefFormImminentDisasterTypeLabel
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
          <SelectInput
            error={error?.disaster_category}
            label={(
              <>
                {isImminentOnset
                  ? strings.drefFormImminentDisasterCategoryLabel
                  : strings.drefFormDisasterCategoryLabel}
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
          title={
            !isImminentOnset
              ? strings.drefFormAffectedCountryAndProvinceImminent
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
            name="title_prefix"
            value={value.title_prefix}
            error={error?.title_prefix}
            prefix={value.title_prefix}
            disabled
          />
          <TextInput
            name="title"
            value={value.title}
            onChange={onValueChange}
            error={error?.title}
            placeholder={strings.drefFormTitleDescription}
          />
        </InputSection>
        <InputSection
          multiRow
          twoColumn
        >
          <NumberInput
            label={isImminentOnset ?
              <>
                {strings.drefFormRiskPeopleLabel}
                <a
                  className={styles.peopleTargetedHelpLink}
                  target="_blank"
                  title="Click to view Emergency Response Framework"
                  href="https://ifrcorg.sharepoint.com/sites/IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF%2FHum%20Pop%20Definitions%20for%20DREF%20Form%5F21072022%2Epdf&parent=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF&p=true&ga=1"
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
                  href="https://ifrcorg.sharepoint.com/sites/IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF%2FHum%20Pop%20Definitions%20for%20DREF%20Form%5F21072022%2Epdf&parent=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF&p=true&ga=1"
                >
                  <IoHelpCircle />
                </a>
              </>
            }
            name="num_affected"
            value={value.num_affected}
            onChange={onValueChange}
            error={error?.num_affected}
            hint={isImminentOnset && strings.drefFormPeopleAffectedDescription}
          />
          <NumberInput
            label={(
              <>
                {
                  isImminentOnset
                    ? strings.drefFormEstimatedPeopleInNeed
                    : strings.drefFormPeopleInNeed
                }
                <a
                  className={styles.peopleTargetedHelpLink}
                  target="_blank"
                  title="Click to view Emergency Response Framework"
                  href="https://ifrcorg.sharepoint.com/sites/IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF%2FHum%20Pop%20Definitions%20for%20DREF%20Form%5F21072022%2Epdf&parent=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF&p=true&ga=1"
                >
                  <IoHelpCircle />
                </a>
              </>
            )}
            name="people_in_need"
            value={value.people_in_need}
            onChange={onValueChange}
            error={error?.people_in_need}
            hint={isImminentOnset && strings.drefFormPeopleInNeedDescription}
          />
          <NumberInput
            label={(
              <>
                {strings.drefFormPeopleTargeted}
                <a
                  className={styles.peopleTargetedHelpLink}
                  target="_blank"
                  title="Click to view Emergency Response Framework"
                  href="https://ifrcorg.sharepoint.com/sites/IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF%2FHum%20Pop%20Definitions%20for%20DREF%20Form%5F21072022%2Epdf&parent=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF&p=true&ga=1"
                >
                  <IoHelpCircle />
                </a>
              </>
            )}
            name="num_assisted"
            value={value.num_assisted}
            onChange={onValueChange}
            error={error?.num_assisted}
            hint={strings.drefFormPeopleTargetedDescription}
          />
          <div />
        </InputSection>
        <InputSection
          title={strings.drefFormRequestAmount}
        >
          <NumberInput
            name="amount_requested"
            value={value.amount_requested}
            onChange={onValueChange}
            error={error?.amount_requested}
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
          contentSectionClassName={styles.imageInputContent}
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
          contentSectionClassName={styles.imageInputContent}
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
      </Container>
    </>
  );
}

export default DrefOverview;

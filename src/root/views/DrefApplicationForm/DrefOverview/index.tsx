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
import DateInput from '#components/DateInput';
import NumberInput from '#components/NumberInput';
import DREFFileInput from '#components/DREFFileInput';
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
  ONSET_SUDDEN,
  FileWithCaption,
} from '../common';

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
  const isSuddenOnSet = value?.type_of_onset === ONSET_SUDDEN ? false : value.emergency_appeal_planned;
  const didNationalSociety = value?.did_national_society;
  onValueChange(isSuddenOnSet, 'emergency_appeal_planned');

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

  const handleImageInputChange = React.useCallback((newValue: number | undefined, name: 'cover_image_file' | 'event_map_file') => {
    const newImageList: undefined | PartialForm<FileWithCaption> = ({
      client_id: String(newValue),
      id: newValue,
    });

    onValueChange(newImageList, name);
  }, [
    onValueChange,
  ]);

  return (
    <>
      <Container
        className={styles.sharing}
        heading={strings.drefFormSharingHeading}
        visibleOverflow
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
        <CopyFieldReportSection
          value={value}
          onValueSet={onValueSet}
        />
        <InputSection
          title={
            isImminentOnset ?
              strings.drefFormImminentDisasterDetails
              : strings.drefFormDisasterDetails
          }
          multiRow
          twoColumn
        >
          <SelectInput
            error={error?.disaster_type}
            label={
              isImminentOnset ?
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
          title={
            !isImminentOnset ?
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
            placeholder={strings.drefFormTitleDescription}
            prefix={value.title}
          />
        </InputSection>
        <InputSection
          title={
            !isImminentOnset ?
              strings.drefFormPeopleAffected
              : strings.drefFormRiskPeopleLabel
          }
          description={strings.drefFormPeopleAffectedDescription}
        >
          <NumberInput
            name="num_affected"
            value={value.num_affected}
            onChange={onValueChange}
            error={error?.num_affected}
          />
        </InputSection>
        <InputSection
          title={(
            <>
              {strings.drefFormPeopleTargeted}
              <a
                className={styles.peopleTargetedHelpLink}
                target="_blank"
                title="Click to view Emergency Response Framework"
                href="https://www.ifrc.org/sites/default/files/2021-07/IFRC%20Emergency%20Response%20Framework%20-%202017.pdf"
              >
                <IoHelpCircle />
              </a>
            </>
          )}
          description={strings.drefFormPeopleTargetedDescription}

        >
          <NumberInput
            name="num_assisted"
            value={value.num_assisted}
            onChange={onValueChange}
            error={error?.num_assisted}
          />
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
        >
          <DREFFileInput
            accept="image/*"
            name="event_map_file"
            value={value.event_map_file?.id}
            onChange={handleImageInputChange}
            error={error?.event_map_file}
            fileIdToUrlMap={fileIdToUrlMap}
            setFileIdToUrlMap={setFileIdToUrlMap}
            showStatus
          >
            {strings.drefFormUploadAnImageLabel}
          </DREFFileInput>
        </InputSection>
        <InputSection
          title={strings.drefFormUploadCoverImage}
          description={strings.drefFormUploadCoverImageDescription}
        >
          <DREFFileInput
            accept="image/*"
            name="cover_image_file"
            value={value.cover_image_file?.id}
            onChange={handleImageInputChange}
            error={error?.cover_image_file}
            fileIdToUrlMap={fileIdToUrlMap}
            setFileIdToUrlMap={setFileIdToUrlMap}
            showStatus
          >
            {strings.drefFormUploadAnImageLabel}
          </DREFFileInput>
        </InputSection>
        <InputSection
          title={(
            <>
              {
                isImminentOnset ?
                  strings.drefFormEstimatedPeopleInNeed
                  : strings.drefFormPeopleInNeed
              }
              <a
                className={styles.peopleTargetedHelpLink}
                target="_blank"
                title="Click to view Emergency Response Framework"
                href="https://www.ifrc.org/sites/default/files/2021-07/IFRC%20Emergency%20Response%20Framework%20-%202017.pdf"
              >
                <IoHelpCircle />
              </a>
            </>
          )}
          description={
            !isImminentOnset && strings.drefFormPeopleInNeedDescription}
        >
          <NumberInput
            name="people_in_need"
            value={value.people_in_need}
            onChange={onValueChange}
            error={error?.people_in_need}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.drefFormOperationalTimeframes}
        className={styles.operationalTimeframes}
      >
        {isImminentOnset &&
          <InputSection
            title={strings.drefFormDidNationalSocietyStarted}
          >
            <RadioInput
              name={'did_national_society' as const}
              options={yesNoOptions}
              keySelector={booleanOptionKeySelector}
              labelSelector={optionLabelSelector}
              onChange={onValueChange}
              value={value?.did_national_society}
              error={error?.did_national_society}
            />
          </InputSection>
        }
        {didNationalSociety &&
          <InputSection
            title={strings.drefFormNsRequestDate}
          >
            <DateInput
              name="ns_request_date"
              value={value.ns_request_date}
              onChange={onValueChange}
              error={error?.ns_request_date}
            />
          </InputSection>
        }
        <InputSection
          fullWidthColumn
        >
          <DateInput
            label={strings.drefFormDateSubmissionToGeneva}
            name="submission_to_geneva"
            value={value.submission_to_geneva}
            onChange={onValueChange}
            error={error?.submission_to_geneva}
          />
          <DateInput
            label={strings.drefFormDateOfApproval}
            name="date_of_approval"
            value={value.date_of_approval}
            onChange={onValueChange}
            error={error?.date_of_approval}
          />
        </InputSection>
        <InputSection
          fullWidthColumn
        >
          <DateInput
            label={strings.drefFormPublishingDate}
            name="publishing_date"
            value={value.publishing_date}
            onChange={onValueChange}
            error={error?.publishing_date}
          />
          <NumberInput
            label={strings.drefFormOperationTimeframeSubmission}
            name="operation_timeframe"
            placeholder={strings.drefFormOperationTimeframeSubmissionDescription}
            value={value.operation_timeframe}
            onChange={onValueChange}
            error={error?.operation_timeframe}
          />
          <DateInput
            label={strings.drefFormSubmissionEndDate}
            name="end_date"
            value={value.end_date}
            onChange={onValueChange}
            error={error?.end_date}
            readOnly
          />
        </InputSection>
      </Container>
    </>
  );
}

export default DrefOverview;

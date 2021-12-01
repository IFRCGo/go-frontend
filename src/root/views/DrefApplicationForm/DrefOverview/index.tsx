import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
  useFormArray,
  StateArg,
} from '@togglecorp/toggle-form';
import {
  randomString,
  listToMap,
  isNotDefined,
} from '@togglecorp/fujs';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import Button from '#components/Button';
import TextArea from '#components/TextArea';
import TextInput from '#components/TextInput';
import SelectInput from '#components/SelectInput';
import SearchSelectInput from '#components/SearchSelectInput';
import LanguageContext from '#root/languageContext';
import RadioInput from '#components/RadioInput';
import DateInput from '#components/DateInput';
import NumberInput from '#components/NumberInput';
import GoFileInput from '#components/GoFileInput';
import { rankedSearchOnList } from '#utils/common';

import {
  optionLabelSelector,
  DrefFields,
  NumericValueOption,
  BooleanValueOption,
  booleanOptionKeySelector,
  CountryDistrict,
  ONSET_IMMINENT,
  emptyNumericOptionList,
} from '../common';
import { CountryDistrictType } from '../useDrefFormOptions';
import CountryDistrictInput from './CountryDistrictInput';
import CopyFieldReportSection from './CopyFieldReportSection';
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
  onValueSet: (value: StateArg<Value>) => void;
  userOptions: NumericValueOption[];
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
    setFileIdToUrlMap,
    fileIdToUrlMap,
    onValueSet,
    userOptions,
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

  const userMap = React.useMemo(() => listToMap(userOptions, d => d.value, d => d.label), [userOptions]);
  const initialOptions = React.useMemo(() => (
    value.users?.map((u) => ({
      label: userMap[u],
      value: u,
    }))
  ), [userMap, value.users]);

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
            name="users"
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
                disabled
              >
                {strings.drefFormInstantShareLabel}
              </Button>
            </div>
          )}
        </InputSection>
      </Container>
      <CopyFieldReportSection
        value={value}
        onValueSet={onValueSet}
      />
      <Container
        heading={strings.drefFormEssentialInformation}
        className={styles.essentialInformation}
      >
        <InputSection title={strings.drefFormTitle}>
          <TextInput
            name="title"
            value={value.title}
            onChange={onValueChange}
            error={error?.fields?.title}
            placeholder={strings.drefFormTitleDescription}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormNationalSociety}
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
          title={strings.drefFormDisasterDetails}
          multiRow
          twoColumn
        >
          <SelectInput
            error={error?.fields?.disaster_type}
            label={strings.drefFormDisasterTypeLabel}
            name="disaster_type"
            onChange={onValueChange}
            options={disasterTypeOptions}
            pending={fetchingDisasterTypes}
            value={value.disaster_type}
          />
          <SelectInput
            error={error?.fields?.type_of_onset}
            label={strings.drefFormTypeOfOnsetLabel}
            name="type_of_onset"
            onChange={onValueChange}
            options={onsetOptions}
            value={value.type_of_onset}
          />
          <SelectInput
            error={error?.fields?.disaster_category}
            label={strings.drefFormDisasterCategoryLabel}
            name="disaster_category"
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
              {strings.drefFormAddCountryLabel}
            </Button>
          </div>
        </InputSection>
        <InputSection
          title={!isImminentOnset ? strings.drefFormPeopleAffected : strings.drefFormRiskPeopleLabel}

        >
          <NumberInput
            name="num_affected"
            value={value.num_affected}
            onChange={onValueChange}
            error={error?.fields?.num_affected}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormPeopleTargeted}
        >
          <NumberInput
            name="num_assisted"
            value={value.num_assisted}
            onChange={onValueChange}
            error={error?.fields?.num_assisted}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormRequestAmount}
        >
          <NumberInput
            name="amount_requested"
            value={value.amount_requested}
            onChange={onValueChange}
            error={error?.fields?.amount_requested}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormEmergencyAppealPlanned}
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
          title={strings.drefFormUploadMap}
        >
          <GoFileInput
            accept="image/*"
            error={error?.fields?.event_map}
            fileIdToUrlMap={fileIdToUrlMap}
            name="event_map"
            onChange={onValueChange}
            setFileIdToUrlMap={setFileIdToUrlMap}
            showStatus
            value={value.event_map}
          >
            {strings.drefFormUploadImageLabel}
          </GoFileInput>
        </InputSection>
      </Container>
      <Container
        heading={strings.drefFormTimeFrames}
        className={styles.timeframes}
      >
        <InputSection
          title={!isImminentOnset ? strings.drefFormEventDate : strings.drefFormDateOfImpact}
        >
          {!isImminentOnset &&
            <DateInput
              name="event_date"
              value={value.event_date}
              onChange={onValueChange}
              error={error?.fields?.event_date}
            />
          }
          {isImminentOnset && (
            <TextArea
              name="event_text"
              value={value.event_text}
              onChange={onValueChange}
              error={error?.fields?.event_text}
            />
          )}
        </InputSection>
        <InputSection
          title={strings.drefFormGoFieldReportDate}
        >
          <DateInput
            name="go_field_report_date"
            value={value.go_field_report_date}
            onChange={onValueChange}
            error={error?.fields?.go_field_report_date}
          />
        </InputSection>
        <InputSection
          title={!isImminentOnset ? strings.drefFormNsResponseStarted : strings.drefFormNSAnticipatoryAction}
        >
          <DateInput
            name="ns_respond_date"
            value={value.ns_respond_date}
            onChange={onValueChange}
            error={error?.fields?.ns_respond_date}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormNsRequestDate}
        >
          <DateInput
            name="ns_request_date"
            value={value.ns_request_date}
            onChange={onValueChange}
            error={error?.fields?.ns_request_date}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormDateSubmissionToGeneva}
          description={strings.drefFormDateSubmissionToGenevaDescription}
        >
          <DateInput
            name="submission_to_geneva"
            value={value.submission_to_geneva}
            onChange={onValueChange}
            error={error?.fields?.submission_to_geneva}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormDateOfApproval}
          description={strings.drefFormDateOfApprovalDescription}
        >
          <DateInput
            name="date_of_approval"
            value={value.date_of_approval}
            onChange={onValueChange}
            error={error?.fields?.date_of_approval}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormPublishingDate}
          description={strings.drefFormPublishingDateDescription}
        >
          <DateInput
            name="publishing_date"
            value={value.publishing_date}
            onChange={onValueChange}
            error={error?.fields?.publishing_date}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormOperationTimeframeSubmission}
        >
          <NumberInput
            name="operation_timeframe"
            placeholder={strings.drefFormOperationTimeframeSubmissionDescription}
            value={value.operation_timeframe}
            onChange={onValueChange}
            error={error?.fields?.operation_timeframe}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormSubmissionEndDate}
          description={strings.drefFormEndDateSubmissionDescription}
        >
          <DateInput
            name="end_date"
            value={value.end_date}
            onChange={onValueChange}
            error={error?.fields?.end_date}
            readOnly
          />
        </InputSection>
      </Container>
    </>
  );
}

export default DrefOverview;

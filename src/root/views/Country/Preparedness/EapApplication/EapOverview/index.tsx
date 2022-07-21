import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
  getErrorObject,
  useFormObject,
} from '@togglecorp/toggle-form';

import languageContext from '#root/languageContext';
import {
  IoAdd,
  IoCloudUpload,
} from 'react-icons/io5';

import {
  EapsFields,
  NumericValueOption,
} from '../common';
import DateInput from '#components/DateInput';
import NumberInput from '#components/NumberInput';
import TextArea from '#components/TextArea';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import DREFFileInput from '#components/DREFFileInput';
import TextInput from '#components/TextInput';
import Button from '#components/Button';
import { CountryDistrictType } from '../useEapFormOptions';

import styles from './styles.module.scss';
import SelectInput from '#components/SelectInput';

type Value = PartialForm<EapsFields>;
type SetValueArg<T> = T | ((value: T) => T);

const defaultCountryDistrictValue: PartialForm<CountryDistrictType> = {
  clientId: 'test',
};

interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  onChange: (value: SetValueArg<PartialForm<CountryDistrictType>>, index: number) => void;
  disasterTypeOptions: NumericValueOption[];
  value: Value;
  disasterCategoryOptions: NumericValueOption[];
  countryOptions: NumericValueOption[];
  fetchingCountries?: boolean;
  fileIdToUrlMap: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  index: number;
  districtOptions: NumericValueOption[];
  fetchingDistricts?: boolean;
  statusOptions: NumericValueOption[];
}

function EapOverview(props: Props) {
  const { strings } = React.useContext(languageContext);

  const {
    error: formError,
    onValueChange,
    onChange,
    value,
    disasterTypeOptions,
    countryOptions,
    fetchingCountries,
    fetchingDistricts,
    setFileIdToUrlMap,
    fileIdToUrlMap,
    index,
    statusOptions,
    districtOptions,
  } = props;

  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError]
  );

  const onFieldChange = useFormObject(index, onChange, defaultCountryDistrictValue);

  return (
    <>
      <Container
        className={styles.eapOverview}
        heading={strings.eapsFormEapOverviewHeading}
      >
        <div className={styles.eapOverviewContainer}>
          <div className={styles.eapCountry}>
            <InputSection
              title={strings.eapsFormEapCountry}
            >
              <SelectInput
                pending={fetchingCountries}
                error={error?.country}
                name={"country" as const}
                onChange={onFieldChange}
                options={countryOptions}
                value={value.country}
              />
            </InputSection>
            <InputSection
              title={strings.eapsFormRegion}
            >
              <SelectInput
                pending={fetchingDistricts}
                error={error?.district}
                name={"district" as const}
                onChange={onFieldChange}
                options={districtOptions}
                value={value.district}
              />
            </InputSection>
          </div>
          <div className={styles.eapDisaster}>
            <InputSection
              title={strings.eapsFormDisasterType}

            >
              <SelectInput
                name={"disaster_type" as const}
                onChange={onValueChange}
                error={error?.disaster_type}
                options={disasterTypeOptions}
                value={value.disaster_type}
              />
            </InputSection>
          </div>
        </div>
      </Container>
      <Container
        className={styles.eapOverview}
        heading={strings.eapsFormEapDetails}
      >
        <div className={styles.eapOverviewContainer}>
          <div className={styles.eapCountry}>
            <InputSection
              title={strings.eapsFormEapNumber}
            >
              <TextInput
                name={"eap_number" as const}
                value={value.eap_number}
                onChange={onValueChange}
                error={error?.eap_number}
              >
              </TextInput>
            </InputSection>
            <InputSection
              title={strings.eapsFormEapStatus}
            >
              <SelectInput
                name="eap_status"
                value={value?.status}
                options={statusOptions}
                onChange={onValueChange}
                error={error?.status}
              />
            </InputSection>
          </div>
          <div className={styles.eapCountry}>
            <InputSection
              title={strings.eapsFormEapDateofEapApproval}
            >
              <DateInput
                name="approval_date"
                value={value?.approval_date}
                onChange={onValueChange}
                error={error?.approval_date}
              >
              </DateInput>
            </InputSection>
            <InputSection
              title={strings.eapsFormEapOperationalTimeframe}
            >
              <NumberInput
                name={"operational_timeframe" as const}
                value={value?.operational_timeframe}
                onChange={onValueChange}
                error={error?.operational_timeframe}
              >
              </NumberInput>
            </InputSection>
          </div>
          <div className={styles.eapDisaster}>
            <InputSection
              title={strings.eapsFormEapLeadTime}
            >
              <NumberInput
                name={"lead_time" as const}
                value={value?.lead_time}
                onChange={onValueChange}
                error={error?.lead_time}
              >
              </NumberInput>
            </InputSection>
          </div>
          <div className={styles.eapDisaster}>
            <InputSection
              title={strings.eapsFormEapTimeframe}
            >
              <NumberInput
                name={"eap_timeframe" as const}
                value={value?.eap_timeframe}
                onChange={onValueChange}
                error={error?.eap_timeframe}
              >
              </NumberInput>
            </InputSection>
          </div>
        </div>
      </Container>
      <Container
        className={styles.eapOverview}
        heading={strings.eapsFormEapDescriptionTitle}
      >
        <div className={styles.eapOverviewContainer}>
          <div className={styles.eapDisaster}>
            <InputSection
              title={strings.eapsFormNumberOfPeopleTarged}
            >
              <NumberInput
                name="num_of_people"
                placeholder={strings.eapsFormEapsDescriptionPlaceholder}
                value={value?.num_of_people}
                onChange={onValueChange}
                error={error?.num_of_people}
              />
            </InputSection>
          </div>
          <InputSection
            title={strings.eapsFormTotalBudget}
          >
            <div className={styles.urbanToRural}>
              <div className={styles.inputs}>
                <NumberInput
                  label={strings.eapsFormTotalBudget}
                  placeholder={strings.eapsFormEapsDescriptionPlaceholder}
                  name="total_budget"
                  value={value?.total_budget}
                  onChange={onValueChange}
                  error={error?.total_budget}
                />
                <NumberInput
                  label={strings.eapsFormReadinessBudget}
                  placeholder="enter Number"
                  name="readiness_budget"
                  value={value?.readiness_budget}
                  onChange={onValueChange}
                  error={value?.readiness_budget}
                />
                <NumberInput
                  label={strings.eapsFormPrepositioningBudget}
                  placeholder={strings.drefFormEstimatedLocal}
                  name="pre_positioning_budget"
                  value={value?.pre_positioning_budget}
                  onChange={onValueChange}
                  error={value?.pre_positioning_budget}
                />
                <NumberInput
                  label={strings.eapsFormEarlyActionBudget}
                  placeholder={strings.drefFormEstimatedLocal}
                  name="early_action_budget"
                  value={value?.early_action_budget}
                  onChange={onValueChange}
                  error={value?.early_action_budget}
                />
              </div>
            </div>
          </InputSection>
          <InputSection
            title={strings.eapsFormTriggerStatement}
          >
            <TextArea
              name="trigger_statement"
              onChange={onValueChange}
              value={value?.trigger_statement}
              placeholder="Description"
              error={error?.trigger_statement}
            />
          </InputSection>
          <InputSection
            title={strings.eapsFormEapOverview}
          >
            <TextArea
              name="overview"
              value={value?.overview}
              onChange={onValueChange}
              error={error?.overview}
              placeholder={strings.eapsFormEapPverviewplaceholder}
            />
          </InputSection>
        </div>
      </Container>
      <Container
        className={styles.eapOverview}
        heading={strings.eapsFormPartnersAndRefernces}
      >
        <div className={styles.keyPartners}>
          <InputSection
            title={strings.eapsFormKeyPartners}
            description={strings.eapsFormKeyPartnersDescription}
          >
            <TextInput
              name="partners"
              value={value?.partners}
              onChange={onValueChange}
              error={error?.partners}
              placeholder={strings.eapsFormKeyPartnersPlaceholder}
            />
          </InputSection>
          <InputSection
            title={strings.eapsFormUrlTitle}
          >
            <div className={styles.actions}>
              <TextInput
                name="url"
                value={undefined}
                onChange={onValueChange}
                error={undefined}
                placeholder="Enter URL"
              />
              <div className={styles.addKeyButton}>
                <Button
                  name={undefined}
                  onClick={undefined}
                  variant="secondary"
                >
                  <IoAdd />
                  {strings.eapsFormAddKeyPartnersLabel}
                </Button>
              </div>
            </div>
          </InputSection>
        </div>
        <div className={styles.keyPartners}>
          <InputSection
            title={strings.eapsFormReferences}
            description={strings.eapsFormReferencesDescription}
          >
            <TextInput
              name="references"
              value={value?.references}
              onChange={onValueChange}
              error={error?.references}
              placeholder={strings.eapsFormReferncesPlaceholder}
            />
          </InputSection>
          <InputSection
            title={strings.eapsFormUrlTitle}
          >
            <div className={styles.actions}>
              <TextInput
                name="key_partners_url"
                value={undefined}
                onChange={undefined}
                error={undefined}
                placeholder="Enter URL"
              />
              <div className={styles.addKeyButton}>
                <Button
                  name={undefined}
                  onClick={undefined}
                  variant="secondary"
                >
                  <IoAdd />
                  {strings.eapsFormAddReferncesLabel}
                </Button>
              </div>
            </div>
          </InputSection>
        </div>
      </Container>
      <Container
        className={styles.eapOverview}
        heading={strings.eapsFormEapDocuments}
      >
        <InputSection
          title={strings.eapsFormUploadEapsDocuments}
          description={strings.eapsFormUploadEapsDocumentsDescription}>
          <DREFFileInput
            name="document"
            accept=".pdf"
            error={error?.document}
            fileIdToUrlMap={fileIdToUrlMap}
            onChange={onValueChange}
            setFileIdToUrlMap={setFileIdToUrlMap}
            showStatus
            value={value?.document}
          >
            <IoCloudUpload />
            <div className={styles.uploadDocument}>
              {strings.eapsFormUploadEapsButtonLabel}
            </div>
          </DREFFileInput>
        </InputSection>
      </Container>
    </>
  );
}

export default EapOverview;
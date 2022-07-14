import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';

import languageContext from '#root/languageContext';
import {
  IoAdd,
  IoCloudUpload,
} from 'react-icons/io5';

import {
  EapsFields,
  BooleanValueOption,
} from '../common';
import SearchSelectInput from '#components/SearchSelectInput';
import DateInput from '#components/DateInput';
import NumberInput from '#components/NumberInput';
import TextArea from '#components/TextArea';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import DREFFileInput from '#components/DREFFileInput';
import TextInput from '#components/TextInput';
import Button from '#components/Button';

import styles from './styles.module.scss';

type Value = PartialForm<EapsFields>;

interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  yesNoOptions: BooleanValueOption[];
  isImminentOnset: boolean;
  fileIdToUrlMap?: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;

}

function EapOverview() {
  const { strings } = React.useContext(languageContext);

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
              <SearchSelectInput
                name="eap_country"
                value={undefined}
                onChange={undefined}
                error={undefined}
              >
              </SearchSelectInput>
            </InputSection>
            <InputSection
              title={strings.eapsFormRegion}
            >
              <SearchSelectInput
                name="region"
                value={undefined}
                onChange={undefined}
                error={undefined}
              >
              </SearchSelectInput>
            </InputSection>
          </div>
          <div className={styles.eapDisaster}>
            <InputSection
              title={strings.eapsFormDisasterType}

            >
              <SearchSelectInput
                name="disaster_type"
                value={undefined}
                onChange={undefined}
                error={undefined}
              >
              </SearchSelectInput>
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
              <SearchSelectInput
                name="eap_number"
                value={undefined}
                onChange={undefined}
                error={undefined}
              >
              </SearchSelectInput>
            </InputSection>
            <InputSection
              title={strings.eapsFormEapStatus}
            >
              <SearchSelectInput
                name="eap_status"
                value={undefined}
                onChange={undefined}
                error={undefined}
              >
              </SearchSelectInput>
            </InputSection>
          </div>
          <div className={styles.eapCountry}>
            <InputSection
              title={strings.eapsFormEapDateofEapApproval}
            >
              <DateInput
                name="date_eap_approval"
                value={undefined}
                onChange={undefined}
                error={undefined}
              >
              </DateInput>
            </InputSection>
            <InputSection
              title={strings.eapsFormEapOperationalTimeframe}
            >
              <NumberInput
                name="operational_timeframe"
                value={undefined}
                onChange={undefined}
                error={undefined}
              >
              </NumberInput>
            </InputSection>
          </div>
          <div className={styles.eapDisaster}>
            <InputSection
              title={strings.eapsFormEapLeadTime}
            >
              <SearchSelectInput
                name="lead_time"
                value={undefined}
                onChange={undefined}
                error={undefined}
              >
              </SearchSelectInput>
            </InputSection>
          </div>
          <div className={styles.eapDisaster}>
            <InputSection
              title={strings.eapsFormEapTimeframe}
            >
              <SearchSelectInput
                name="eap_timeframe"
                value={undefined}
                onChange={undefined}
                error={undefined}
              >
              </SearchSelectInput>
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
                placeholder={strings.eapsFormEapsDescriptionPlaceholder}
                name="people_targeted"
                value={undefined}
                onChange={undefined}
                error={undefined}
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
                  name="people_targeted"
                  value={undefined}
                  onChange={undefined}
                  error={undefined}
                />
                <NumberInput
                  label={strings.eapsFormReadinessBudget}
                  placeholder="enter Number"
                  name="people_per_urban"
                  value={undefined}
                  onChange={undefined}
                  error={undefined}
                />
                <NumberInput
                  label={strings.eapsFormPrepositioningBudget}
                  placeholder={strings.drefFormEstimatedLocal}
                  name="people_per_local"
                  value={undefined}
                  onChange={undefined}
                  error={undefined}
                />
                <NumberInput
                  label={strings.eapsFormEarlyActionBudget}
                  placeholder={strings.drefFormEstimatedLocal}
                  name="people_per_local"
                  value={undefined}
                  onChange={undefined}
                  error={undefined}
                />
              </div>
            </div>
          </InputSection>
          <InputSection
            title={strings.eapsFormTriggerStatement}
          >
            <TextArea
              error={undefined}
              name="trigger_statement"
              onChange={undefined}
              value={undefined}
              placeholder="Description"
            />
          </InputSection>
          <InputSection
            title={strings.eapsFormEapOverview}
          >
            <TextArea
              name="eap_overview"
              onChange={undefined}
              value={undefined}
              error={undefined}
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
              name="key_partners"
              value={undefined}
              onChange={undefined}
              error={undefined}
              placeholder={strings.eapsFormKeyPartnersPlaceholder}
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
              name="key_partners"
              value={undefined}
              onChange={undefined}
              error={undefined}
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
            accept=".pdf"
            error={undefined}
            fileIdToUrlMap={undefined}
            name="eaps_file"
            onChange={undefined}
            setFileIdToUrlMap={undefined}
            showStatus
            value={undefined}
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
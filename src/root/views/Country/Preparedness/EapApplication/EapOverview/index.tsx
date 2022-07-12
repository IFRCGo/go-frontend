import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';
import Container from '#components/Container';
import InputSection from '#components/InputSection';

import languageContext from '#root/languageContext';

import {
  EapsFields,
  BooleanValueOption,
} from '../common';
import styles from './styles.module.scss';
import SearchSelectInput from '#components/SearchSelectInput';
import DateInput from '#components/DateInput';
import NumberInput from '#components/NumberInput';
import InputLabel from '#components/InputLabel';
import TextArea from '#components/TextArea';
import DREFFileInput from '#components/DREFFileInput';
import TextInput from '#components/TextInput';
import Button from '#components/Button';

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
      </Container>
      <Container
        className={styles.eapOverview}
        heading={strings.eapsFormEapDetails}
      >
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
          <SearchSelectInput
            name="operational_timeframe"
            value={undefined}
            onChange={undefined}
            error={undefined}
          >
          </SearchSelectInput>
        </InputSection>
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
      </Container>
      <Container
        className={styles.eapOverview}
        heading={strings.eapsFormEapDescriptionTitle}
      >
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
        <InputSection
          title={strings.eapsFormTotalBudget}
          multiRow
          twoColumn
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
              label={strings.eapsFormKeyPartnersLabel}
              value={undefined}
              onChange={undefined}
              error={undefined}
              placeholder={strings.eapsFormKeyPartnersPlaceholder}
            />
          </InputSection>
          <InputSection>
            <div className={styles.actions}>
              <TextInput
                name="key_partners_url"
                label={strings.eapsFormkeyPartnersUrl}
                value={undefined}
                onChange={undefined}
                error={undefined}
                placeholder="Enter URL"
              />
              <Button
                name={undefined}
                onClick={undefined}
                variant="secondary"
              >
                {strings.eapsFormAddKeyPartnersLabel}
              </Button>
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
              label={strings.eapsFormReferencesLabel}
              value={undefined}
              onChange={undefined}
              error={undefined}
              placeholder={strings.eapsFormReferncesPlaceholder}
            />
          </InputSection>
          <InputSection>
            <div className={styles.actions}>
              <TextInput
                name="key_partners_url"
                label={strings.eapsFormkeyPartnersUrl}
                value={undefined}
                onChange={undefined}
                error={undefined}
                placeholder="Enter URL"
              />
              <Button
                name={undefined}
                onClick={undefined}
                variant="secondary"
              >
                {strings.eapsFormAddReferncesLabel}
              </Button>
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
            {strings.eapsFormUploadEapsButtonLabel}
          </DREFFileInput>
        </InputSection>
      </Container>
    </>
  );
}

export default EapOverview;
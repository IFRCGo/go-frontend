import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import TextInput from '#components/TextInput';
import LanguageContext from '#root/languageContext';
import DateInput from '#components/DateInput';

import { DrefFields } from '../common';

import styles from './styles.module.scss';

type Value = PartialForm<DrefFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
}

function Submission(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    error,
    onValueChange,
    value,
  } = props;

  return (
    <>
      <Container
        heading={strings.submissionFlow}
        className={styles.submissionFlow}
      >
        <InputSection
          title={strings.nsRequestDate}
        >
          <DateInput
            name="ns_request_date"
            value={value.ns_request_date}
            onChange={onValueChange}
            error={error?.fields?.ns_request_date}
          />
        </InputSection>
        <InputSection
          title={strings.submissionStartDate}
          description={strings.submissionStartDateDescription}
        >
          <DateInput
            name="start_date"
            value={value.start_date}
            onChange={onValueChange}
            error={error?.fields?.start_date}
          />
        </InputSection>
        <InputSection
          title={strings.submissionEndDate}
          description={strings.endDateSubmissionDescription}
        >
          <DateInput
            name="end_date"
            value={value.end_date}
            onChange={onValueChange}
            error={error?.fields?.end_date}
          />
        </InputSection>
        <InputSection
          title={strings.dateSubmissionToGeneva}
          description={strings.dateSubmissionToGenevaDescription}
        >
          <DateInput
            name="submission_to_geneva"
            value={value.submission_to_geneva}
            onChange={onValueChange}
            error={error?.fields?.submission_to_geneva}
          />
        </InputSection>
        <InputSection
          title={strings.dateOfPublishing}
          description={strings.dateOfPublishingDescription}
        >
          <DateInput
            name="date_of_approval"
            value={value.date_of_approval}
            onChange={onValueChange}
            error={error?.fields?.date_of_approval}
          />
        </InputSection>
        <InputSection
          title={strings.operationTimeframeSubmission}
        >
          <TextInput
            name="operation_timeframe"
            placeholder={strings.operationTimeframeSubmissionDescription}
            value={value.operation_timeframe}
            onChange={onValueChange}
            error={error?.fields?.operation_timeframe}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.trackingData}
        className={styles.trackingData}
      >
        <InputSection
          title={strings.appealCode}
          description={strings.appealCodeDescription}
        >
          <TextInput
            name="appeal_code"
            value={value.appeal_code}
            onChange={onValueChange}
            error={error?.fields?.appeal_code}
          />
        </InputSection>
        <InputSection
          title={strings.glideNum}
          description={strings.glideNumDescription}
        >
          <TextInput
            placeholder="MDR code"
            name="glide_code"
            value={value.glide_code}
            onChange={onValueChange}
            error={error?.fields?.glide_code}
          />
        </InputSection>
        <InputSection
          title={strings.appealManager}
          description={strings.appealManagerDescription}
        >
          <TextInput
            label="Name"
            name="ifrc_appeal_manager_name"
            value={value.ifrc_appeal_manager_name}
            onChange={onValueChange}
            error={error?.fields?.ifrc_appeal_manager_name}
          />
          <TextInput
            label="Email"
            name="ifrc_appeal_manager_email"
            value={value.ifrc_appeal_manager_email}
            onChange={onValueChange}
            error={error?.fields?.ifrc_appeal_manager_email}
          />
        </InputSection>
        <InputSection
          title={strings.projectManager}
          description={strings.projectManagerDescription}
        >
          <TextInput
            label="Name"
            name="ifrc_project_manager_name"
            value={value.ifrc_project_manager_name}
            onChange={onValueChange}
            error={error?.fields?.ifrc_project_manager_name}
          />
          <TextInput
            label="Email"
            name="ifrc_project_manager_email"
            value={value.ifrc_project_manager_email}
            onChange={onValueChange}
            error={error?.fields?.ifrc_project_manager_email}
          />
        </InputSection>
        <InputSection
          title={strings.nationalSocietyContact}
        >
          <TextInput
            label="Name"
            name="national_society_contact_name"
            value={value.national_society_contact_name}
            onChange={onValueChange}
            error={error?.fields?.national_society_contact_name}
          />
          <TextInput
            label="Email"
            name="national_society_contact_email"
            value={value.national_society_contact_email}
            onChange={onValueChange}
            error={error?.fields?.national_society_contact_email}
          />
        </InputSection>
        <InputSection
          title={strings.ifrcEmergency}
        >
          <div>
            <TextInput
              label="Name"
              name="ifrc_emergency_name"
              value={value.ifrc_emergency_name}
              onChange={onValueChange}
              error={error?.fields?.ifrc_emergency_name}
            />
          </div>
          <div>
            <TextInput
              label="Email"
              name="ifrc_emergency_email"
              value={value.ifrc_emergency_email}
              onChange={onValueChange}
              error={error?.fields?.ifrc_emergency_email}
            />
          </div>
        </InputSection>
        <InputSection
          title={strings.mediaContact}
        >
          <TextInput
            label="Name"
            name="media_contact_name"
            value={value.media_contact_name}
            onChange={onValueChange}
            error={error?.fields?.media_contact_name}
          />
          <TextInput
            label="Email"
            name="media_contact_email"
            value={value.media_contact_email}
            onChange={onValueChange}
            error={error?.fields?.media_contact_email}
          />
        </InputSection>
      </Container>
    </>
  );
}

export default Submission;

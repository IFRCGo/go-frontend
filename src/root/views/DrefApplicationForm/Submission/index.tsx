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

import {
  DrefFields,
  BooleanValueOption,
} from '../common';

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
            name="start_date"
            value={value.start_date}
            onChange={onValueChange}
            error={error?.fields?.start_date}
          />
        </InputSection>
        <InputSection
          title="Start date"
          description=" Added by the regional office"
        >
          <DateInput
            name="start_date"
            value={value.start_date}
            onChange={onValueChange}
            error={error?.fields?.start_date}
          />
        </InputSection>
        <InputSection
          title={strings.dateSubmissionToGeneva}
          description={strings.dateSubmissionToGenevaDescription}
        >
          <DateInput
            name="start_date"
            value={value.start_date}
            onChange={onValueChange}
            error={error?.fields?.start_date}
          />
        </InputSection>
        <InputSection
          title={strings.endDateSubmission}
          description={strings.endDateSubmissionDescription}
        >
          <DateInput
            name="start_date"
            value={value.start_date}
            onChange={onValueChange}
            error={error?.fields?.start_date}
          />
        </InputSection>
        <InputSection
          title={strings.dateOfApproval}
          description={strings.dateOfApprovalDescription}
        >
          <DateInput
            name="start_date"
            value={value.start_date}
            onChange={onValueChange}
            error={error?.fields?.start_date}
          />
        </InputSection>
        <InputSection
          title={strings.operationTimeframeSubmission}
        >
          <TextInput
            name="operation_objective"
            value={value.operation_objective}
            onChange={onValueChange}
            error={error?.fields?.operation_objective}
          />
        </InputSection>
        <InputSection
          title={strings.dateOfPublishing}
          description={strings.dateOfPublishingDescription}
        >
          <DateInput
            name="publishing_date"
            value={value.publishing_date}
            onChange={onValueChange}
            error={error?.fields?.publishing_date}
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
            placeholder="MDR code"
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
            name="appeal_manager_name"
            value={value.appeal_manager_name}
            onChange={onValueChange}
            error={error?.fields?.appeal_manager_name}
          />
          <TextInput
            label="Email"
            name="appeal_manager_email"
            value={value.appeal_manager_email}
            onChange={onValueChange}
            error={error?.fields?.appeal_manager_email}
          />
        </InputSection>
        <InputSection
          title={strings.projectManager}
          description={strings.projectManagerDescription}
        >
          <TextInput
            label="name"
            name="project_manager_name"
            value={value.project_manager_name}
            onChange={onValueChange}
            error={error?.fields?.project_manager_name}
          />
          <TextInput
            label="email"
            name="project_manager_email"
            value={value.project_manager_email}
            onChange={onValueChange}
            error={error?.fields?.project_manager_email}
          />
        </InputSection>
        <InputSection
          title={strings.requestor}
          description={strings.requestorDescription}
        >
          <TextInput
            label="Name"
            name="requestor_name"
            value={value.requestor_name}
            onChange={onValueChange}
            error={error?.fields?.requestor_name}
          />
          <TextInput
            label="Email"
            name="requestor_email"
            value={value.requestor_email}
            onChange={onValueChange}
            error={error?.fields?.requestor_email}
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

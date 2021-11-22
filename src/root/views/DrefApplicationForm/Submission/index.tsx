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
        heading={strings.drefFormTrackingData}
        className={styles.trackingData}
      >
        <InputSection
          title={strings.drefFormAppealCode}
          description={strings.drefFormAppealCodeDescription}
        >
          <TextInput
            name="appeal_code"
            value={value.appeal_code}
            onChange={onValueChange}
            error={error?.fields?.appeal_code}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormGlideNum}
        >
          <TextInput
            name="glide_code"
            value={value.glide_code}
            onChange={onValueChange}
            error={error?.fields?.glide_code}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormAppealManager}
          description={strings.drefFormAppealManagerDescription}
          multiRow
          twoColumn
        >
          <TextInput
            label="Name"
            name="ifrc_appeal_manager_name"
            value={value.ifrc_appeal_manager_name}
            onChange={onValueChange}
            error={error?.fields?.ifrc_appeal_manager_name}
          />
          <TextInput
            label="Title"
            name="ifrc_appeal_manager_title"
            value={value.ifrc_appeal_manager_title}
            onChange={onValueChange}
            error={error?.fields?.ifrc_appeal_manager_title}
          />
          <TextInput
            label="Email"
            name="ifrc_appeal_manager_email"
            value={value.ifrc_appeal_manager_email}
            onChange={onValueChange}
            error={error?.fields?.ifrc_appeal_manager_email}
          />
          <TextInput
            label="Phone Number"
            name="ifrc_appeal_manager_phone_number"
            value={value.ifrc_appeal_manager_phone_number}
            onChange={onValueChange}
            error={error?.fields?.ifrc_appeal_manager_phone_number}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormProjectManager}
          description={strings.drefFormProjectManagerDescription}
          multiRow
          twoColumn
        >
          <TextInput
            label="Name"
            name="ifrc_project_manager_name"
            value={value.ifrc_project_manager_name}
            onChange={onValueChange}
            error={error?.fields?.ifrc_project_manager_name}
          />
          <TextInput
            label="Title"
            name="ifrc_project_manager_title"
            value={value.ifrc_project_manager_title}
            onChange={onValueChange}
            error={error?.fields?.ifrc_project_manager_title}
          />
          <TextInput
            label="Email"
            name="ifrc_project_manager_email"
            value={value.ifrc_project_manager_email}
            onChange={onValueChange}
            error={error?.fields?.ifrc_project_manager_email}
          />
          <TextInput
            label="Phone Number"
            name="ifrc_project_manager_phone_number"
            value={value.ifrc_project_manager_phone_number}
            onChange={onValueChange}
            error={error?.fields?.ifrc_project_manager_phone_number}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormNationalSocietyContact}
          multiRow
          twoColumn
        >
          <TextInput
            label="Name"
            name="national_society_contact_name"
            value={value.national_society_contact_name}
            onChange={onValueChange}
            error={error?.fields?.national_society_contact_name}
          />
          <TextInput
            label="Title"
            name="national_society_contact_title"
            value={value.national_society_contact_title}
            onChange={onValueChange}
            error={error?.fields?.national_society_contact_title}
          />
          <TextInput
            label="Email"
            name="national_society_contact_email"
            value={value.national_society_contact_email}
            onChange={onValueChange}
            error={error?.fields?.national_society_contact_email}
          />
          <TextInput
            label="Phone Number"
            name="national_society_contact_phone_number"
            value={value.national_society_contact_phone_number}
            onChange={onValueChange}
            error={error?.fields?.national_society_contact_phone_number}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormIfrcEmergency}
          multiRow
          twoColumn
        >
          <TextInput
            label="Name"
            name="ifrc_emergency_name"
            value={value.ifrc_emergency_name}
            onChange={onValueChange}
            error={error?.fields?.ifrc_emergency_name}
          />
          <TextInput
            label="Title"
            name="ifrc_emergency_title"
            value={value.ifrc_emergency_title}
            onChange={onValueChange}
            error={error?.fields?.ifrc_emergency_title}
          />
          <TextInput
            label="Email"
            name="ifrc_emergency_email"
            value={value.ifrc_emergency_email}
            onChange={onValueChange}
            error={error?.fields?.ifrc_emergency_email}
          />
          <TextInput
            label="Phone Number"
            name="ifrc_emergency_phone_number"
            value={value.ifrc_emergency_phone_number}
            onChange={onValueChange}
            error={error?.fields?.ifrc_emergency_phone_number}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormMediaContact}
          multiRow
          twoColumn
        >
          <TextInput
            label="Name"
            name="media_contact_name"
            value={value.media_contact_name}
            onChange={onValueChange}
            error={error?.fields?.media_contact_name}
          />
          <TextInput
            label="Title"
            name="media_contact_title"
            value={value.media_contact_title}
            onChange={onValueChange}
            error={error?.fields?.media_contact_title}
          />
          <TextInput
            label="Email"
            name="media_contact_email"
            value={value.media_contact_email}
            onChange={onValueChange}
            error={error?.fields?.media_contact_email}
          />
          <TextInput
            label="Phone Number"
            name="media_contact_phone_number"
            value={value.media_contact_phone_number}
            onChange={onValueChange}
            error={error?.fields?.media_contact_phone_number}
          />
        </InputSection>
      </Container>
    </>
  );
}

export default Submission;
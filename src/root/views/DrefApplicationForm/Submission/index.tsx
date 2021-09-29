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
            placeholder="MDR code"
            name="glide_code"
            value={value.glide_code}
            onChange={onValueChange}
            error={error?.fields?.glide_code}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormAppealManager}
          description={strings.drefFormAppealManagerDescription}
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
          title={strings.drefFormProjectManager}
          description={strings.drefFormProjectManagerDescription}
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
          title={strings.drefFormNationalSocietyContact}
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
          title={strings.drefFormIfrcEmergency}
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
          title={strings.drefFormMediaContact}
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

import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
  getErrorObject,
} from '@togglecorp/toggle-form';

import languageContext from '#root/languageContext';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import TextInput from '#components/TextInput';

import { DrefFinalReportFields } from '../common';

import styles from './styles.module.scss';
import DateInput from '#components/DateInput';
import NumberInput from '#components/NumberInput';

type Value = PartialForm<DrefFinalReportFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
}

function Submission(props: Props) {
  const { strings } = React.useContext(languageContext);

  const {
    error: formError,
    onValueChange,
    value,
  } = props;

  const error = getErrorObject(formError);
  return (
    <>
      <Container
        visibleOverflow
        heading={strings.finalReportTimeFrame}
        className={styles.timeframes}
      >
        <InputSection
          fullWidthColumn
        >
          <DateInput
            label={strings.finalReportStartOfOperation}
            name="operation_start_date"
            value={value.operation_start_date}
            onChange={onValueChange}
            error={error?.operation_start_date}
          />
          <NumberInput
            label={strings.finalReportTotalOperatingTimeFrame}
            name="total_operation_timeframe"
            value={value.total_operation_timeframe}
            onChange={onValueChange}
            error={error?.total_operation_timeframe}
          />
        </InputSection>
        <InputSection
          fullWidthColumn
        >
          <DateInput
            label={strings.finalReportEndOfOperation}
            name="operation_end_date"
            value={value.operation_end_date}
            onChange={onValueChange}
            error={error?.operation_end_date}
          />
          <DateInput
            label={strings.finalReportDateOfPublication}
            name="date_of_publication"
            value={value.date_of_publication}
            onChange={onValueChange}
            error={error?.date_of_publication}
          />
        </InputSection>
      </Container>

      <Container
        visibleOverflow
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
            error={error?.appeal_code}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormGlideNum}
        >
          <TextInput
            name="glide_code"
            value={value.glide_code}
            onChange={onValueChange}
            error={error?.glide_code}
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
            error={error?.ifrc_appeal_manager_name}
          />
          <TextInput
            label="Title"
            name="ifrc_appeal_manager_title"
            value={value.ifrc_appeal_manager_title}
            onChange={onValueChange}
            error={error?.ifrc_appeal_manager_title}
          />
          <TextInput
            label="Email"
            name="ifrc_appeal_manager_email"
            value={value.ifrc_appeal_manager_email}
            onChange={onValueChange}
            error={error?.ifrc_appeal_manager_email}
          />
          <TextInput
            label="Phone Number"
            name="ifrc_appeal_manager_phone_number"
            value={value.ifrc_appeal_manager_phone_number}
            onChange={onValueChange}
            error={error?.ifrc_appeal_manager_phone_number}
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
            error={error?.ifrc_project_manager_name}
          />
          <TextInput
            label="Title"
            name="ifrc_project_manager_title"
            value={value.ifrc_project_manager_title}
            onChange={onValueChange}
            error={error?.ifrc_project_manager_title}
          />
          <TextInput
            label="Email"
            name="ifrc_project_manager_email"
            value={value.ifrc_project_manager_email}
            onChange={onValueChange}
            error={error?.ifrc_project_manager_email}
          />
          <TextInput
            label="Phone Number"
            name="ifrc_project_manager_phone_number"
            value={value.ifrc_project_manager_phone_number}
            onChange={onValueChange}
            error={error?.ifrc_project_manager_phone_number}
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
            error={error?.national_society_contact_name}
          />
          <TextInput
            label="Title"
            name="national_society_contact_title"
            value={value.national_society_contact_title}
            onChange={onValueChange}
            error={error?.national_society_contact_title}
          />
          <TextInput
            label="Email"
            name="national_society_contact_email"
            value={value.national_society_contact_email}
            onChange={onValueChange}
            error={error?.national_society_contact_email}
          />
          <TextInput
            label="Phone Number"
            name="national_society_contact_phone_number"
            value={value.national_society_contact_phone_number}
            onChange={onValueChange}
            error={error?.national_society_contact_phone_number}
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
            error={error?.ifrc_emergency_name}
          />
          <TextInput
            label="Title"
            name="ifrc_emergency_title"
            value={value.ifrc_emergency_title}
            onChange={onValueChange}
            error={error?.ifrc_emergency_title}
          />
          <TextInput
            label="Email"
            name="ifrc_emergency_email"
            value={value.ifrc_emergency_email}
            onChange={onValueChange}
            error={error?.ifrc_emergency_email}
          />
          <TextInput
            label="Phone Number"
            name="ifrc_emergency_phone_number"
            value={value.ifrc_emergency_phone_number}
            onChange={onValueChange}
            error={error?.ifrc_emergency_phone_number}
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
            error={error?.media_contact_name}
          />
          <TextInput
            label="Title"
            name="media_contact_title"
            value={value.media_contact_title}
            onChange={onValueChange}
            error={error?.media_contact_title}
          />
          <TextInput
            label="Email"
            name="media_contact_email"
            value={value.media_contact_email}
            onChange={onValueChange}
            error={error?.media_contact_email}
          />
          <TextInput
            label="Phone Number"
            name="media_contact_phone_number"
            value={value.media_contact_phone_number}
            onChange={onValueChange}
            error={error?.media_contact_phone_number}
          />
        </InputSection>
      </Container>
    </>
  );
}

export default Submission;

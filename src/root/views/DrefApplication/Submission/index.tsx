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

import {
  Option,
  FormType,
  NumericValueOption,
  BooleanValueOption,
} from '../common';

import styles from './styles.module.scss';
import DateInput from '#components/DateInput';

type Value = PartialForm<FormType>;
interface Props {
  disasterTypeOptions: NumericValueOption[];
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  statusOptions: NumericValueOption[];
  value: Value;
  yesNoOptions: BooleanValueOption[];
  countryOptions: NumericValueOption[];
  districtOptions: NumericValueOption[];
  fetchingCountries?: boolean;
  fetchingDistricts?: boolean;
  fetchingDisasterTypes?: boolean;
  initialEventOptions?: Option[];
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
        heading="SUBMISSION FLOW"
        className={styles.submission}
      >
        <InputSection
          title="Date of NS request"
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
          title="Date of Submission to Geneva"
          description="Added by Geneva"
        >
          <DateInput
            name="start_date"
            value={value.start_date}
            onChange={onValueChange}
            error={error?.fields?.start_date}
          />
        </InputSection>
        <InputSection
          title="End date"
          description="Added by the regional office"
        >
          <DateInput
            name="start_date"
            value={value.start_date}
            onChange={onValueChange}
            error={error?.fields?.start_date}
          />
        </InputSection>
        <InputSection
          title="Date of approval"
          description=" Added by Geneva"
        >
          <DateInput
            name="start_date"
            value={value.start_date}
            onChange={onValueChange}
            error={error?.fields?.start_date}
          />
        </InputSection>
        <InputSection
          title="Operation timeframe"
        >
          <TextInput
            name="operation_objective"
            value={value.operation_objective}
            onChange={onValueChange}
            error={error?.fields?.operation_objective}
          />
        </InputSection>
        <InputSection
          title="Date of publishing"
          description=" Added by the regional office"
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
        heading="TRACKING DATA AND CONTACTS"
        className={styles.submission}
      >
        <InputSection
          title="Appeal Code"
          description="Add at approval"
        >
          <TextInput
            // label={strings.fieldReportFormTitleSecondaryLabel}
            placeholder="MDR code"
            name="appeal_code"
            value={value.appeal_code}
            onChange={onValueChange}
            error={error?.fields?.appeal_code}
          />
        </InputSection>
        <InputSection
          title="GLIDE number"
          description="Added by the regional office"
        >
          <TextInput
            // label={strings.fieldReportFormTitleSecondaryLabel}
            placeholder="MDR code"
            name="glide_code"
            value={value.glide_code}
            onChange={onValueChange}
            error={error?.fields?.glide_code}
          />
        </InputSection>
        <InputSection
          title="Appeal manager"
          description="Added by the regional office"
        >
          <div>
            <TextInput
              label="NAME"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="appeal_manager_name"
              value={value.appeal_manager_name}
              onChange={onValueChange}
              error={error?.fields?.appeal_manager_name}
            />
          </div>
          <div>
            <TextInput
              label="EMAIL"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="appeal_manager_email"
              value={value.appeal_manager_email}
              onChange={onValueChange}
              error={error?.fields?.appeal_manager_email}
            />
          </div>
        </InputSection>
        <InputSection
          title="Project manager"
          description="Added by the regional office"
        >
          <div>
            <TextInput
              label="NAME"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="project_manager_name"
              value={value.project_manager_name}
              onChange={onValueChange}
              error={error?.fields?.project_manager_name}
            />
          </div>
          <div>
            <TextInput
              label="EMAIL"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="project_manager_email"
              value={value.project_manager_email}
              onChange={onValueChange}
              error={error?.fields?.project_manager_email}
            />
          </div>
        </InputSection>
        <InputSection
          title="Requestor"
          description="Added by the regional office"
        >
          <div>
            <TextInput
              label="NAME"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="summary"
              value={value.summary}
              onChange={onValueChange}
              error={error?.fields?.summary}
            />
          </div>
          <div>
            <TextInput
              label="EMAIL"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="summary"
              value={value.summary}
              onChange={onValueChange}
              error={error?.fields?.summary}
            />
          </div>
        </InputSection>
        <InputSection
          title="National Society contact"
        >
          <div>
            <TextInput
              label="NAME"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="national_scoiety_contact_name"
              value={value.national_scoiety_contact_name}
              onChange={onValueChange}
              error={error?.fields?.national_scoiety_contact_name}
            />
          </div>
          <div>
            <TextInput
              label="EMAIL"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="national_scoiety_contact_email"
              value={value.national_scoiety_contact_email}
              onChange={onValueChange}
              error={error?.fields?.national_scoiety_contact_email}
            />
          </div>
        </InputSection>
        <InputSection
          title="IFRC focal point for the emergency"
        >
          <div>
            <TextInput
              label="NAME"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="ifrc_emergency_name"
              value={value.ifrc_emergency_name}
              onChange={onValueChange}
              error={error?.fields?.ifrc_emergency_name}
            />
          </div>
          <div>
            <TextInput
              label="EMAIL"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="ifrc_emergency_email"
              value={value.ifrc_emergency_email}
              onChange={onValueChange}
              error={error?.fields?.ifrc_emergency_email}
            />
          </div>
        </InputSection>
        <InputSection
          title="Media contact"
        >
          <div>
            <TextInput
              label="NAME"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="media_contact_name"
              value={value.media_contact_name}
              onChange={onValueChange}
              error={error?.fields?.media_contact_name}
            />
          </div>
          <div>
            <TextInput
              label="EMAIL"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="media_contact_email"
              value={value.media_contact_email}
              onChange={onValueChange}
              error={error?.fields?.media_contact_email}
            />
          </div>
        </InputSection>
      </Container>
    </>
  );
}

export default Submission;

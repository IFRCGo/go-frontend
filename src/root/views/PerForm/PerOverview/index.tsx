import React from 'react';
import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import SelectInput from '#components/SelectInput';
import DateInput from '#components/DateInput';

import DREFFileInput from '#components/DREFFileInput';
import TextInput from '#components/TextInput';
import RadioInput from '#components/RadioInput';

import styles from './styles.module.scss';

function PerOverview() {
  const { strings } = React.useContext(LanguageContext);

  return (
    <>
      <Container
        className={styles.sharing}
        visibleOverflow
      >
        <InputSection
          title={strings.perFormNationalSociety}
        >
          <SelectInput
            error={undefined}
            name="national society"
            onChange={undefined}
            options={undefined}
            pending={undefined}
            value={undefined}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.perFormOrientation}
        className={styles.sharing}
        visibleOverflow
      >
        <InputSection
          title={strings.perFormDateOfOrientation}
          description={strings.perFormDateOfOrientationDescription}
        >
          <DateInput
            error={undefined}
            name="date of orientation"
            onChange={undefined}
            value={undefined}
          />
        </InputSection>
        <InputSection
          title={strings.perFormUploadADoc}
        >
          <DREFFileInput
            accept=".pdf, .docx, .pptx"
            error={undefined}
            fileIdToUrlMap={undefined}
            name="supporting_document"
            onChange={undefined}
            setFileIdToUrlMap={undefined}
            value={undefined}
          >
            {strings.drefFormUploadSupportingDocumentButtonLabel}
          </DREFFileInput>
        </InputSection>
      </Container>
      <Container
        heading={strings.perFormAssessment}
        className={styles.sharing}
        visibleOverflow
      >
        <InputSection
          title={strings.perFormDateOfAssessment}
          description={strings.perFormDateOfAssessmentDescription}
        >
          <DateInput
            error={undefined}
            name="date of orientation"
            onChange={undefined}
            value={undefined}
          />
        </InputSection>
        <InputSection
          title={strings.perFormTypeOfAssessment}
        >
          <SelectInput
            name={"reporting_ns" as const}
            options={undefined}
            onChange={undefined}
            value={undefined}
            error={undefined}
          />
        </InputSection>
        <InputSection
          title={strings.perFormAssessmentNumber}
          description={strings.perFormAssessmentNumberDescription}
        >
          <TextInput
            name="reporting_ns_contact_name"
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
        </InputSection>
        <InputSection
          title={strings.perFormBranchesInvolved}
        >
          <TextInput
            name="reporting_ns_contact_name"
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
        </InputSection>
        <InputSection
          title={strings.perFormWhatMethodHasThisAssessmentUsed}
        >
          <TextInput
            name="reporting_ns_contact_name"
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
        </InputSection>
        <InputSection
          title={strings.perFormEpiConsiderations}
          description={strings.perFormEpiConsiderationsDescription}
        >
          <RadioInput
            name={"emergency_appeal_planned" as const}
            options={undefined}
            keySelector={undefined}
            labelSelector={undefined}
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
        </InputSection>
        <InputSection
          title={strings.perFormUrbanConsiderations}
          description={strings.perFormUrbanConsiderationsDescription}
        >
          <RadioInput
            name={"emergency_appeal_planned" as const}
            options={undefined}
            keySelector={undefined}
            labelSelector={undefined}
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
        </InputSection>
        <InputSection
          title={strings.perFormClimateAndEnvironmentalConsiderations}
          description={strings.perFormClimateAndEnvironmentalConsiderationsDescription}
        >
          <RadioInput
            name={"emergency_appeal_planned" as const}
            options={undefined}
            keySelector={undefined}
            labelSelector={undefined}
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.perFormPreviousPerAssessment}
        className={styles.sharing}
        visibleOverflow
      >
        <InputSection
          title={strings.perFormDateOfPreviousPerAssessment}
        >
          <DateInput
            error={undefined}
            name="date of orientation"
            onChange={undefined}
            value={undefined}
          />
        </InputSection>
        <InputSection
          title={strings.perFormTypeOfPreviousPerAssessment}
        >
          <TextInput
            name="reporting_ns_contact_name"
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.perFormReviewsPlanned}
        className={styles.sharing}
        visibleOverflow
      >
        <InputSection
          title={strings.perFormEstimatedDateOfMidTermReview}
        >
          <DateInput
            error={undefined}
            name="date of orientation"
            onChange={undefined}
            value={undefined}
          />
        </InputSection>
        <InputSection
          title={strings.perFormEstimatedDateOfAssessment}
        >
          <DateInput
            error={undefined}
            name="date of orientation"
            onChange={undefined}
            value={undefined}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.perFormReviewsPlanned}
        className={styles.sharing}
        visibleOverflow
      >
        <InputSection
          title={strings.perFormEstimatedDateOfMidTermReview}
          multiRow
          oneColumn
        >
          <DateInput
            error={undefined}
            name="date of orientation"
            onChange={undefined}
            value={undefined}
          />
        </InputSection>
        <InputSection
          title={strings.perFormEstimatedDateOfAssessment}
        >
          <DateInput
            error={undefined}
            name="date of orientation"
            onChange={undefined}
            value={undefined}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.perFormContactInformation}
        className={styles.sharing}
        visibleOverflow>
        <InputSection
          title={strings.perFormNsFocalPoint}
          multiRow
          twoColumn
        >
          <TextInput
            label="Name"
            name="ifrc_appeal_manager_name"
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
          <TextInput
            label="Email"
            name="ifrc_appeal_manager_email"
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
          <TextInput
            label="Phone Number"
            name="ifrc_appeal_manager_phone_number"
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
        </InputSection>
        <InputSection
          title={strings.perFormPartnerFocalPoint}
          multiRow
          twoColumn
        >
          <TextInput
            label="Name"
            name="ifrc_appeal_manager_name"
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
          <TextInput
            label="Email"
            name="ifrc_appeal_manager_email"
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
          <TextInput
            label="Phone Number"
            name="ifrc_appeal_manager_phone_number"
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
          <TextInput
            label="Organization"
            name="ifrc_appeal_manager_title"
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
        </InputSection>
        <InputSection
          title={strings.perFormPERFacilitator}
          multiRow
          twoColumn
        >
          <TextInput
            label="Name"
            name="ifrc_appeal_manager_name"
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
          <TextInput
            label="Email"
            name="ifrc_appeal_manager_email"
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
          <TextInput
            label="Phone Number"
            name="ifrc_appeal_manager_phone_number"
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
          <TextInput
            label="Other contact method"
            name="ifrc_appeal_manager_title"
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
        </InputSection>
      </Container>
    </>
  );
}


export default PerOverview;

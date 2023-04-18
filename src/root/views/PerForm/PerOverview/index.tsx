import React from 'react';
import LanguageContext from '#root/languageContext';
import {
  EntriesAsList,
  getErrorObject,
  PartialForm,
  Error,
} from '@togglecorp/toggle-form';
import { ListResponse, useRequest } from '#utils/restRequest';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import SelectInput from '#components/SelectInput';
import DateInput from '#components/DateInput';
import {
  BooleanValueOption,
  NumericValueOption,
} from '#types';

import DREFFileInput from '#components/DREFFileInput';
import TextInput from '#components/TextInput';
import RadioInput from '#components/RadioInput';

import styles from './styles.module.scss';
import { PerOverviewFields,
  optionLabelSelector,
  booleanOptionKeySelector,
 } from '../usePerFormOptions';

type Value = PartialForm<PerOverviewFields>;

interface Props {
  value?: Value;
  error?: Error<Value> | undefined;
  onValueChange?: (...entries: EntriesAsList<Value>) => void;
  nationalSocietyOptions: NumericValueOption[];
  yesNoOptions: BooleanValueOption[],
}

function PerOverview(props: Props) {
  const {
    value,
    error: formError,
    onValueChange,
    nationalSocietyOptions,
    yesNoOptions,
  } = props;

  const {
    pending: fetchingOverview,
    response: overviewResponse,
  } = useRequest<ListResponse<PerOverviewFields>>({
    url: 'api/v2/new-per/',
  });

  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError]
  );

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
            name="national_society"
            onChange={onValueChange}
            options={nationalSocietyOptions}
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
            error={error?.date_of_orientation}
            name="date_of_orientation"
            onChange={onValueChange}
            value={value?.date_of_orientation}
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
            name={"is_epi" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value?.is_epi}
            onChange={onValueChange}
            error={error?.is_epi}
          />
        </InputSection>
        <InputSection
          title={strings.perFormUrbanConsiderations}
          description={strings.perFormUrbanConsiderationsDescription}
        >
          { /* FIX ME: Add Urban Radoi button API */}
          <RadioInput
            name={"is_epi" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value?.is_epi}
            onChange={onValueChange}
            error={error?.is_epi}
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

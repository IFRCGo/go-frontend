import React, { useCallback } from 'react';
import {
  EntriesAsList,
  getErrorObject,
  PartialForm,
  Error,
  SetBaseValueArg,
} from '@togglecorp/toggle-form';

import { ListResponse, useRequest } from '#utils/restRequest';
import LanguageContext from '#root/languageContext';
import {
  BooleanValueOption,
  NumericValueOption,
} from '#types';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import SelectInput from '#components/SelectInput';
import DateInput from '#components/DateInput';
import TextInput from '#components/TextInput';
import RadioInput from '#components/RadioInput';
import {
  PerOverviewFields,
  booleanOptionKeySelector,
  optionLabelSelector,
  TypeOfAssessment,
  emptyNumericOptionList,
} from '../common';

import styles from './styles.module.scss';
import FileInput from '#components/FileInput';
import { compareString } from '#utils/utils';

type Value = PartialForm<PerOverviewFields>;

interface Props {
  value?: Value;
  error?: Error<Value> | undefined;
  onValueChange?: (...entries: EntriesAsList<Value>) => void;
  nationalSocietyOptions: NumericValueOption[];
  yesNoOptions: BooleanValueOption[],
  fetchingCountries?: boolean;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  fileIdToUrlMap: Record<number, string>;
  onValueSet: (value: SetBaseValueArg<Value>) => void;
  fetchingNationalSociety?: boolean;
}

function PerOverview(props: Props) {
  const {
    value,
    error: formError,
    fetchingNationalSociety,
    onValueChange,
    nationalSocietyOptions,
    yesNoOptions,
    fileIdToUrlMap,
    onValueSet,
    setFileIdToUrlMap,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const {
    pending: fetchingPerOptions,
    response: assessmentResponse,
  } = useRequest<ListResponse<TypeOfAssessment>>({
    url: 'api/v2/per-assessmenttype/',
  });

  const assessmentOptions = React.useMemo(() => (
    assessmentResponse?.results?.map(d => ({
      value: d.id,
      label: d.name,
    })).sort(compareString) ?? emptyNumericOptionList
  ), [assessmentResponse]);

  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError]
  );

  const handleNSChange = useCallback((ns) => {
    onValueSet({
      ...value,
      national_society: ns,
      country: ns,
    });
  }, [value, onValueSet]);

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    console.warn(file);
    // setFile({
    //   picturePreview: URL.createObjectURL(event.target.files[0]),
    //   pictureAsFile: event.target.files[0]
    // });
  };

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
            error={error?.national_society}
            name={"national_society" as const}
            onChange={handleNSChange}
            options={nationalSocietyOptions}
            pending={fetchingNationalSociety}
            value={value?.national_society}
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
          <FileInput
            type='file'
            accept='.docx'
            buttonVariant="secondary"
            error={error?.orientation_document}
            fileIdToUrlMap={fileIdToUrlMap}
            name="orientation_document"
            onChange={handleImageChange}
            // setFileIdToUrlMap={setFileIdToUrlMap}
            value={value?.orientation_document}
          >
            {strings.drefFormUploadSupportingDocumentButtonLabel}
          </FileInput>
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
            error={error?.date_of_previous_assessment}
            name="date_of_previous_assessment"
            onChange={onValueChange}
            value={value?.date_of_previous_assessment}
          />
        </InputSection>
        <InputSection
          title={strings.perFormTypeOfAssessment}
        >
          <SelectInput
            name={"type_of_per_assessment" as const}
            options={assessmentOptions}
            onChange={onValueChange}
            value={value?.type_of_per_assessment}
            error={error?.type_of_per_assessment}
          />
        </InputSection>
        <InputSection
          title={strings.perFormAssessmentNumber}
          description={strings.perFormAssessmentNumberDescription}
        >
          <TextInput
            name="assessment_number"
            value={value?.assessment_number}
            onChange={onValueChange}
            error={error?.assessment_number}
          />
        </InputSection>
        <InputSection
          title={strings.perFormBranchesInvolved}
        >
          <TextInput
            name="branches_involved"
            value={value?.branches_involved}
            onChange={onValueChange}
            error={error?.branches_involved}
          />
        </InputSection>
        <InputSection
          title={strings.perFormWhatMethodHasThisAssessmentUsed}
        >
          <TextInput
            name="method_asmt_used"
            value={value?.method_asmt_used}
            onChange={onValueChange}
            error={error?.method_asmt_used}
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
          <RadioInput
            name={"assess_urban_aspect_of_country" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value?.assess_urban_aspect_of_country}
            onChange={onValueChange}
            error={error?.assess_urban_aspect_of_country}
          />
        </InputSection>
        <InputSection
          title={strings.perFormClimateAndEnvironmentalConsiderations}
          description={strings.perFormClimateAndEnvironmentalConsiderationsDescription}
        >
          <RadioInput
            name={"assess_climate_environment_of_country" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value?.assess_climate_environment_of_country}
            onChange={onValueChange}
            error={error?.assess_climate_environment_of_country}
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
            error={error?.date_of_previous_assessment}
            name="date_of_previous_assessment"
            onChange={onValueChange}
            value={value?.date_of_previous_assessment}
          />
        </InputSection>
        <InputSection
          title={strings.perFormTypeOfPreviousPerAssessment}
        >
          <TextInput
            name="type_of_per_assessment"
            value={value?.type_of_per_assessment}
            onChange={onValueChange}
            error={error?.type_of_per_assessment}
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
            error={error?.date_of_mid_term_review}
            name="date_of_mid_term_review"
            onChange={onValueChange}
            value={value?.date_of_mid_term_review}
          />
        </InputSection>
        <InputSection
          title={strings.perFormEstimatedDateOfAssessment}
        >
          <DateInput
            error={error?.date_of_next_asmt}
            name="date_of_next_asmt"
            onChange={onValueChange}
            value={value?.date_of_next_asmt}
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
            name="ns_focal_point_name"
            value={value?.ns_focal_point_name}
            onChange={onValueChange}
            error={error?.ns_focal_point_name}
          />
          <TextInput
            label="Email"
            name="ns_focal_point_email"
            value={value?.ns_focal_point_email}
            onChange={onValueChange}
            error={error?.ns_focal_point_email}
          />
          <TextInput
            label="Phone Number"
            name="ns_focal_point_phone"
            value={value?.ns_focal_point_phone}
            onChange={onValueChange}
            error={error?.ns_focal_point_phone}
          />
        </InputSection>
        <InputSection
          title={strings.perFormPartnerFocalPoint}
          multiRow
          twoColumn
        >
          <TextInput
            label="Name"
            name="partner_focal_point_name"
            value={value?.partner_focal_point_name}
            onChange={onValueChange}
            error={error?.partner_focal_point_name}
          />
          <TextInput
            label="Email"
            name="partner_focal_point_email"
            value={value?.partner_focal_point_email}
            onChange={onValueChange}
            error={error?.partner_focal_point_email}
          />
          <TextInput
            label="Phone Number"
            name="partner_focal_point_phone"
            value={value?.partner_focal_point_phone}
            onChange={onValueChange}
            error={error?.partner_focal_point_phone}
          />
          <TextInput
            label="Organization"
            name="partner_focal_point_organization"
            value={value?.partner_focal_point_organization}
            onChange={onValueChange}
            error={error?.partner_focal_point_organization}
          />
        </InputSection>
        <InputSection
          title={strings.perFormPERFacilitator}
          multiRow
          twoColumn
        >
          <TextInput
            label="Name"
            name="facilitator_name"
            value={value?.facilitator_name}
            onChange={onValueChange}
            error={error?.facilitator_name}
          />
          <TextInput
            label="Email"
            name="facilitator_email"
            value={value?.facilitator_email}
            onChange={onValueChange}
            error={error?.facilitator_email}
          />
          <TextInput
            label="Phone Number"
            name="facilitator_phone"
            value={value?.facilitator_phone}
            onChange={onValueChange}
            error={error?.facilitator_phone}
          />
          <TextInput
            label="Other contact method"
            name="facilitator_contact"
            value={value?.facilitator_contact}
            onChange={onValueChange}
            error={error?.facilitator_contact}
          />
        </InputSection>
      </Container>
    </>
  );
}


export default PerOverview;

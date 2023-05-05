import React from 'react';
import {
  EntriesAsList,
  getErrorObject,
  PartialForm,
  Error,
  SetBaseValueArg,
  useForm,
} from '@togglecorp/toggle-form';

import { ListResponse, useLazyRequest, useRequest } from '#utils/restRequest';
import LanguageContext from '#root/languageContext';
import { compareString } from '#utils/utils';
import useAlertContext from '#hooks/useAlert';
import { overviewSchema } from '../usePerFormOptions';
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
import Button from '#components/Button';
import NumberInput from '#components/NumberInput';
import {
  PerOverviewFields,
  booleanOptionKeySelector,
  optionLabelSelector,
  TypeOfAssessment,
  emptyNumericOptionList,
} from '../common';

import styles from './styles.module.scss';

type Value = PartialForm<PerOverviewFields>;

type StepTypes = 'overview' | 'assessment';

interface Props {
  value: Value;
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  nationalSocietyOptions: NumericValueOption[];
  countryOptions: NumericValueOption[];
  yesNoOptions: BooleanValueOption[],
  fetchingCountries?: boolean;
  onValueSet: (value: SetBaseValueArg<Value>) => void;
  fetchingNationalSociety?: boolean;
  perId?: string;
}

function PerOverview(props: Props) {
  const {
    value: outvalue,
    error: formError,
    fetchingNationalSociety,
    onValueChange,
    nationalSocietyOptions,
    yesNoOptions,
    onValueSet,
    countryOptions,
    perId
  } = props;

  const { strings } = React.useContext(LanguageContext);
  // const { perId } = match.params;
  const alert = useAlertContext();

  const {
    value,
    setFieldValue,
  } = useForm(overviewSchema, { value: {} as PartialForm<PerOverviewFields> });

  const [currentStep, setCurrentStep] = React.useState<StepTypes>('overview');

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

  const handleNSChange = React.useCallback((ns) => {
    onValueSet({
      ...value,
      national_society: ns,
      country: ns,
    });
  }, [value, onValueSet]);

  const {
    pending: perSubmitPending,
    trigger: submitRequest,
  } = useLazyRequest<PerOverviewFields, Partial<PerOverviewFields>>({
    url: perId ? `api/v2/new-per/${perId}/` : 'api/v2/new-per/',
    method: perId ? 'PUT' : 'POST',
    body: ctx => ctx,
    onSuccess: (response) => {
      alert.show(
        strings.perFormSaveRequestSuccessMessage,
        { variant: 'success' },
      );

      // if (!perId) {
      //   window.setTimeout(
      //     () => history.push(`/new-per/${response?.id}/edit/`),
      //     250,
      //   );
      // }
      //  else {
      //   handlePerLoad(response);
      // }
    },
    onFailure: ({
      value: {
        messageForNotification,
        formErrors,
      },
      debugMessage,
    }) => {
      // setError(formErrors);
      // if (formErrors.modified_at === 'OBSOLETE_PAYLOAD') {
      //   // There was a save conflict due to obsolete payload
      //   setShowObsoletePayloadResolutionModal(true);
      // }

      alert.show(
        <p>
          {strings.perFormSaveRequestFailureMessage}
          &nbsp;
          <strong>
            {messageForNotification}
          </strong>
        </p>,
        {
          variant: 'danger',
          debugMessage,
        },
      );
    },
  });

  const handleSubmit = React.useCallback((finalValues) => {
    console.warn('finalValues', finalValues);
    onValueSet(finalValues);
    submitRequest(finalValues);
  }, [onValueSet, submitRequest]);

  const handleFileInputChange = React.useCallback((event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.warn('file', file);
      setFieldValue(1, 'national_society');
      setFieldValue(file, 'orientation_document');
      // uploadFile(file);
    }
  }, [setFieldValue]);
  console.log('value', value);

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    const isCurrentTabValid = (['orientation_document']);

    if (!isCurrentTabValid) {
      return;
    }

    setCurrentStep(newStep);
  }, []);

  const handleSubmitButtonClick = React.useCallback(() => {
    if (currentStep === 'overview') {
      const nextStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'assessment'>]: Exclude<StepTypes, 'overview'>;
      } = {
        overview: 'assessment',
      };
      submitRequest(value as PerOverviewFields);
      handleTabChange(nextStepMap[currentStep]);
    }
  }, [
    value,
    currentStep,
    handleTabChange,
    submitRequest,
  ]);

  return (
    <>
      <Container
        className={styles.sharing}
        visibleOverflow
      >
        <div className={styles.perFormTitle}>
          {strings.perFormSetUpPerProcess}
        </div>
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
          <input
            className={styles.fileInput}
            name="orientation_document"
            accept='.docx, pdf'
            type="file"
            onChange={handleFileInputChange}
            value={value?.orientation_document}
          />
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
            error={error?.date_of_assessment}
            name="date_of_assessment"
            onChange={onValueChange}
            value={value?.date_of_assessment}
          />
        </InputSection>
        <InputSection
          title={strings.perFormTypeOfAssessment}
        >
          <SelectInput
            name={"type_of_assessment" as const}
            options={assessmentOptions}
            onChange={onValueChange}
            value={value?.type_of_assessment}
            error={error?.type_of_assessment}
          />
        </InputSection>
        <InputSection
          title={strings.perFormAssessmentNumber}
          description={strings.perFormAssessmentNumberDescription}
        >
          <NumberInput
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
            value={value.assess_urban_aspect_of_country}
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
          <SelectInput
            name={"type_of_per_assessment" as const}
            options={assessmentOptions}
            onChange={onValueChange}
            value={value?.type_of_per_assessment}
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
        heading={strings.perFormWorkPlanReviewsPlanned}
        className={styles.sharing}
        visibleOverflow
      >
        <InputSection
          title={strings.perFormWorkPlanDevelopmentDate}
        >
          <DateInput
            error={error?.workplan_development_date}
            name="workplan_development_date"
            onChange={onValueChange}
            value={value?.workplan_development_date}
          />
        </InputSection>
        <InputSection
          title={strings.perFormWorkPlanRevisionDate}
        >
          <DateInput
            error={error?.workplan_revision_date}
            name="workplan_revision_date"
            onChange={onValueChange}
            value={value?.workplan_revision_date}
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
        <div className={styles.actions}>
          <Button
            name={undefined}
            variant="secondary"
            onClick={handleSubmitButtonClick}
          >
            {strings.PerOverviewSetUpPerProcess}
          </Button>
        </div>
      </Container>
    </>
  );
}

export default PerOverview;

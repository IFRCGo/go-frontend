import React from 'react';
import {
  _cs,
  isDefined,
  isFalsy,
  isNotDefined,
  randomString,
} from '@togglecorp/fujs';
import {
  useForm,
  createSubmitHandler,
  PartialForm,
  getErrorObject,
  useFormArray,
} from '@togglecorp/toggle-form';

import BlockLoading from '#components/block-loading';
import Translate from '#components/Translate';
import Button from '#components/Button';
import InputSection from '#components/InputSection';
import SelectInput from '#components/SelectInput';
import TextInput from '#components/TextInput';
import NumberInput from '#components/NumberInput';
import DateInput from '#components/DateInput';
import Checkbox from '#components/Checkbox';
import RadioInput from '#components/RadioInput';
import NonFieldError from '#components/NonFieldError';
import TextOutput from '#components/text-output';
import LanguageContext from '#root/languageContext';
import RichTextArea from '#components/RichTextArea';
import Switch from '#components/Switch';
import RegionOutput from '#components/RegionOutput';

import useAlert from '#hooks/useAlert';
import useReduxState from '#hooks/useReduxState';

import { languageOptions } from '#utils/lang';
import {
  useLazyRequest,
  useRequest,
} from '#utils/restRequest';
import {
  Project,
  ProjectFormFields,
  AnnualSplit,
} from '#types';

import {
  schema,
  useThreeWOptions,
  PROJECT_STATUS_COMPLETED,
  PROJECT_STATUS_PLANNED,
  PROJECT_STATUS_ONGOING,
  FormType,
  transformResponseFieldsToFormFields,
} from './useThreeWOptions';

import AnnualSplitInput from './AnnualSplitInput';
import RegionSelectionInput from './RegionSelectionInput';

import styles from './styles.module.scss';
import Container from '#components/Container';

const defaultFormValues: PartialForm<FormType> = {
  project_districts: [],
  secondary_sectors: [],
  visibility: 'public',
};

interface Props {
  className?: string;
  onSubmitSuccess?: (result: Project) => void;
  projectId?: number;
  initialValue?: PartialForm<ProjectFormFields>;
}

function ThreeWForm(props: Props) {
  const {
    className,
    onSubmitSuccess,
    projectId,
    initialValue,
  } = props;

  const { strings } = React.useContext(LanguageContext);
  const { current: currentLanguage } = useReduxState('lang');
  const alert = useAlert();

  const {
    value,
    error: formError,
    setFieldValue: onValueChange,
    validate,
    setError: onErrorSet,
    setValue: onValueSet,
  } = useForm(
    schema,
    {
      value: {
        ...defaultFormValues,
        ...initialValue,
      },
    },
  );

  const error = React.useMemo(() => getErrorObject(formError), [formError]);
  const annualSplitErrors = React.useMemo(() => getErrorObject(error?.annual_split_detail), [error]);

  const {
    pending: projectDetailsPending,
    response: projectDetailsResponse,
  } = useRequest<Project>({
    skip: isNotDefined(projectId),
    url: `api/v2/project/${projectId}/`,
    onSuccess: (projectResponse) => {
      const formValue = transformResponseFieldsToFormFields(projectResponse);
      onValueSet(formValue);
    },
  });

  const languageMismatch = (isDefined(projectId) && projectDetailsResponse?.translation_module_original_language !== currentLanguage) ?? false;

  const {
    pending: submitRequestPending,
    trigger: submitRequest,
    // FIXME: add types for payload and response
  } = useLazyRequest({
    url: projectId ? `api/v2/project/${projectId}/` : 'api/v2/project/',
    method: projectId ? 'PUT' : 'POST',
    body: ctx => ctx,
    onSuccess: onSubmitSuccess,
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        (
          <Translate
            stringId="projectFormFailedToSubmit"
            params={{
              message: (
                <strong>
                  {messageForNotification}
                </strong>
              )
            }}
          />
        ),
        {
          variant: 'danger',
          debugMessage,
        },
      );
    },
  });

  const handleSubmit = React.useCallback((finalValues) => {
    onValueSet(finalValues);
    submitRequest(finalValues);
  }, [onValueSet, submitRequest]);

  // const languageMismatch = (isDefined(projectId) && fieldReportResponse?.translation_module_original_language !== currentLanguage) ?? false;


  const {
    fetchingCountries,
    // fetchingDistricts,
    fetchingEvents,
    fetchingDisasterTypes,
    nationalSocietyOptions,
    countryOptions,
    // districtOptions,
    sectorOptions,
    secondarySectorOptions,
    programmeTypeOptions,
    operationTypeOptions,
    currentOperationOptions,
    currentEmergencyOperationOptions,
    operationToDisasterMap,
    projectVisibilityOptions,
    // shouldDisableDistrictInput,
    shouldShowCurrentEmergencyOperation,
    shouldShowCurrentOperation,
    // districtPlaceholder,
    disasterTypeOptions,
    currentOperationPlaceholder,
    disasterTypePlaceholder,
    shouldDisableDisasterType,
    statuses,
    isTotalRequired,
    shouldDisableTotalTarget,
    shouldDisableTotalReached,
    disasterTypeLabel,
    // countriesResponse,
  } = useThreeWOptions(value);


  // Calculate and set project status
  React.useEffect(() => {
    if (value.is_project_completed) {
      onValueChange(PROJECT_STATUS_COMPLETED, 'status');
      return;
    }

    if (!isDefined(value.start_date)) {
      onValueChange(undefined, 'status');
      return;
    }

    const startDate = new Date(value.start_date);
    const now = new Date();

    if (startDate <= now) {
      onValueChange(PROJECT_STATUS_ONGOING, 'status');
      return;
    }

    onValueChange(PROJECT_STATUS_PLANNED, 'status');
  }, [onValueChange, value.start_date, value.is_project_completed]);

  // Calculate and set target total
  React.useEffect(() => {
    if (isFalsy(value.target_male)
      && isFalsy(value.target_female)
      && isFalsy(value.target_other)
    ) {
      return;
    }

    const total = (value.target_male ?? 0)
      + (value.target_female ?? 0)
      + (value.target_other ?? 0);
    onValueChange(total, 'target_total');
  }, [onValueChange, value.target_male, value.target_female, value.target_other]);

  // Calculate and set reached total
  React.useEffect(() => {
    if (isFalsy(value.reached_male)
      && isFalsy(value.reached_female)
      && isFalsy(value.reached_other)
    ) {
      return;
    }

    const total = (value.reached_male ?? 0)
      + (value.reached_female ?? 0)
      + (value.reached_other ?? 0);
    onValueChange(total, 'reached_total');
  }, [onValueChange, value.reached_male, value.reached_female, value.reached_other]);


  // Set beginning is_annual_report switch according to the filled-in annual split details
  React.useEffect(() => {
    onValueChange((oldValue: boolean | undefined) => {
      if (isNotDefined(oldValue)) {
        return !!value.annual_split_detail?.length;
      }

      return oldValue;
    }, 'is_annual_report');
  }, [onValueChange, value.annual_split_detail]);


  // Set disaster type based on the selected event
  React.useEffect(() => {
    if (shouldDisableDisasterType) {
      if (isDefined(value.event)) {
        onValueChange(operationToDisasterMap[value.event], 'dtype');
      }
    }
  }, [onValueChange, value.event, operationToDisasterMap, shouldDisableDisasterType]);

  React.useEffect(() => {
    onValueChange((oldValue: number | undefined) => {
      if (isNotDefined(oldValue)) {
        return value.budget_amount;
      }

      return oldValue;
    }, 'actual_expenditure');
  }, [onValueChange, value.budget_amount]);

  React.useEffect(() => {
    onValueChange((oldValue: number | undefined) => {
      if (isNotDefined(oldValue)) {
        return value.actual_expenditure;
      }
      return oldValue;
    }, 'budget_amount');
  }, [onValueChange, value.actual_expenditure]);

  const projectFormPending = submitRequestPending;
  const shouldDisableSubmitButton = submitRequestPending || projectDetailsPending;

  const handleProjectCountryChange = React.useCallback(
    (val: number | undefined, name: 'project_country') => {
      onValueChange(val, name);
      onValueChange(undefined, 'project_districts' as const);
      onValueChange(undefined, 'project_admin2' as const);
    },
    [onValueChange],
  );

  const handleAddAnnualSplitButtonClick = React.useCallback(() => {
    const client_id = randomString();
    const newAnnualSplit: PartialForm<AnnualSplit> = {
      client_id,
    };

    onValueChange(
      (oldValue: PartialForm<AnnualSplit[]> | undefined) => (
        [...(oldValue ?? []), newAnnualSplit]
      ),
      'annual_split_detail' as const,
    );
  }, [onValueChange]);

  const {
    setValue: setAnnualSplit,
    removeValue: removeAnnualSplit,
  } = useFormArray<'annual_split_detail', PartialForm<AnnualSplit>>(
    'annual_split_detail',
    onValueChange,
  );

  return (
    <div
      className={_cs(styles.threeWForm, className)}
    >
      {projectDetailsPending ? (
        <BlockLoading />
      ) : (
        <>
          {languageMismatch && projectDetailsResponse && (
            <Container contentClassName={styles.languageMismatch}>
              <Translate
                stringId="translationErrorEdit"
                params={{
                  originalLanguage: (
                    <strong>
                      {languageOptions[
                          projectDetailsResponse.translation_module_original_language
                      ]}
                    </strong>
                  ),
                }}
              />
            </Container>
          )}
          {!languageMismatch && (
            <>
              <InputSection
                title={strings.projectFormReportingNational}
                description={strings.projectFormReportingHelpText}
                tooltip={strings.projectFormReportingTooltip}
              >
                <SelectInput
                  error={error?.reporting_ns}
                  name={"reporting_ns" as const}
                  onChange={onValueChange}
                  options={nationalSocietyOptions}
                  pending={fetchingCountries}
                  value={value.reporting_ns}
                />
              </InputSection>
              <InputSection
                  title={strings.projectFormReportingNationalContact}
                  description={strings.projectFormReportingNationalContactText}
              >
                <TextInput
                    name="reporting_ns_contact_name"
                    label="Name"
                    onChange={onValueChange}
                    value={value.reporting_ns_contact_name}
                />
                <TextInput
                    name="reporting_ns_contact_role"
                    label="Role"
                    onChange={onValueChange}
                    value={value.reporting_ns_contact_role}
                />
                <TextInput
                    name="reporting_ns_contact_email"
                    label="Email"
                    onChange={onValueChange}
                    value={value.reporting_ns_contact_email}
                />
              </InputSection>
              <InputSection
                title={strings.projectFormCountryTitle}
                description={strings.projectFormCountryHelpText}
                tooltip={strings.projectFormCountryTooltip}
                multiRow
                twoColumn
              >
                <SelectInput
                  error={error?.project_country}
                  label={strings.projectFormCountryLabel}
                  name="project_country"
                  onChange={handleProjectCountryChange}
                  options={countryOptions}
                  pending={fetchingCountries}
                  value={value.project_country}
                />
                <RegionSelectionInput
                  className={styles.regionSelectionInput}
                  districtsInputName={"project_districts" as const}
                  districtsInputValue={value.project_districts}
                  onDistrictsChange={onValueChange}
                  onAdmin2sChange={onValueChange}
                  admin2sInputName={"project_admin2" as const}
                  admin2sInputValue={value.project_admin2}
                  countryId={value.project_country}
                />
                <RegionOutput
                    districts={value.project_districts}
                    admin2s={value.project_admin2}
                    countryId={value.project_country}
                />
              </InputSection>
              <InputSection
                title={strings.projectFormTypeOfOperation}
                tooltip={strings.projectFormTypeOfOperationTooltip}
                description={
                  <React.Fragment>
                    <strong>{strings.projectFormProgrammeType}</strong>
                    &nbsp;
                    {strings.projectFormProgrammeTooltip}
                  </React.Fragment>
                }
              >
                <SelectInput
                  error={error?.operation_type}
                  label={strings.projectFormOperationType}
                  name={"operation_type" as const}
                  onChange={onValueChange}
                  options={operationTypeOptions}
                  value={value.operation_type}
                />
                <SelectInput
                  error={error?.programme_type}
                  label={strings.projectFormProgrammeTypeLabel}
                  name={"programme_type" as const}
                  onChange={onValueChange}
                  options={programmeTypeOptions}
                  value={value.programme_type}
                />
              </InputSection>
              { shouldShowCurrentOperation && (
                <InputSection title={strings.projectFormCurrentOperation}>
                  <SelectInput
                    error={error?.event}
                    name={"event" as const}
                    options={currentOperationOptions}
                    pending={fetchingEvents}
                    placeholder={currentOperationPlaceholder}
                    value={value.event}
                    onChange={onValueChange}
                  />
                </InputSection>
              )}
              { shouldShowCurrentEmergencyOperation && (
                <InputSection
                  title={strings.projectFormCurrentEmergency}
                  description={strings.projectFormCurrentEmergencyHelpText}
                >
                  <SelectInput
                    error={error?.event}
                    name={"event" as const}
                    options={currentEmergencyOperationOptions}
                    pending={fetchingEvents}
                    placeholder={currentOperationPlaceholder}
                    value={value.event}
                    onChange={onValueChange}
                  />
                </InputSection>
              )}
              <InputSection
                title={disasterTypeLabel}
              >
                <SelectInput
                  error={error?.dtype}
                  name={"dtype" as const}
                  options={disasterTypeOptions}
                  pending={fetchingDisasterTypes}
                  disabled={shouldDisableDisasterType}
                  placeholder={disasterTypePlaceholder}
                  value={value.dtype}
                  onChange={onValueChange}
                />
              </InputSection>
              <InputSection
                title={strings.projectFormProjectName}
                description={strings.projectFormHelpText}
                tooltip={strings.projectFormTooltip}
              >
                <TextInput
                  name='name'
                  value={value.name}
                  onChange={onValueChange}
                  error={error?.name}
                />
              </InputSection>
              <InputSection
                  title={strings.projectFormDescription}
                  // description={strings.projectFormDescriptionHelpText}
                  // tooltip={strings.projectFormDescriptionTooltip}
                  // These texts are moved into the area as placeholder:
                  >
                    <RichTextArea
                      name='description'
                      value={value.description === null ? '' : value.description}
                      onChange={onValueChange}
                      error={error?.description}
                      placeholder={strings.projectFormDescriptionHelpText + ' ' + strings.projectFormDescriptionTooltip}
                    />
                  </InputSection>
                  <InputSection
                    className='multi-input-section'
                    title={strings.projectFormSectorTitle}
                    description={
                      <React.Fragment>
                        <p>
                          <strong>
                            {strings.projectFormPrimarySector}
                          </strong>
                          &nbsp;
                          {strings.projectFormPrimarySectorText}
                        </p>
                        <p>
                          <strong>
                            {strings.projectFormTagging}
                          </strong>
                          &nbsp;
                          {strings.projectFormTaggingText}
                        </p>
                      </React.Fragment>
                    }
                    tooltip={strings.projectFormTaggingTooltip}
                  >
                    <SelectInput
                      error={error?.primary_sector}
                      label={strings.projectFormPrimarySectorSelect}
                      name={"primary_sector" as const}
                      onChange={onValueChange}
                      options={sectorOptions}
                      value={value.primary_sector}
                    />
                    <SelectInput
                      error={error?.secondary_sectors}
                      isMulti
                      label={strings.projectFormSecondarySectorLabel}
                      name={"secondary_sectors" as const}
                      onChange={onValueChange}
                      options={secondarySectorOptions}
                      value={value.secondary_sectors}
                    />
                  </InputSection>
                  <InputSection
                    title={strings.projectFormMultiLabel}
                    description={strings.projectFormMultiLabelHelpText}
                    tooltip={strings.projectFormMultiLabelTooltip}
                  >
                    <DateInput
                      error={error?.start_date}
                      label={strings.projectFormStartDate}
                      name='start_date'
                      onChange={onValueChange}
                      value={value.start_date}
                    />
                    <DateInput
                      error={error?.end_date}
                      label={strings.projectFormEndDate}
                      name='end_date'
                      onChange={onValueChange}
                      value={value.end_date}
                    />
                  </InputSection>
                  <InputSection
                    className='multi-input-section'
                    title={strings.projectFormBudgetTitle}
                    description={
                      <React.Fragment>
                        <p>
                          <strong>
                            {strings.projectFormBudget}
                          </strong>
                          &nbsp;
                          {strings.projectFormBudgetText}
                        </p>
                        <p>
                          <strong>
                            {strings.projectFormProjectStatus}
                          </strong>
                          &nbsp;
                          {strings.projectFormProjectStatusText}
                        </p>
                      </React.Fragment>
                    }
                    tooltip={strings.projectFormProjectTooltip}
                  >
                    {value.is_project_completed ? (
                      <NumberInput
                        error={error?.actual_expenditure}
                        label={strings.projectFormActualExpenditure}
                        name='actual_expenditure'
                        value={value.actual_expenditure}
                        onChange={onValueChange}
                      />
                    ) : (
                      <NumberInput
                        error={error?.budget_amount}
                        label={strings.projectFormProjectBudget}
                        name='budget_amount'
                        value={value.budget_amount}
                        onChange={onValueChange}
                      />
                    )}
                    <div>
                      <Checkbox
                        label={strings.projectFormProjectCompleted}
                        name={"is_project_completed" as const}
                        value={value?.is_project_completed}
                        onChange={onValueChange}
                      />
                      <TextOutput
                        label={strings.projectFormProjectStatusTitle}
                        value={value.status ? statuses[value.status] : undefined}
                      />
                    </div>
                    <div>
                      <Switch
                        label="Annual Reporting"
                        name="is_annual_report"
                        value={value?.is_annual_report}
                        onChange={onValueChange}
                      />
                    </div>
                  </InputSection>
                  {value?.is_annual_report === true ? (
                    <InputSection
                      description={strings.projectFormPeopleTargetedHelpText}
                      title={strings.projectFormPeopleTargeted + ' ' + strings.projectFormAnnually}
                      tooltip={strings.projectFormPeopleTargetedTooltip + strings.projectFormAnnually}
                      oneColumn
                      multiRow
                    >
                      {value?.annual_split_detail?.map((annual_split, i) => (
                        <AnnualSplitInput
                          key={i}
                          index={i}
                          value={annual_split}
                          onChange={setAnnualSplit}
                          error={annualSplitErrors?.[annual_split.client_id as string]}
                          onRemove={removeAnnualSplit}
                        />
                      ))}
                      <div>
                        <Button
                          onClick={handleAddAnnualSplitButtonClick}
                          name={undefined}
                          variant="secondary"
                        >
                          {strings.addNewSplit}
                        </Button>
                      </div>
                    </InputSection>
                  ) : (
                    <>
                      <InputSection
                        description={strings.projectFormPeopleTargetedHelpText}
                        title={strings.projectFormPeopleTargeted}
                        tooltip={strings.projectFormPeopleTargetedTooltip}
                      >
                        <NumberInput
                          name='target_male'
                          label={strings.projectFormMale}
                          value={value.target_male}
                          error={error?.target_male}
                          onChange={onValueChange}
                        />
                        <NumberInput
                          name='target_female'
                          label={strings.projectFormFemale}
                          value={value.target_female}
                          error={error?.target_female}
                          onChange={onValueChange}
                        />
                        <NumberInput
                          name='target_other'
                          label={strings.projectFormOther}
                          value={value.target_other}
                          error={error?.target_other}
                          onChange={onValueChange}
                        />
                        <NumberInput
                          disabled={shouldDisableTotalTarget || value?.is_annual_report}
                          name='target_total'
                          label={isTotalRequired && !shouldDisableTotalTarget ? strings.projectFormTotalRequired : strings.projectFormTotal}
                          value={value.target_total}
                          error={error?.target_total}
                          onChange={onValueChange}
                          className={shouldDisableTotalTarget ? styles.disable : styles.normal}
                        />
                      </InputSection>
                      <InputSection
                        title={strings.projectFormPeopleReached2}
                        description={strings.projectFormPeopleReachedHelpText}
                        tooltip={strings.projectFormPeopleReachedTooltip}
                      >
                        <NumberInput
                          name='reached_male'
                          label={strings.projectFormPeopleReachedMale}
                          value={value.reached_male}
                          error={error?.reached_male}
                          onChange={onValueChange}
                        />
                        <NumberInput
                          name='reached_female'
                          label={strings.projectFormPeopleReachedFemale}
                          value={value.reached_female}
                          error={error?.reached_female}
                          onChange={onValueChange}
                        />
                        <NumberInput
                          name='reached_other'
                          label={strings.projectFormPeopleReachedOther}
                          value={value.reached_other}
                          error={error?.reached_other}
                          onChange={onValueChange}
                        />
                        <NumberInput
                          disabled={shouldDisableTotalReached || value?.is_annual_report}
                          name='reached_total'
                          label={isTotalRequired && !shouldDisableTotalReached ? strings.projectFormTotalRequired : strings.projectFormTotal}
                          value={value.reached_total}
                          error={error?.reached_total}
                          onChange={onValueChange}
                          className={shouldDisableTotalReached ? styles.disable : styles.normal}
                        />
                      </InputSection>
                    </>
                  )}
                  <InputSection
                    title={strings.projectFormProjectVisibility}
                    description={strings.projectFormProjectVisibilityHelpText}
                    tooltip={strings.projectFormProjectVisibilityTooltip}
                  >
                    <RadioInput
                      name={"visibility" as const}
                      value={value.visibility}
                      onChange={onValueChange}
                      error={error?.visibility}
                      options={projectVisibilityOptions}
                      keySelector={d => d.value}
                      labelSelector={d => d.label}
                    />
                  </InputSection>
                <div className={styles.formActions}>
                  {/*
                    The first hidden and disabled submit button is to disable form submission on enter
                    more details on: https://www.w3.org/TR/2018/SPSD-html5-20180327/forms.html#implicit-submission
                  */}
                  <button
                    className={styles.fakeSubmitButton}
                    type="submit"
                    disabled
                  />
                  <NonFieldError
                    className={styles.nonFieldError}
                    error={error}
                    message={strings.projectFormNonFieldError}
                  />
                  <Button
                    name={undefined}
                    onClick={createSubmitHandler(validate, onErrorSet, handleSubmit)}
                    disabled={shouldDisableSubmitButton}
                    variant="secondary"
                  >
                    { projectFormPending ? strings.projectFormSubmitting : strings.projectFormSubmit }
                  </Button>
                </div>
              </>
            )}
          </>
        )}
    </div>
  );
}

export default ThreeWForm;

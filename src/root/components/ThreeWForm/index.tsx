import React from 'react';
import {
  _cs,
  isDefined,
  isFalsy,
  isNotDefined,
} from '@togglecorp/fujs';
import {
  useForm,
  createSubmitHandler,
  PartialForm,
} from '@togglecorp/toggle-form';
import { MdDoneAll } from 'react-icons/md';

import BlockLoading from '#components/block-loading';
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

import useAlert from '#hooks/useAlert';
import {
  useLazyRequest,
  useRequest,
} from '#utils/restRequest';
import {
  Project,
  ProjectFormFields,
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

import styles from './styles.module.scss';

const defaultFormValues: PartialForm<FormType> = {
  project_districts: [],
  secondary_sectors: [],
  visibility: 'public',
};

interface Props {
  className?: string;
  onSubmitSuccess?: () => void;
  projectId?: number;
  initialValue?: Partial<ProjectFormFields>;
}

function ThreeWForm(props: Props) {
  const {
    className,
    onSubmitSuccess,
    projectId,
    initialValue,
  } = props;

  const { strings } = React.useContext(LanguageContext);
  const alert = useAlert();

  const {
    value,
    error,
    onValueChange,
    validate,
    onErrorSet,
    onValueSet,
  } = useForm({
    ...defaultFormValues,
    ...initialValue,
  }, schema);

  const {
    pending: projectDetailsPending,
    response: projectResponse,
  } = useRequest<Project>({
    skip: isNotDefined(projectId),
    url: `api/v2/project/${projectId}/`,
  });

  React.useEffect(() => {
    if (projectResponse) {
      const formValue = transformResponseFieldsToFormFields(projectResponse);
      onValueSet(formValue);
    }
  }, [projectResponse, onValueSet]);


  const {
    pending: submitRequestPending,
    trigger: submitRequest,
  } = useLazyRequest({
    url: projectId ? `api/v2/project/${projectId}/` : 'api/v2/project/',
    method: projectId ? 'PUT' : 'POST',
    body: ctx => ctx,
    onSuccess: onSubmitSuccess,
    onFailure: ({ value: { messageForNotification, errors } }) => {
      console.error(errors);
      alert.show(
        (
          <p>
            Failed to sumbit project
            &nbsp;
            { messageForNotification }
          </p>
        ),
        { variant: 'danger' },
      );
    },
  });

  const handleSubmit = React.useCallback((finalValues) => {
    onValueSet(finalValues);
    submitRequest(finalValues);
  }, [onValueSet, submitRequest]);

  const {
    fetchingCountries,
    fetchingDistricts,
    fetchingEvents,
    fetchingDisasterTypes,
    nationalSocietyOptions,
    countryOptions,
    districtOptions,
    sectorOptions,
    secondarySectorOptions,
    programmeTypeOptions,
    operationTypeOptions,
    currentOperationOptions,
    currentEmergencyOperationOptions,
    operationToDisasterMap,
    projectVisibilityOptions,
    shouldDisableDistrictInput,
    shouldShowCurrentEmergencyOperation,
    shouldShowCurrentOperation,
    districtPlaceholder,
    disasterTypeOptions,
    currentOperationPlaceholder,
    disasterTypePlaceholder,
    shouldDisableDisasterType,
    statuses,
    isReachedTotalRequired,
    shouldDisableTotalTarget,
    shouldDisableTotalReached,
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

  const handleSelectAllDistrictButtonClick = React.useCallback(() => {
    const allDistricts = districtOptions.map(d => d.value);
    onValueChange(allDistricts, 'project_districts');
  }, [onValueChange, districtOptions]);

  const projectFormPending = submitRequestPending;
  const shouldDisableSubmitButton = !!(error?.fields) || submitRequestPending || projectDetailsPending;

  const handleProjectCountryChange = React.useCallback(
    (val: number | undefined, name: 'project_country') => {
      onValueChange(val, name);
      onValueChange(undefined, 'project_districts' as const);
    },
    [onValueChange],
  );

  return (
    <form
      onSubmit={createSubmitHandler(validate, onErrorSet, handleSubmit)}
      className={_cs(styles.threeWForm, className)}
    >
      {projectDetailsPending ? (
        <BlockLoading />
      ) : (
        <>
          <InputSection
            title={strings.projectFormReportingNational}
            description={strings.projectFormReportingHelpText}
            tooltip={strings.projectFormReportingTooltip}
          >
            <SelectInput
              error={error?.fields?.reporting_ns}
              name="reporting_ns"
              onChange={onValueChange}
              options={nationalSocietyOptions}
              pending={fetchingCountries}
              value={value.reporting_ns}
            />
          </InputSection>
          <InputSection
            title={strings.projectFormCountryTitle}
            description={strings.projectFormCountryHelpText}
            tooltip={strings.projectFormCountryTooltip}
          >
            <SelectInput
              error={error?.fields?.project_country}
              label={strings.projectFormCountryLabel}
              name="project_country"
              onChange={handleProjectCountryChange}
              options={countryOptions}
              pending={fetchingCountries}
              value={value.project_country}
            />
            <SelectInput
              disabled={shouldDisableDistrictInput}
              pending={fetchingDistricts}
              error={error?.fields?.project_districts}
              isMulti
              label={strings.projectFormDistrictLabel}
              name="project_districts"
              onChange={onValueChange}
              options={districtOptions}
              placeholder={districtPlaceholder}
              value={value.project_districts}
              actions={(
                <button
                  // FIXME: use strings
                  title="Select all districts"
                  type="button"
                  className={_cs(
                    styles.selectAllDistrictsButton,
                    'button button--secondary',
                    shouldDisableDistrictInput && 'disabled',
                  )}
                  disabled={shouldDisableDistrictInput}
                  onClick={handleSelectAllDistrictButtonClick}
                >
                  <MdDoneAll />
                </button>
              )}
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
              error={error?.fields?.operation_type}
              label={strings.projectFormOperationType}
              name='operation_type'
              onChange={onValueChange}
              options={operationTypeOptions}
              value={value.operation_type}
            />
            <SelectInput
              error={error?.fields?.programme_type}
              label={strings.projectFormProgrammeTypeLabel}
              name='programme_type'
              onChange={onValueChange}
              options={programmeTypeOptions}
              value={value.programme_type}
            />
          </InputSection>
          { shouldShowCurrentOperation && (
            <InputSection title={strings.projectFormCurrentOperation}>
              <SelectInput
                error={error?.fields?.event}
                name='event'
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
                error={error?.fields?.event}
                name='event'
                options={currentEmergencyOperationOptions}
                pending={fetchingEvents}
                placeholder={currentOperationPlaceholder}
                value={value.event}
                onChange={onValueChange}
              />
            </InputSection>
          )}
          <InputSection title={strings.projectFormDisasterType}>
            <SelectInput
              error={error?.fields?.dtype}
              name="dtype"
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
              error={error?.fields?.name}
              name='name'
              onChange={onValueChange}
              value={value.name}
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
              error={error?.fields?.primary_sector}
              label={strings.projectFormPrimarySectorSelect}
              name='primary_sector'
              onChange={onValueChange}
              options={sectorOptions}
              value={value.primary_sector}
            />
            <SelectInput
              error={error?.fields?.secondary_sectors}
              isMulti
              label={strings.projectFormSecondarySectorLabel}
              name='secondary_sectors'
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
              error={error?.fields?.start_date}
              label={strings.projectFormStartDate}
              name='start_date'
              onChange={onValueChange}
              value={value.start_date}
            />
            <DateInput
              error={error?.fields?.end_date}
              label={strings.projectFormEndDate}
              name='end_date'
              onChange={onValueChange}
              value={value.end_date}
            />
          </InputSection>
          <InputSection
            className='multi-input-section'
            // TODO: use translations
            title="Budget and Status*"
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
            {/* TODO: use translations */}
            { value.is_project_completed ? (
              <NumberInput
                error={error?.fields?.actual_expenditure}
                label='Actual Expenditure (CHF)'
                name='actual_expenditure'
                value={value.actual_expenditure}
                onChange={onValueChange}
              />
            ) : (
              <NumberInput
                error={error?.fields?.budget_amount}
                label='Project Budget (CHF)'
                name='budget_amount'
                value={value.budget_amount}
                onChange={onValueChange}
              />
            )}
            <div>
              <Checkbox
                label={strings.projectFormProjectCompleted}
                name="is_project_completed"
                value={value?.is_project_completed}
                onChange={onValueChange}
              />
              <TextOutput
                label={strings.projectFormProjectStatusTitle}
                value={value.status ? statuses[value.status] : undefined}
              />
            </div>
          </InputSection>
          <InputSection
            description={strings.projectFormPeopleTagetedHelpText}
            title={strings.projectFormPeopleTageted}
            tooltip={strings.projectFormPeopleTagetedTooltip}
          >
            <NumberInput
              name='target_male'
              label={strings.projectFormMale}
              value={value.target_male}
              error={error?.fields?.target_male}
              onChange={onValueChange}
            />
            <NumberInput
              name='target_female'
              label={strings.projectFormFemale}
              value={value.target_female}
              error={error?.fields?.target_female}
              onChange={onValueChange}
            />
            <NumberInput
              name='target_other'
              label={strings.projectFormOther}
              value={value.target_other}
              error={error?.fields?.target_other}
              onChange={onValueChange}
            />
            <NumberInput
              disabled={shouldDisableTotalTarget}
              name='target_total'
              label="Total*"
              value={value.target_total}
              error={error?.fields?.target_total}
              onChange={onValueChange}
            />
          </InputSection>
          <InputSection
            title={strings.projectFormPeopleReached}
            description={strings.projectFormPeopleReachedHelpText}
            tooltip={strings.projectFormPeopleReachedTooltip}
          >
            <NumberInput
              name='reached_male'
              label={strings.projectFormPeopleReachedMale}
              value={value.reached_male}
              error={error?.fields?.reached_male}
              onChange={onValueChange}
            />
            <NumberInput
              name='reached_female'
              label={strings.projectFormPeopleReachedFemale}
              value={value.reached_female}
              error={error?.fields?.reached_female}
              onChange={onValueChange}
            />
            <NumberInput
              name='reached_other'
              label={strings.projectFormPeopleReachedOther}
              value={value.reached_other}
              error={error?.fields?.reached_other}
              onChange={onValueChange}
            />
            <NumberInput
              disabled={shouldDisableTotalReached}
              name='reached_total'
              label={isReachedTotalRequired ? 'Total* ' : 'Total'}
              value={value.reached_total}
              error={error?.fields?.reached_total}
              onChange={onValueChange}
            />
          </InputSection>
          <InputSection
            title={strings.projectFormProjectVisibility}
            description={strings.projectFormProjectVisibilityHelpText}
            tooltip={strings.projectFormProjectVisibilityTooltip}
          >
            <RadioInput
              name='visibility'
              value={value.visibility}
              onChange={onValueChange}
              error={error?.fields?.visibility}
              options={projectVisibilityOptions}
              radioKeySelector={d => d.value}
              radioLabelSelector={d => d.label}
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
              message="Please correct all the errors above before submission"
            />
            <Button
              type="submit"
              disabled={shouldDisableSubmitButton}
              variant="secondary"
            >
              { projectFormPending ? strings.projectFormSubmitting : strings.projectFormSubmit }
            </Button>
          </div>
        </>
      )}
    </form>
  );
}

export default ThreeWForm;

import React from 'react';
import {
  Link,
  match,
} from 'react-router-dom';
import {
  History,
  Location,
} from 'history';
import {
  isDefined,
  listToMap,
  mapToMap,
  isNotDefined,
} from '@togglecorp/fujs';
import {
  analyzeErrors,
  getErrorObject,
  ObjectError,
  PartialForm,
  useForm,
  accumulateErrors,
} from '@togglecorp/toggle-form';

import TabList from '#components/Tabs/TabList';
import Page from '#components/Page';
import Tabs from '#components/Tabs';
import Tab from '#components/Tabs/Tab';
import Button, { useButtonFeatures } from '#components/Button';
import NonFieldError from '#components/NonFieldError';
import TabPanel from '#components/Tabs/TabPanel';
import languageContext from '#root/languageContext';
import Container from '#components/Container';
import BlockLoading from '#components/block-loading';
import { getDisplayName } from '#components/UserSearchSelectInput';
import { Option } from '#components/SearchSelectInput';
import useAlert from '#hooks/useAlert';
import {
  useLazyRequest,
  useRequest,
} from '#utils/restRequest';
import scrollToTop from '#utils/scrollToTop';
import { DrefApiFields } from '#views/DrefApplicationForm/common';
import { checkLanguageMismatch, isSimilarArray, ymdToDateString } from '#utils/common';
import Translate from '#components/Translate';
import useReduxState from '#hooks/useReduxState';
import { languageOptions } from '#utils/lang';

import {
  DrefOperationalUpdateFields,
  eventFields,
  needsFields,
  overviewFields,
  operationFields,
  submissionFields,
  DrefOperationalUpdateApiFields,
  TYPE_LOAN,
} from './common';
import useDrefOperationalFormOptions, {
  schema
} from './useDrefOperationalUpdateOptions';
import Overview from './Overview';
import EventDetails from './EventDetails';
import Needs from './Needs';
import Operation from './Operation';
import Submission from './Submission';
import ObsoletePayloadResolutionModal from './ObsoletePayloadResolutionModal';
import styles from './styles.module.scss';

interface Props {
  match: match<{ id?: string }>;
  history: History;
  location: Location;
}

type StepTypes = 'operationOverview' | 'eventDetails' | 'needs' | 'operation' | 'submission';

const stepTypesToFieldsMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in StepTypes]: (keyof DrefOperationalUpdateFields)[];
} = {
  operationOverview: overviewFields,
  eventDetails: eventFields,
  needs: needsFields,
  operation: operationFields,
  submission: submissionFields,
};

const defaultFormValues: PartialForm<DrefOperationalUpdateFields> = {
  planned_interventions: [],
  national_society_actions: [],
  needs_identified: [],
  images_file: [],
  users: [],
  is_assessment_report: false,
  changing_timeframe_operation: false,
  changing_operation_strategy: false,
  changing_target_population_of_operation: false,
  changing_geographic_location: false,
  changing_budget: false,
  request_for_second_allocation: false,
  has_forecasted_event_materialize: false,
};

const intermittentValidationExceptions: (keyof DrefOperationalUpdateFields)[] = [
  'event_map_file',
  'photos_file',
  'total_operation_timeframe',
  'number_of_people_targeted',
  'district',
  'additional_allocation',
  'changing_budget',
];

const intermittentLoanValidationExceptions: (keyof DrefOperationalUpdateFields)[] = [
  'total_operation_timeframe',
  'number_of_people_targeted',
  'district',
  'additional_allocation',
];

function DrefOperationalUpdate(props: Props) {
  const { match } = props;
  const { id: opsUpdateId } = match.params;
  const alert = useAlert();
  const lastModifiedAtRef = React.useRef<string | undefined>();
  const [userOptions, setUserOptions] = React.useState<Option[]>([]);

  const transformApiFieldsToFormFields = React.useCallback((response: DrefOperationalUpdateApiFields) => {
    lastModifiedAtRef.current = response?.modified_at;
    setUserOptions(response.users_details?.map((user) => ({
      label: getDisplayName(user),
      value: user.id,
    })) ?? []);

    setFileIdToUrlMap((prevMap) => {
      const newMap = {
        ...prevMap,
      };
      if (response.budget_file_details) {
        newMap[response.budget_file_details.id] = response.budget_file_details.file;
      }
      if (response.assessment_report_details) {
        newMap[response.assessment_report_details.id] = response.assessment_report_details.file;
      }
      if (response.event_map_file && response.event_map_file.file) {
        newMap[response.event_map_file.id] = response.event_map_file.file;
      }
      if (response.cover_image_file && response.cover_image_file.file) {
        newMap[response.cover_image_file.id] = response.cover_image_file.file;
      }
      if (response.photos_file?.length > 0) {
        response.photos_file.forEach((img) => {
          newMap[img.id] = img.file;
        });
      }
      if (response.images_file?.length > 0) {
        response.images_file.forEach((img) => {
          newMap[img.id] = img.file;
        });
      }
      return newMap;
    });

    const opsUpdateValue = ({
      ...response,
      planned_interventions: response.planned_interventions?.map((pi) => ({
        ...pi,
        clientId: String(pi.id),
        indicators: pi?.indicators?.map((i) => ({
          ...i,
          clientId: String(i.id)
        })),
      })),
      national_society_actions: response.national_society_actions?.map((nsa) => ({
        ...nsa,
        clientId: String(nsa.id),
      })),
      needs_identified: response.needs_identified?.map((ni) => ({
        ...ni,
        clientId: String(ni.id),
      })),
      risk_security: response.risk_security?.map((rs) => ({
        ...rs,
        clientId: String(rs.id),
      })),
      images_file: response.images_file?.map((img) => (
        isDefined(img.file)
          ? ({
            id: img.id,
            client_id: img.client_id ?? String(img.id),
            caption: img.caption ?? '',
          })
          : undefined
      )).filter(isDefined),

      photos_file: response.photos_file?.map((img) => (
        isDefined(img.file)
          ? ({
            id: img.id,
            client_id: img.client_id ?? String(img.id),
            caption: img.caption ?? '',
          })
          : undefined
      )).filter(isDefined),
      disability_people_per: response.disability_people_per ? +response.disability_people_per : undefined,
      people_per_urban: response.people_per_urban ? +response.people_per_urban : undefined,
      people_per_local: response.people_per_local ? +response.people_per_local : undefined,
      is_assessment_report: response.is_assessment_report ?? false,
      changing_timeframe_operation: response.changing_timeframe_operation ?? false,
      changing_operation_strategy: response.changing_operation_strategy ?? false,
      changing_target_population_of_operation: response.changing_target_population_of_operation ?? false,
      changing_geographic_location: response.changing_geographic_location ?? false,
      changing_budget: response.changing_budget ?? false,
      request_for_second_allocation: response.request_for_second_allocation ?? false,
      has_forecasted_event_materialize: response.has_forecasted_event_materialize ?? false,
    });

    return opsUpdateValue;
  }, []);

  const {
    pending: operationalUpdatePending,
    response: drefOperationalResponse,
  } = useRequest<DrefOperationalUpdateApiFields>({
    skip: isNotDefined(opsUpdateId),
    url: `api/v2/dref-op-update/${opsUpdateId}/`,
    onSuccess: (response) => {
      const newOpsUpdateValue = transformApiFieldsToFormFields(response);
      setValue(newOpsUpdateValue);
    },
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.drefOperationalUpdateFailureMessage}
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
    }
  });

  const {
    pending: fetchingDref,
    response: drefFields,
  } = useRequest<DrefApiFields>({
    skip: isNotDefined(drefOperationalResponse?.dref),
    url: `api/v2/dref/${drefOperationalResponse?.dref}`,
  });

  const prevOperationalUpdateId = React.useMemo(() => {
    const currentOpsUpdate = drefFields?.operational_update_details?.find(ou => !ou.is_published);
    if (!currentOpsUpdate) {
      return undefined;
    }

    const prevOpsUpdateNumber = currentOpsUpdate.operational_update_number - 1;
    const prevOpsUpdate = drefFields?.operational_update_details?.find(ou => ou.operational_update_number === prevOpsUpdateNumber);

    return prevOpsUpdate?.id;
  }, [drefFields]);

  const {
    pending: fetchingPrevOperationalUpdate,
    response: prevOperationalUpdate,
  } = useRequest<DrefOperationalUpdateApiFields>({
    skip: isNotDefined(prevOperationalUpdateId),
    url: `api/v2/dref-op-update/${prevOperationalUpdateId}/`,
  });

  const {
    value,
    error,
    setFieldValue: onValueChange,
    validate,
    setValue,
    setError,
  } = useForm(
    schema,
    { value: defaultFormValues },
  );

  const {
    countryOptions,
    disasterCategoryOptions,
    disasterTypeOptions,
    fetchingCountries,
    fetchingDisasterTypes,
    fetchingDrefOptions,
    fetchingUserDetails,
    interventionOptions,
    nationalSocietyOptions,
    needOptions,
    nsActionOptions,
    onsetOptions,
    yesNoOptions,
    userDetails,
    drefTypeOptions,
  } = useDrefOperationalFormOptions();

  const [fileIdToUrlMap, setFileIdToUrlMap] = React.useState<Record<number, string>>({});
  const { strings } = React.useContext(languageContext);
  const [currentStep, setCurrentStep] = React.useState<StepTypes>('operationOverview');
  const submitButtonLabel = currentStep === 'submission' ? strings.drefFormSaveButtonLabel : strings.drefFormContinueButtonLabel;
  const shouldDisabledBackButton = currentStep === 'operationOverview';
  const { current: currentLanguage } = useReduxState('lang');

  const languageMismatch = checkLanguageMismatch(
    opsUpdateId,
    drefOperationalResponse?.translation_module_original_language,
    currentLanguage,
  );

  const [
    showObsoletePayloadResolutionModal,
    setShowObsoletePayloadResolutionModal,
  ] = React.useState(false);

  const erroredTabs = React.useMemo(() => {
    const safeErrors = getErrorObject(error) ?? {};

    const tabs: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      [key in StepTypes]: boolean;
    } = {
      operationOverview: false,
      eventDetails: false,
      needs: false,
      operation: false,
      submission: false,
    };

    return mapToMap(
      tabs,
      (key) => key,
      (_, tabKey) => {
        const currentFields = stepTypesToFieldsMap[tabKey as StepTypes];
        const currentFieldsMap = listToMap(
          currentFields,
          d => d,
          () => true,
        );

        const partialErrors: typeof error = mapToMap(
          safeErrors,
          (key) => key,
          (value, key) => currentFieldsMap[key as keyof DrefOperationalUpdateFields] ? value : undefined,
        );

        return analyzeErrors(partialErrors);
      }
    );
  }, [error]);

  const validateCurrentTab = React.useCallback((exceptions: (keyof DrefOperationalUpdateFields)[] = []) => {
    const validationError = getErrorObject(accumulateErrors(value, schema, value, undefined));
    const currentFields = stepTypesToFieldsMap[currentStep];
    const exceptionsMap = listToMap(exceptions, d => d, () => true);

    if (!validationError) {
      return true;
    }

    const currentTabErrors = listToMap(
      currentFields.filter(field => (!exceptionsMap[field] && !!validationError?.[field])),
      field => field,
      field => validationError?.[field]
    ) as ObjectError<DrefOperationalUpdateFields>;

    /*FIXME:
    const newError: typeof error = {
    ...currentTabErrors,
    };

    setError(newError);
    */
    setError(validationError);

    const hasError = Object.keys(currentTabErrors).some(d => !!d);
    return !hasError;
  }, [
    value,
    currentStep,
    setError,
  ]);

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    scrollToTop();
    const isCurrentTabValid = validateCurrentTab(intermittentValidationExceptions);

    if (!isCurrentTabValid) {
      return;
    }
    setCurrentStep(newStep);
  }, [validateCurrentTab]);

  const {
    pending: drefSubmitPending,
    trigger: submitRequest,
  } = useLazyRequest<DrefOperationalUpdateApiFields, Partial<DrefOperationalUpdateApiFields>>({
    url: `api/v2/dref-op-update/${opsUpdateId}`,
    method: 'PUT',
    body: ctx => ctx,
    useCurrentLanguage: true,
    onSuccess: (response) => {
      alert.show(
        strings.drefOperationalUpdateSuccessMessage,
        { variant: 'success' },
      );
      //NOTE: we need to refetch if not it gives error modified_at:"OBSOLETE_PAYLOAD"
      const newOpsUpdateValue = transformApiFieldsToFormFields(response);
      setValue(newOpsUpdateValue);
    },
    onFailure: ({
      value: responseError,
      debugMessage,
    }) => {
      const {
        messageForNotification,
        formErrors,
      } = responseError;

      setError(formErrors);
      if (formErrors.modified_at === 'OBSOLETE_PAYLOAD') {
        // There was a save conflict due to obsolete payload
        setShowObsoletePayloadResolutionModal(true);
      }

      alert.show(
        <p>
          {strings.drefFormSaveRequestFailureMessage}
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

  const handleLoanBackButtonClick = React.useCallback(() => {
    if (currentStep !== 'operationOverview') {
      const prevStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'operationOverview'>]: Exclude<StepTypes, 'submission'>;
      } = {
        eventDetails: 'operationOverview',
        submission: 'eventDetails',
        operation: 'needs',
        needs: 'operation',
      };
      handleTabChange(prevStepMap[currentStep]);
    }
  }, [handleTabChange, currentStep]);

  const handleBackButtonClick = React.useCallback(() => {
    if (currentStep !== 'operationOverview') {
      const prevStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'operationOverview'>]: Exclude<StepTypes, 'submission'>;
      } = {
        eventDetails: 'operationOverview',
        needs: 'eventDetails',
        operation: 'needs',
        submission: 'operation',
      };
      handleTabChange(prevStepMap[currentStep]);
    }
  }, [handleTabChange, currentStep]);

  const submitDrefOperationalUpdate = React.useCallback((modifiedAt?: string) => {
    const result = validate();

    if (result.errored) {
      setError(result.error);
    } else if (result.value && userDetails && userDetails.id) {
      const body = {
        user: userDetails.id,
        ...result.value,
        modified_at: modifiedAt ?? lastModifiedAtRef.current,
      };

      submitRequest(body as DrefOperationalUpdateApiFields);
    }
  }, [submitRequest, setError, validate, userDetails]);

  const handleSubmitButtonClick = React.useCallback(() => {
    scrollToTop();
    const isCurrentTabValid = validateCurrentTab(intermittentValidationExceptions);
    if (!isCurrentTabValid) {
      return;
    }

    if (currentStep === 'submission') {
      submitDrefOperationalUpdate();
    } else {
      const nextStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'submission'>]: Exclude<StepTypes, 'operationOverview'>;
      } = {
        operationOverview: 'eventDetails',
        eventDetails: 'needs',
        needs: 'operation',
        operation: 'submission',
      };

      handleTabChange(nextStepMap[currentStep]);
    }
  }, [validateCurrentTab, currentStep, handleTabChange, submitDrefOperationalUpdate]);

  const handleLoanSubmitButtonClick = React.useCallback(() => {
    scrollToTop();
    const isCurrentTabValid = validateCurrentTab(intermittentLoanValidationExceptions);
    if (!isCurrentTabValid) {
      return;
    }

    if (currentStep === 'submission') {
      submitDrefOperationalUpdate();
    } else {
      const nextStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'submission'>]: Exclude<StepTypes, 'operationOverview'>;
      } = {
        operationOverview: 'eventDetails',
        eventDetails: 'submission',
        needs: 'operation',
        operation: 'needs',
      };

      handleTabChange(nextStepMap[currentStep]);
    }
  }, [validateCurrentTab, currentStep, handleTabChange, submitDrefOperationalUpdate]);

  React.useEffect(() => {
    if (isDefined(value.new_operational_start_date) && isDefined(value.total_operation_timeframe)) {
      const approvalDate = new Date(value.new_operational_start_date);
      if (!Number.isNaN(approvalDate.getTime())) {
        approvalDate.setMonth(
          approvalDate.getMonth()
          + value.total_operation_timeframe
          + 1 // To get last day of the month
        );
        approvalDate.setDate(0);

        const yyyy = approvalDate.getFullYear();
        const mm = approvalDate.getMonth();
        const dd = approvalDate.getDate();
        onValueChange(ymdToDateString(yyyy, mm, dd), 'new_operational_end_date' as const);
      }
    }
  }, [
    onValueChange,
    value.new_operational_start_date,
    value.total_operation_timeframe,
    value.new_operational_end_date,
  ]);

  const pending = fetchingCountries
    || fetchingDisasterTypes
    || fetchingDrefOptions
    || fetchingUserDetails
    || fetchingDref
    || fetchingPrevOperationalUpdate
    || operationalUpdatePending
    || drefSubmitPending;

  const failedToLoadDref = !pending && isDefined(opsUpdateId) && !drefOperationalResponse;

  const exportLinkProps = useButtonFeatures({
    variant: 'secondary',
    children: strings.drefFormExportLabel,
  });

  const drefType = value.type_of_dref;
  const onsetType = value.type_of_onset;

  const handleObsoletePayloadResolutionOverwiteButtonClick = React.useCallback((newModifiedAt: string | undefined) => {
    setShowObsoletePayloadResolutionModal(false);
    submitDrefOperationalUpdate(newModifiedAt);
  }, [submitDrefOperationalUpdate]);

  const handleObsoletePayloadResolutionCancelButtonClick = React.useCallback(() => {
    setShowObsoletePayloadResolutionModal(false);
  }, []);

  const operationTimeframeWarning = React.useMemo(
    () => {
      if (value.type_of_dref === TYPE_LOAN) {
        return undefined;
      }

      const currentValue = value.total_operation_timeframe;
      const prevValue = prevOperationalUpdate?.total_operation_timeframe ?? drefFields?.operation_timeframe;

      if (value.changing_timeframe_operation && currentValue === prevValue) {
        return 'Please select a different timeframe when selected yes on changing the operation timeframe';
      }

      if (value.total_operation_timeframe !== prevValue && !value.changing_timeframe_operation) {
        return 'Please select yes on changing the operation timeframe';
      }

      return undefined;
    },
    [
      value.total_operation_timeframe,
      value.changing_timeframe_operation,
      value.type_of_dref,
      drefFields,
      prevOperationalUpdate,
    ],
  );

  const budgetWarning = React.useMemo(
    () => {
      if (isDefined(value.additional_allocation) && value.additional_allocation > 0) {
        if (!value.changing_budget || !value.request_for_second_allocation) {
          return 'When requesting for additional budget allocation, the fields "Are you making changes to the budget" and "Is this a request for a second allocation" both should be marked "Yes" in "Event Details" section';
        }
      } else if (value.changing_budget || value.request_for_second_allocation) {
        return 'The field "Additional Allocation Requested" should be filled in "Operation Overview" section to change the budget or for a second allocation';
      }

      return undefined;
    },
    [
      value.request_for_second_allocation,
      value.changing_budget,
      value.additional_allocation,
    ],
  );

  const geoWarning = React.useMemo(
    () => {
      const prevValue = prevOperationalUpdate?.district ?? drefFields?.district;
      const currentValue = value.district;
      const areDistrictsSimilar = isSimilarArray(currentValue, prevValue);

      if (value.changing_geographic_location && areDistrictsSimilar) {
        return 'Please select a different district when selected yes on changing geographic location';
      }

      if (!value.changing_geographic_location && !areDistrictsSimilar) {
        return 'Please select yes on changing geographic location';
      }

      return undefined;
    },
    [
      value.district,
      value.changing_geographic_location,
      prevOperationalUpdate,
      drefFields
    ],
  );

  const peopleTargetedWarning = React.useMemo(
    () => {
      const prevValue = prevOperationalUpdate?.total_targeted_population ?? drefFields?.total_targeted_population;
      const currentValue = value.total_targeted_population;

      if (value.changing_target_population_of_operation && currentValue === prevValue) {
        return 'Please select a different value for targeted population when selected yes on changing target population';
      }

      if (!value.changing_target_population_of_operation && currentValue !== prevValue) {
        return 'Please select yes on changing target population';
      }

      return undefined;
    },
    [
      value.total_targeted_population,
      value.changing_target_population_of_operation,
      prevOperationalUpdate,
      drefFields,
    ],
  );

  return (
    <Tabs
      disabled={false}
      onChange={handleTabChange}
      value={currentStep}
      variant='step'
    >
      <Page
        actions={(
          <>
            {isDefined(opsUpdateId) && drefType !== TYPE_LOAN && (
              <Link
                to={`/dref-operational-update/${opsUpdateId}/export/`}
                {...exportLinkProps}
              />
            )}
            <Button
              name={undefined}
              onClick={submitDrefOperationalUpdate}
              type='submit'
              disabled={pending}
            >
              {strings.drefOperationalUpdateSaveButtonLabel}
            </Button>
          </>
        )}
        title={strings.drefOperationalUpdatePageTitle}
        heading={strings.drefOperationalUpdatePageHeading}
        info={(
          <TabList>
            <Tab
              name='operationOverview'
              step={1}
              errored={erroredTabs['operationOverview']}
            >
              {strings.drefOperationalUpdateOverviewLabel}
            </Tab>
            <Tab
              name='eventDetails'
              step={2}
              errored={erroredTabs['eventDetails']}
            >
              {strings.drefOperationalUpdateEventDetailsLabel}
            </Tab>
            {drefType !== TYPE_LOAN &&
              <Tab
                name='needs'
                step={3}
                errored={erroredTabs['needs']}
              >
                {strings.drefOperationalUpdateNeedsLabel}
              </Tab>
            }
            {drefType !== TYPE_LOAN &&
              <Tab
                name='operation'
                step={4}
                errored={erroredTabs['operation']}
              >
                {strings.drefOperationalUpdateOperationLabel}
              </Tab>
            }
            <Tab
              name='submission'
              step={5}
              errored={erroredTabs['submission']}
            >
              {strings.drefOperationalUpdateSubmissionLabel}
            </Tab>
          </TabList>
        )}
      >
        {pending ? (
          <Container>
            <BlockLoading />
          </Container>
        ) : (
          failedToLoadDref ? (
            <Container
              contentClassName={styles.errorMessage}
            >
              <h3>
                {strings.drefOperationalUpdateFailureMessage}
              </h3>
              <p>
                {strings.drefFormLoadErrorDescription}
              </p>
            </Container>
          ) : (
            <>
              <Container>
                <NonFieldError
                  error={error}
                  message={strings.drefFormFieldGeneralError}
                />
                {operationTimeframeWarning && (
                  <div className={styles.warning}>{operationTimeframeWarning}</div>
                )}
                {budgetWarning && (
                  <div className={styles.warning}>{budgetWarning}</div>
                )}
                {geoWarning && (
                  <div className={styles.warning}>{geoWarning}</div>
                )}
                {peopleTargetedWarning && (
                  <div className={styles.warning}>{peopleTargetedWarning}</div>
                )}
              </Container>
              {languageMismatch && drefOperationalResponse && (
                <Container
                  contentClassName={styles.languageMismatch}
                >
                  <Translate
                    stringId="translationErrorEdit"
                    params={{ originalLanguage: <strong>{languageOptions[drefOperationalResponse.translation_module_original_language]}</strong> }}
                  />
                </Container>
              )}
              {!languageMismatch && (
                <>
                  <TabPanel name='operationOverview'>
                    <Overview
                      error={error}
                      onValueChange={onValueChange}
                      value={value}
                      yesNoOptions={yesNoOptions}
                      disasterTypeOptions={disasterTypeOptions}
                      onsetOptions={onsetOptions}
                      disasterCategoryOptions={disasterCategoryOptions}
                      countryOptions={countryOptions}
                      fetchingCountries={fetchingCountries}
                      fetchingDisasterTypes={fetchingDisasterTypes}
                      nationalSocietyOptions={nationalSocietyOptions}
                      fetchingNationalSociety={fetchingCountries}
                      fileIdToUrlMap={fileIdToUrlMap}
                      setFileIdToUrlMap={setFileIdToUrlMap}
                      onValueSet={setValue}
                      userOptions={userOptions}
                      onCreateAndShareButtonClick={submitDrefOperationalUpdate}
                      drefTypeOptions={drefTypeOptions}
                      drefType={drefType}
                      onsetType={onsetType}
                    />
                  </TabPanel>
                  <TabPanel name='eventDetails'>
                    <EventDetails
                      error={error}
                      onValueChange={onValueChange}
                      value={value}
                      yesNoOptions={yesNoOptions}
                      fileIdToUrlMap={fileIdToUrlMap}
                      setFileIdToUrlMap={setFileIdToUrlMap}
                      drefType={drefType}
                      onsetType={onsetType}
                    />
                  </TabPanel>
                  {drefType !== TYPE_LOAN &&
                    <TabPanel name='needs'>
                      <Needs
                        error={error}
                        onValueChange={onValueChange}
                        value={value}
                        yesNoOptions={yesNoOptions}
                        needOptions={needOptions}
                        nsActionOptions={nsActionOptions}
                        fileIdToUrlMap={fileIdToUrlMap}
                        setFileIdToUrlMap={setFileIdToUrlMap}
                        drefType={drefType}
                      />
                    </TabPanel>
                  }
                  {drefType !== TYPE_LOAN &&
                    <TabPanel name='operation'>
                      <Operation
                        interventionOptions={interventionOptions}
                        error={error}
                        onValueChange={onValueChange}
                        value={value}
                        fileIdToUrlMap={fileIdToUrlMap}
                        setFileIdToUrlMap={setFileIdToUrlMap}
                        drefType={drefType}
                        yesNoOptions={yesNoOptions}
                      />
                    </TabPanel>
                  }
                  <TabPanel name='submission'>
                    <Submission
                      error={error}
                      onValueChange={onValueChange}
                      value={value}
                      drefType={drefType}
                    />
                  </TabPanel>
                  {drefType !== TYPE_LOAN &&
                    <div className={styles.actions}>
                      <Button
                        name={undefined}
                        variant="secondary"
                        onClick={handleBackButtonClick}
                        disabled={shouldDisabledBackButton}
                      >
                        {strings.drefFormBackButtonLabel}
                      </Button>
                      <Button
                        name={undefined}
                        variant="secondary"
                        onClick={handleSubmitButtonClick}
                      >
                        {submitButtonLabel}
                      </Button>
                    </div>
                  }
                  {drefType === TYPE_LOAN &&
                    <div className={styles.actions}>
                      <Button
                        name={undefined}
                        variant="secondary"
                        onClick={handleLoanBackButtonClick}
                        disabled={shouldDisabledBackButton}
                      >
                        {strings.drefFormBackButtonLabel}
                      </Button>
                      <Button
                        name={undefined}
                        variant="secondary"
                        onClick={handleLoanSubmitButtonClick}
                      >
                        {submitButtonLabel}
                      </Button>
                    </div>
                  }
                  {isDefined(opsUpdateId) && showObsoletePayloadResolutionModal && (
                    <ObsoletePayloadResolutionModal
                      opsUpdateId={+opsUpdateId}
                      onOverwriteButtonClick={handleObsoletePayloadResolutionOverwiteButtonClick}
                      onCancelButtonClick={handleObsoletePayloadResolutionCancelButtonClick}
                    />
                  )}
                </>
              )}
            </>
          )
        )}
      </Page>
    </Tabs>
  );
}

export default DrefOperationalUpdate;

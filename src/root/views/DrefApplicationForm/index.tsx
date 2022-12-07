import React from 'react';
import type { History, Location } from 'history';
import { Link } from 'react-router-dom';
import {
  isDefined,
  listToMap,
  isNotDefined,
} from '@togglecorp/fujs';
import {
  PartialForm,
  useForm,
  accumulateErrors,
  getErrorObject,
  ObjectError,
} from '@togglecorp/toggle-form';
import type { match as Match } from 'react-router-dom';
import { IoCloudUploadSharp } from 'react-icons/io5';

import BlockLoading from '#components/block-loading';
import Button from '#components/Button';
import Container from '#components/Container';
import NonFieldError from '#components/NonFieldError';
import Page from '#components/Page';
import Tab from '#components/Tabs/Tab';
import TabList from '#components/Tabs/TabList';
import TabPanel from '#components/Tabs/TabPanel';
import FileInput from '#components/FileInput';
import Tabs from '#components/Tabs';
import { useButtonFeatures } from '#components/Button';
import {
  useLazyRequest,
  useRequest,
} from '#utils/restRequest';
import { ymdToDateString } from '#utils/common';
import LanguageContext from '#root/languageContext';
import useAlert from '#hooks/useAlert';
import scrollToTop from '#utils/scrollToTop';

import DrefOverview from './DrefOverview';
import EventDetails from './EventDetails';
import ActionsFields from './ActionsFields';
import Response from './Response';
import Submission from './Submission';
import ObsoletePayloadResolutionModal from './ObsoletePayloadResolutionModal';
import {
  DrefFields,
  DrefApiFields,
  overviewFields,
  eventDetailsFields,
  actionsFields,
  responseFields,
  submissionFields,
  ONSET_IMMINENT,
  ONSET_SUDDEN,
} from './common';

import useDrefFormOptions, { schema } from './useDrefFormOptions';
import {
  getImportData,
  transformImport,
} from './import';

import styles from './styles.module.scss';

const defaultFormValues: PartialForm<DrefFields> = {
  planned_interventions: [],
  national_society_actions: [],
  needs_identified: [],
  images_file: [],
  users: [],
  is_assessment_report: false,
};

export function getDefinedValues<T extends Record<string, any>>(o: T): Partial<T> {
  type Key = keyof T;
  const keys = Object.keys(o) as Key[];
  const definedValues: Partial<T> = {};
  keys.forEach((key) => {
    if (isDefined(o[key])) {
      definedValues[key] = o[key];
    }
  });

  return definedValues;
}

type StepTypes = 'operationOverview' | 'eventDetails' | 'action' | 'response' | 'submission';
const stepTypesToFieldsMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in StepTypes]: (keyof DrefFields)[];
} = {
  operationOverview: overviewFields,
  eventDetails: eventDetailsFields,
  action: actionsFields,
  response: responseFields,
  submission: submissionFields,
};

interface Props {
  className?: string;
  match: Match<{ drefId?: string }>;
  history: History;
  location: Location;
}

function DrefApplication(props: Props) {
  const {
    className,
    history,
    match,
  } = props;

  const alert = useAlert();
  const { drefId } = match.params;
  const { strings } = React.useContext(LanguageContext);
  const {
    value,
    error,
    setFieldValue,
    validate,
    setError,
    setValue,
  } = useForm(schema, { value: defaultFormValues });

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
    userOptions,
  } = useDrefFormOptions(value);

  const [fileIdToUrlMap, setFileIdToUrlMap] = React.useState<Record<number, string>>({});
  const [currentStep, setCurrentStep] = React.useState<StepTypes>('operationOverview');
  const submitButtonLabel = currentStep === 'submission' ? strings.drefFormSaveButtonLabel : strings.drefFormContinueButtonLabel;
  const shouldDisabledBackButton = currentStep === 'operationOverview';
  const [
    showObsoletePayloadResolutionModal,
    setShowObsoletePayloadResolutionModal,
  ] = React.useState(false);

  const lastModifiedAtRef = React.useRef<string | undefined>();

  const erroredTabs = React.useMemo(() => {
    const tabs: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      [key in StepTypes]: boolean;
    } = {
      operationOverview: false,
      eventDetails: false,
      action: false,
      response: false,
      submission: false,
    };

    const tabKeys = (Object.keys(tabs)) as StepTypes[];
    tabKeys.forEach((tabKey) => {
      const currentFields = stepTypesToFieldsMap[tabKey];
      const currentFieldsMap = listToMap(currentFields, d => d, d => true);

      const erroredFields = Object.keys(getErrorObject(error) ?? {}) as (keyof DrefFields)[];
      const hasError = erroredFields.some(d => currentFieldsMap[d]);
      tabs[tabKey] = hasError;
    });

    return tabs;
  }, [error]);

  const handleDrefLoad = React.useCallback((response: DrefApiFields) => {
    lastModifiedAtRef.current = response?.modified_at;

    setFileIdToUrlMap((prevMap) => {
      const newMap = {
        ...prevMap,
      };
      if (response.supporting_document_details && response.supporting_document_details) {
        newMap[response.supporting_document_details.id] = response.supporting_document_details.file;
      }
      if (response.assessment_report_details && response.assessment_report_details) {
        newMap[response.assessment_report_details.id] = response.assessment_report_details.file;
      }
      if (response.event_map_file && response.event_map_file.file) {
        newMap[response.event_map_file.id] = response.event_map_file.file;
      }
      if (response.cover_image_file && response.cover_image_file.file) {
        newMap[response.cover_image_file.id] = response.cover_image_file.file;
      }
      if (response.images_file?.length > 0) {
        response.images_file.forEach((img) => {
          newMap[img.id] = img.file;
        });
      }
      return newMap;
    });

    const getNumberFromResponse = (value: number | string | undefined | null) => {
      if (isNotDefined(value)) {
        return undefined;
      }

      if (value === '') {
        return undefined;
      }

      return +value;
    };

    setValue({
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
      images_file: response.images_file?.map((img) => (
        isDefined(img.file)
          ? ({
            id: img.id,
            client_id: img.client_id ?? String(img.id),
            caption: img.caption ?? '',
          })
          : undefined
      )).filter(isDefined),
      disability_people_per: getNumberFromResponse(response.disability_people_per),
      people_per_urban: getNumberFromResponse(response.people_per_urban),
      people_per_local: getNumberFromResponse(response.people_per_local),
      cover_image_file: isDefined(response.cover_image_file?.file) ? response.cover_image_file : undefined,
      event_map_file: isDefined(response.event_map_file?.file) ? response.event_map_file : undefined,
    });
  }, [setValue]);


  const {
    pending: drefSubmitPending,
    trigger: submitRequest,
  } = useLazyRequest<DrefApiFields, Partial<DrefApiFields>>({
    url: drefId ? `api/v2/dref/${drefId}/` : 'api/v2/dref/',
    method: drefId ? 'PUT' : 'POST',
    body: ctx => ctx,
    onSuccess: (response) => {
      alert.show(
        strings.drefFormSaveRequestSuccessMessage,
        { variant: 'success' },
      );

      if (!drefId) {
        window.setTimeout(
          () => history.push(`/dref-application/${response?.id}/edit/`),
          250,
        );
      } else {
        handleDrefLoad(response);
      }
    },
    onFailure: ({
      value: {
        messageForNotification,
        formErrors,
      },
      debugMessage,
    }) => {
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

  const {
    pending: drefApplicationPending,
    response: drefResponse,
  } = useRequest<DrefApiFields>({
    skip: !drefId,
    url: `api/v2/dref/${drefId}/`,
    onSuccess: (response) => {
      handleDrefLoad(response);
    },
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.drefFormLoadRequestFailureMessage}
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

  const validateCurrentTab = React.useCallback((exceptions: (keyof DrefFields)[] = []) => {
    const validationError = getErrorObject(accumulateErrors(value, schema, value, undefined));
    const currentFields = stepTypesToFieldsMap[currentStep];
    const exceptionsMap = listToMap(exceptions, d => d, d => true);

    if (!validationError) {
      return true;
    }

    const currentTabErrors = listToMap(
      currentFields.filter(field => (!exceptionsMap[field] && !!validationError?.[field])),
      field => field,
      field => validationError?.[field]
    ) as ObjectError<DrefFields>;

    const newError: typeof error = {
      ...currentTabErrors,
    };

    setError(newError);

    const hasError = Object.keys(currentTabErrors).some(d => !!d);
    return !hasError;
  }, [value, currentStep, setError]);

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    scrollToTop();
    const isCurrentTabValid = validateCurrentTab(['event_map_file']);

    if (!isCurrentTabValid) {
      return;
    }

    setCurrentStep(newStep);
  }, [validateCurrentTab]);

  const submitDref = React.useCallback((modifiedAt?: string) => {
    const result = validate();

    if (result.errored) {
      setError(result.error);
    } else if (result.value && userDetails && userDetails.id) {

      const body = {
        user: userDetails.id,
        ...result.value,
        modified_at: modifiedAt ?? lastModifiedAtRef.current,
      };

      submitRequest(body as DrefApiFields);
    }
  }, [submitRequest, validate, userDetails, setError]);

  const handleSubmitButtonClick = React.useCallback(() => {
    scrollToTop();

    const isCurrentTabValid = validateCurrentTab(['event_map_file']);

    if (!isCurrentTabValid) {
      return;
    }

    if (currentStep === 'submission') {
      submitDref();
    } else {
      const nextStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'submission'>]: Exclude<StepTypes, 'operationOverview'>;
      } = {
        operationOverview: 'eventDetails',
        eventDetails: 'action',
        action: 'response',
        response: 'submission',
      };

      handleTabChange(nextStepMap[currentStep]);
    }
  }, [validateCurrentTab, currentStep, handleTabChange, submitDref]);

  const handleBackButtonClick = React.useCallback(() => {
    if (currentStep !== 'operationOverview') {
      const prevStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'operationOverview'>]: Exclude<StepTypes, 'submission'>;
      } = {
        eventDetails: 'operationOverview',
        action: 'eventDetails',
        response: 'action',
        submission: 'response',
      };

      handleTabChange(prevStepMap[currentStep]);
    }
  }, [handleTabChange, currentStep]);

  const pending = fetchingCountries
    || fetchingDisasterTypes
    || fetchingDrefOptions
    || fetchingUserDetails
    || drefSubmitPending
    || drefApplicationPending;

  const isSuddenOnset = value?.type_of_onset === ONSET_SUDDEN;
  const isImminentOnset = value?.type_of_onset === ONSET_IMMINENT;
  const isAssessmentReport = !!value?.is_assessment_report;

  React.useEffect(() => {
    setValue((oldValue) => {
      if (value.type_of_onset !== ONSET_IMMINENT) {
        return {
          ...oldValue,
          anticipatory_actions: undefined,
          people_targeted_with_early_actions: undefined,
        };
      }
      if (value.type_of_onset === ONSET_IMMINENT) {
        return {
          ...oldValue,
          event_date: undefined,
        };
      }
      return oldValue;
    });
  }, [
    setValue,
    value.type_of_onset,
  ]);

  React.useEffect(() => {
    setValue((oldValue) => {
      if (value.ns_request_fund === false ||
        value.ns_respond === false ||
        value.affect_same_population === false ||
        value.affect_same_area === false) {
        return {
          ...oldValue,
          dref_recurrent_text: undefined,
        };
      }
      return oldValue;
    });
  }, [
    setValue,
    value.ns_request_fund,
    value.ns_respond,
    value.affect_same_population,
    value.affect_same_area,
  ]);

  React.useEffect(() => {
    if (isDefined(value.date_of_approval) && isDefined(value.operation_timeframe)) {
      const approvalDate = new Date(value.date_of_approval);
      if (!Number.isNaN(approvalDate.getTime())) {
        approvalDate.setMonth(
          approvalDate.getMonth()
          + value.operation_timeframe
          + 1 // To get last day of the month
        );
        approvalDate.setDate(0);

        const yyyy = approvalDate.getFullYear();
        const mm = approvalDate.getMonth();
        const dd = approvalDate.getDate();
        setFieldValue(ymdToDateString(yyyy, mm, dd), 'end_date' as const);
      }
    }
    setFieldValue(value?.num_assisted, 'total_targeted_population');
  }, [
    setFieldValue,
    value.date_of_approval,
    value.operation_timeframe,
    value.num_assisted,
  ]);

  const exportLinkProps = useButtonFeatures({
    variant: 'secondary',
    children: strings.drefFormExportLabel,
  });

  const failedToLoadDref = !pending && isDefined(drefId) && !drefResponse;

  const handleDocumentImport = React.useCallback(async (newValue: File | undefined) => {
    if (!newValue) {
      return;
    }

    const importData = await getImportData(newValue);
    // FIXME: Check if component is still mounted

    if (importData) {
      const safeImportData = transformImport(
        importData,
        countryOptions,
        disasterCategoryOptions,
        disasterTypeOptions,
        onsetOptions,
      );
      setValue(
        (prevValue) => ({
          ...prevValue,
          ...safeImportData,
        }),
      );
    }
  }, [
    countryOptions,
    disasterTypeOptions,
    disasterCategoryOptions,
    onsetOptions,
    setValue,
  ]);

  const handleObsoletePayloadResolutionOverwiteButtonClick = React.useCallback((newModifiedAt: string | undefined) => {
    setShowObsoletePayloadResolutionModal(false);
    submitDref(newModifiedAt);
  }, [submitDref]);

  const handleObsoletePayloadResolutionCancelButtonClick = React.useCallback(() => {
    setShowObsoletePayloadResolutionModal(false);
  }, []);

  return (
    <Tabs
      disabled={failedToLoadDref}
      onChange={handleTabChange}
      value={currentStep}
      variant="step"
    >
      <Page
        className={className}
        actions={(
          <>
            {isNotDefined(drefId) && (
              <FileInput
                type='file'
                accept='.docx'
                name="dref-docx-import"
                value={undefined}
                onChange={handleDocumentImport}
                icons={<IoCloudUploadSharp />}
                variant="secondary"
              >
                Import from Document
              </FileInput>
            )}
            {isDefined(drefId) && (
              <Link
                to={`/dref-application/${drefId}/export/`}
                {...exportLinkProps}
              />
            )}
            <Button
              name={undefined}
              onClick={submitDref}
            >
              {strings.drefFormSaveButtonLabel}
            </Button>
          </>
        )}
        title={strings.drefFormPageTitle}
        heading={strings.drefFormPageHeading}
        info={(
          <TabList className={styles.tabList}>
            <Tab
              name="operationOverview"
              step={1}
              errored={erroredTabs['operationOverview']}
            >
              {strings.drefFormTabOperationOverviewLabel}
            </Tab>
            <Tab
              name="eventDetails"
              step={2}
              errored={erroredTabs['eventDetails']}
            >
              {strings.drefFormTabEventDetailLabel}
            </Tab>
            <Tab
              name="action"
              step={3}
              errored={erroredTabs['action']}
            >
              {strings.drefFormTabActionsLabel}
            </Tab>
            <Tab
              name="response"
              step={4}
              errored={erroredTabs['response']}
            >
              {strings.drefFormTabResponseLabel}
            </Tab>
            <Tab
              name="submission"
              step={5}
              errored={erroredTabs['submission']}
            >
              {strings.drefFormTabSubmissionLabel}
            </Tab>
          </TabList>
        )}
      >
        {
          pending &&
          <Container>
            <BlockLoading />
          </Container>
        }
        {
          failedToLoadDref &&
          <Container
            contentClassName={styles.errorMessage}
          >
            <h3>
              {strings.drefFormLoadErrorTitle}
            </h3>
            <p>
              {strings.drefFormLoadErrorDescription}
            </p>
            <p>
              {strings.drefFormLoadErrorHelpText}
            </p>
          </Container>
        }
        {!pending && !failedToLoadDref && (
          <>
            <Container>
              <NonFieldError
                error={error}
                message={strings.drefFormFieldGeneralError}
              />
            </Container>
            <TabPanel name="operationOverview">
              <DrefOverview
                error={error}
                onValueChange={setFieldValue}
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
                onCreateAndShareButtonClick={submitDref}
              />
            </TabPanel>
            <TabPanel name="eventDetails">
              <EventDetails
                isSuddenOnset={isSuddenOnset}
                isImminentOnset={isImminentOnset}
                error={error}
                onValueChange={setFieldValue}
                value={value}
                yesNoOptions={yesNoOptions}
                fileIdToUrlMap={fileIdToUrlMap}
                setFileIdToUrlMap={setFileIdToUrlMap}
                isAssessmentReport={isAssessmentReport}
              />
            </TabPanel>
            <TabPanel name="action">
              <ActionsFields
                error={error}
                onValueChange={setFieldValue}
                value={value}
                yesNoOptions={yesNoOptions}
                needOptions={needOptions}
                nsActionOptions={nsActionOptions}
                fileIdToUrlMap={fileIdToUrlMap}
                setFileIdToUrlMap={setFileIdToUrlMap}
                isAssessmentReport={isAssessmentReport}
                isImminentOnset={isImminentOnset}
              />
            </TabPanel>
            <TabPanel name="response">
              <Response
                interventionOptions={interventionOptions}
                error={error}
                onValueChange={setFieldValue}
                value={value}
                fileIdToUrlMap={fileIdToUrlMap}
                setFileIdToUrlMap={setFileIdToUrlMap}
                yesNoOptions={yesNoOptions}
                isAssessmentReport={isAssessmentReport}
                isImminentOnset={isImminentOnset}
              />
            </TabPanel>
            <TabPanel name="submission">
              <Submission
                error={error}
                onValueChange={setFieldValue}
                value={value}
              />
            </TabPanel>
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
            {isDefined(drefId) && showObsoletePayloadResolutionModal && (
              <ObsoletePayloadResolutionModal
                drefId={+drefId}
                onOverwriteButtonClick={handleObsoletePayloadResolutionOverwiteButtonClick}
                onCancelButtonClick={handleObsoletePayloadResolutionCancelButtonClick}
              />
            )}
          </>
        )}
      </Page>
    </Tabs>
  );
}

export default DrefApplication;

import React, {
  useCallback,
  useMemo,
  useContext,
  useState,
} from 'react';
import { Link, match } from 'react-router-dom';
import {
  History,
  Location,
} from 'history';
import {
  isDefined,
  listToMap,
  mapToMap,
} from '@togglecorp/fujs';
import {
  analyzeErrors,
  getErrorObject,
  ObjectError,
  PartialForm,
  useForm,
  accumulateErrors,
  internal,
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

import {
  DrefFinalReportFields,
  eventFields,
  needsFields,
  overviewFields,
  operationFields,
  submissionFields,
  DrefFinalReportApiFields,
} from './common';
import Overview from './Overview';
import EventDetails from './EventDetails';
import Needs from './Needs';
import Operation from './Operation';
import Submission from './Submission';
import useDrefFinalReportFormOptions,{
  schema,
} from './useDreFinalReportOptions';
import { ymdToDateString } from '#utils/common';

import styles from './styles.module.scss';

interface Props {
  match: match<{ id?: string }>;
  history: History;
  location: Location;
}

type StepTypes = 'operationOverview' | 'eventDetails' | 'needs' | 'operation' | 'submission';

const stepTypesToFieldsMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in StepTypes]: (keyof DrefFinalReportFields)[];
} = {
  operationOverview: overviewFields,
  eventDetails: eventFields,
  needs: needsFields,
  operation: operationFields,
  submission: submissionFields,
};

const defaultFormValues: PartialForm<DrefFinalReportFields> = {
  planned_interventions: [],
  national_society_actions: [],
  needs_identified: [],
  images_file: [],
  users: [],
  has_national_society_conducted: false,
};

function FinalReport(props: Props) {
  const {
    match,
  } = props;
  const { id } = match.params;
  const alert = useAlert();
  const {
    value,
    error,
    setFieldValue: onValueChange,
    validate,
    setValue,
    setError,
  } = useForm(
    schema,
    { value: defaultFormValues }
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
    onsetOptions,
    yesNoOptions,
    userDetails,
    drefTypeOptions,
    nsActionOptions,
  } = useDrefFinalReportFormOptions(value);

  const [fileIdToUrlMap, setFileIdToUrlMap] = useState<Record<number, string>>({});
  const [userOptions, setUserOptions] = React.useState<Option[]>([]);
  const { strings } = useContext(languageContext);
  const [currentStep, setCurrentStep] = useState<StepTypes>('operationOverview');
  const submitButtonLabel = currentStep === 'submission' ? strings.drefFormSaveButtonLabel : strings.drefFormContinueButtonLabel;
  const shouldDisabledBackButton = currentStep === 'operationOverview';
  const lastModifiedAtRef = React.useRef<string | undefined>();

  const erroredTabs = useMemo(() => {
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
          (value, key) => currentFieldsMap[key as keyof DrefFinalReportFields] ? value : undefined,
        );

        return analyzeErrors(partialErrors);
      }
    );
  }, [error]);

  const validateCurrentTab = useCallback((exceptions: (keyof DrefFinalReportFields)[] = []) => {
    const validationError = getErrorObject(accumulateErrors(value, schema, value, undefined));
    const currentFields = stepTypesToFieldsMap[currentStep];
    const exceptionsMap = listToMap(
      exceptions,
      d => d,
      () => true
    );

    if (!validationError) {
      return true;
    }

    const currentTabErrors = listToMap(
      currentFields.filter(field => (!exceptionsMap[field] && !!validationError?.[field])),
      field => field,
      field => validationError?.[field]
    ) as ObjectError<DrefFinalReportFields>;

    const newError: typeof error = {
      ...currentTabErrors,
    };

    setError(newError);

    const hasError = Object.keys(currentTabErrors).some(d => !!d);
    return !hasError;
  }, [value, currentStep, setError]);

  const handleTabChange = useCallback((newStep: StepTypes) => {
    scrollToTop();
    setCurrentStep(newStep);
  }, []);

  const handleFinalReportLoad = React.useCallback(
    (response: DrefFinalReportApiFields) => {
      lastModifiedAtRef.current = response?.modified_at;
      setUserOptions(response.users_details?.map((user) => ({
        label: getDisplayName(user),
        value: user.id,
      })) ?? []);
      setFileIdToUrlMap((prevMap) => {
        const newMap = {
          ...prevMap,
        };
        if (response.financial_report_details && response.financial_report_details) {
          newMap[response.financial_report_details.id] = response.financial_report_details.file;
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
        if (response.photos_file?.length > 0) {
          response.photos_file.forEach((img) => {
            newMap[img.id] = img.file;
          });
        }
        return newMap;
      });
      setValue({
        ...response,
        national_society_actions: response.national_society_actions?.map((nsa) => ({
          ...nsa,
          clientId: String(nsa.id),
        })),
        planned_interventions: response.planned_interventions?.map((pi) => ({
          ...pi,
          clientId: String(pi.id),
          indicators: pi?.indicators?.map((i) => ({
            ...i,
            clientId: String(i.id)
          })),
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
      });
    },
    [setValue],
  );


  const {
    pending: drefFinalReportSubmitPending,
    trigger: submitRequest,
  } = useLazyRequest<DrefFinalReportApiFields, Partial<DrefFinalReportApiFields>>({
    url: `api/v2/dref-final-report/${id}`,
    method: 'PUT',
    body: ctx => ctx,
    onSuccess: (response) => {
      alert.show(
        'Final Report was updated successfully!',
        { variant: 'success' },
      );
      handleFinalReportLoad(response);
    },
    onFailure: ({
      value: {
        messageForNotification,
        formErrors,
      },
      debugMessage,
    }) => {
      setError({
        ...formErrors,
        [internal]: formErrors?.non_field_errors as string | undefined,
      });

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
    pending: finalReportPending,
    response: drefFinalReportResponse,
  } = useRequest<DrefFinalReportApiFields>({
    skip: !id,
    url: `api/v2/dref-final-report/${id}/`,
    onSuccess: (response) => {
      handleFinalReportLoad(response);
    },
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.finalReportFailureMessage}
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

  React.useEffect(() => {
    if (isDefined(value.operation_start_date) && isDefined(value.total_operation_timeframe)) {
      const operationEndDate = new Date(value.operation_start_date);
      if (!Number.isNaN(operationEndDate.getTime())) {
        operationEndDate.setMonth(
          operationEndDate.getMonth()
          + value.total_operation_timeframe
          + 1 // To get last day of the month
        );
        operationEndDate.setDate(0);

        const yyyy = operationEndDate.getFullYear();
        const dd = operationEndDate.getDate();
        const mm = operationEndDate.getMonth();
        onValueChange(ymdToDateString(yyyy, mm, dd), 'operation_end_date' as const);
      }
    }
  }, [
    onValueChange,
    value.operation_start_date,
    value.total_operation_timeframe,
  ]);

  const handleBackButtonClick = useCallback(() => {
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

  const submitDrefFinalReport = useCallback(() => {
    const result = validate();

    if (result.errored) {
      setError(result.error);
    } else if (result.value && userDetails && userDetails.id) {
      const body = {
        user: userDetails.id,
        ...result.value,
        modified_at: lastModifiedAtRef.current,
      };
      submitRequest(body as DrefFinalReportApiFields);
    }
  }, [submitRequest, setError, validate, userDetails]);

  const handleSubmitButtonClick = useCallback(() => {
    scrollToTop();
    const isCurrentTabValid = validateCurrentTab(['title']);
    if (!isCurrentTabValid) {
      return;
    }

    if (currentStep === 'submission') {
      submitDrefFinalReport();
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
  }, [validateCurrentTab, currentStep, handleTabChange, submitDrefFinalReport]);

  const pending = fetchingCountries
    || fetchingDisasterTypes
    || fetchingDrefOptions
    || fetchingUserDetails
    || finalReportPending
    || drefFinalReportSubmitPending;

  const failedToLoadDref = !pending && isDefined(id) && !drefFinalReportResponse;

  const exportLinkProps = useButtonFeatures({
    variant: 'secondary',
    children: strings.drefFormExportLabel,
  });

  const drefType = value?.type_of_dref;
  const onsetType = value?.type_of_onset;

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
            {isDefined(id) && (
              <Link
                to={`/dref-final-report/${id}/export/`}
                {...exportLinkProps}
              />
            )}
            <Button
              name={undefined}
              onClick={submitDrefFinalReport}
              type='submit'
            >
              {strings.drefFormSaveButtonLabel}
            </Button>
          </>
        )}
        title={strings.finalReportPageTitle}
        heading={strings.finalReportPageHeading}
        info={(
          <TabList>
            <Tab
              name='operationOverview'
              step={1}
              errored={erroredTabs['operationOverview']}
            >
              {strings.finalReportTabOperationOverview}
            </Tab>
            <Tab
              name='eventDetails'
              step={2}
              errored={erroredTabs['eventDetails']}
            >
              {strings.finalReportTabEventDetails}
            </Tab>
            <Tab
              name='needs'
              step={3}
              errored={erroredTabs['needs']}
            >
              {strings.finalReportTabNeeds}
            </Tab>
            <Tab
              name='operation'
              step={4}
              errored={erroredTabs['operation']}
            >
              {strings.finalReportTabOperationReport}
            </Tab>
            <Tab
              name='submission'
              step={5}
              errored={erroredTabs['submission']}
            >
              {strings.finalReportTabSubmission}
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
              {strings.finalReportFailureMessage}
            </h3>
            <p>
              {strings.drefFormLoadErrorDescription}
            </p>
            <p>
              {strings.finalReportErrorDescription}
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
            <TabPanel name='operationOverview'>
              <Overview
                error={error}
                onValueChange={onValueChange}
                value={value}
                disasterTypeOptions={disasterTypeOptions}
                onsetOptions={onsetOptions}
                disasterCategoryOptions={disasterCategoryOptions}
                countryOptions={countryOptions}
                fetchingCountries={fetchingCountries}
                fetchingDisasterTypes={fetchingDisasterTypes}
                nationalSocietyOptions={nationalSocietyOptions}
                fetchingNationalSociety={fetchingCountries}
                yesNoOptions={yesNoOptions}
                userOptions={userOptions}
                onCreateAndShareButtonClick={submitDrefFinalReport}
                fileIdToUrlMap={fileIdToUrlMap}
                setFileIdToUrlMap={setFileIdToUrlMap}
                drefTypeOptions={drefTypeOptions}
                drefType={drefType}
              />
            </TabPanel>
            <TabPanel name='eventDetails'>
              <EventDetails
                error={error}
                onValueChange={onValueChange}
                value={value}
                drefType={drefType}
                fileIdToUrlMap={fileIdToUrlMap}
                setFileIdToUrlMap={setFileIdToUrlMap}
                onsetType={onsetType}
              />
            </TabPanel>
            <TabPanel name='needs'>
              <Needs
                error={error}
                onValueChange={onValueChange}
                value={value}
                yesNoOptions={yesNoOptions}
                needOptions={needOptions}
                nsActionOptions={nsActionOptions}
              />
            </TabPanel>
            <TabPanel name='operation'>
              <Operation
                interventionOptions={interventionOptions}
                error={error}
                onValueChange={onValueChange}
                value={value}
                fileIdToUrlMap={fileIdToUrlMap}
                setFileIdToUrlMap={setFileIdToUrlMap}
                yesNoOptions={yesNoOptions}
                drefType={drefType}
              />
            </TabPanel>
            <TabPanel name='submission'>
              <Submission
                error={error}
                onValueChange={onValueChange}
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
          </>
        )}
      </Page>
    </Tabs>
  );
}

export default FinalReport;

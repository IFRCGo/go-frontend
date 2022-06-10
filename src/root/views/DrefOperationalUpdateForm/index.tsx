import React from 'react';
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
import useAlert from '#hooks/useAlert';
import {
  useLazyRequest,
  useRequest,
} from '#utils/restRequest';

import {
  DrefOperationalUpdateFields,
  eventFields,
  needsFields,
  overviewFields,
  operationFields,
  submissionFields,
  DrefOperationalUpdateApiFields,
  ONSET_IMMINENT,
} from './common';
import useDrefOperationalFormOptions, {
  schema
} from './useDrefOperationalUpdateOptions';
import Overview from './Overview';
import EventDetails from './EventDetails';
import Needs from './Needs';
import Operation from './Operation';
import Submission from './Submission';

import styles from './styles.module.scss';

function scrollToTop() {
  window.setTimeout(() => {
    window.scrollTo({
      top: Math.min(145, window.scrollY),
      left: 0,
      behavior: 'smooth',
    });
  }, 0);
}

interface Props {
  match: match<{ id?: string }>;
  history: History;
  location: Location;
}
interface DrefOperationalResponseFields {
  id: string;
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
  images: []
};

function DrefOperationalUpdate(props: Props) {
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
    nsActionOptions,
    onsetOptions,
    yesNoOptions,
    userDetails,
    userOptions,
  } = useDrefOperationalFormOptions(value);

  const [fileIdToUrlMap, setFileIdToUrlMap] = React.useState<Record<number, string>>({});
  const { strings } = React.useContext(languageContext);
  const [currentStep, setCurrentStep] = React.useState<StepTypes>('operationOverview');
  const submitButtonLabel = currentStep === 'submission' ? strings.drefFormSaveButtonLabel : strings.drefFormContinueButtonLabel;
  const shouldDisabledBackButton = currentStep === 'operationOverview';

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
          d => true,
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
    const exceptionsMap = listToMap(exceptions, d => d, d => true);

    if (!validationError) {
      return true;
    }

    const currentTabErrors = listToMap(
      currentFields.filter(field => (!exceptionsMap[field] && !!validationError?.[field])),
      field => field,
      field => validationError?.[field]
    ) as ObjectError<DrefOperationalUpdateFields>;

    const newError: typeof error = {
      ...currentTabErrors,
    };

    setError(newError);

    const hasError = Object.keys(currentTabErrors).some(d => !!d);
    return !hasError;
  }, [value, currentStep, setError]);

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    scrollToTop();
    setCurrentStep(newStep);
  }, []);

  const {
    pending: drefSubmitPending,
    trigger: submitRequest,
  } = useLazyRequest<DrefOperationalResponseFields, Partial<DrefOperationalUpdateApiFields>>({
    url: `api/v2/dref-op-update/${id}`,
    method: 'PUT',
    body: ctx => ctx,
    onSuccess: (response) => {
      alert.show(
        'Operational Update was updated successfully!',
        { variant: 'success' },
      );
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
    pending: operationalUpdatePending,
    response: drefOperationalResponse,
  } = useRequest<DrefOperationalUpdateApiFields>({
    skip: !id,
    url: `api/v2/dref-op-update/${id}/`,
    onSuccess: (response) => {
      setFileIdToUrlMap((prevMap) => {
        const newMap = {
          ...prevMap,
        };
        if (response.images_details?.length > 0) {
          response.images_details.forEach((img) => {
            newMap[img.id] = img.file;
          });
        }

        return newMap;
      });
      setValue({
        ...response,
        country_district: response.country_district?.map((cd) => ({
          ...cd,
          clientId: String(cd.id),
        })),
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
        disability_people_per: response.disability_people_per ? +response.disability_people_per : undefined,
        people_per_urban: response.people_per_urban ? +response.people_per_urban : undefined,
        people_per_local: response.people_per_local ? +response.people_per_local : undefined,
      });
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

  const submitDrefOperationalUpdate = React.useCallback(() => {
    const result = validate();

    if (result.errored) {
      setError(result.error);
    } else if (result.value && userDetails && userDetails.id) {
      const body = {
        user: userDetails.id,
        ...result.value,
      };
      submitRequest(body as DrefOperationalUpdateApiFields);
    }
  }, [submitRequest, setError, validate, userDetails]);

  const handleSubmitButtonClick = React.useCallback(() => {
    scrollToTop();
    const isCurrentTabValid = validateCurrentTab(['title']);
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

  const pending = fetchingCountries
    || fetchingDisasterTypes
    || fetchingDrefOptions
    || fetchingUserDetails
    || operationalUpdatePending
    || drefSubmitPending;

  const failedToLoadDref = !pending && isDefined(id) && !drefOperationalResponse;

  React.useEffect(() => {
    if (isDefined(value.new_operational_start_date) && isDefined(value.new_operational_end_date)) {
      const startDateYear = new Date(value.new_operational_start_date).getFullYear();
      const startDateMonth = new Date(value.new_operational_start_date).getMonth();
      const endDateYear = new Date(value.new_operational_end_date).getFullYear();
      const endDateMonth = new Date(value.new_operational_end_date).getMonth();
      const totalOperatingTimeframe = ((endDateMonth + 12 * endDateYear) - (startDateMonth + 12 * startDateYear));

      onValueChange(totalOperatingTimeframe, 'total_operation_timeframe');
    }
  }, [onValueChange, value.new_operational_start_date, value.new_operational_end_date]);

  const exportLinkProps = useButtonFeatures({
    variant: 'secondary',
    children: strings.drefFormExportLabel,
  });

  const isImminentOnset = value?.type_of_onset === ONSET_IMMINENT;

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
                to={`/dref-operational-update/${id}/export/`}
                {...exportLinkProps}
              />
            )}
            <Button
              name={undefined}
              onClick={submitDrefOperationalUpdate}
              type='submit'
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
            <Tab
              name='needs'
              step={3}
              errored={erroredTabs['needs']}
            >
              {strings.drefOperationalUpdateNeedsLabel}
            </Tab>
            <Tab
              name='operation'
              step={4}
              errored={erroredTabs['operation']}
            >
              {strings.drefOperationalUpdateOperationLabel}
            </Tab>
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
              <p>
                {strings.drefOperationalUpdateErrorDescription}
              </p>
            </Container>
          ) : (
            <>
              <Container>
                <NonFieldError
                  error={error}
                  message="Please correct all the errors"
                />
              </Container>
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
                />
              </TabPanel>
              <TabPanel name='eventDetails'>
                <EventDetails
                  error={error}
                  onValueChange={onValueChange}
                  value={value}
                  yesNoOptions={yesNoOptions}
                  isImminentOnset={isImminentOnset}
                  fileIdToUrlMap={fileIdToUrlMap}
                  setFileIdToUrlMap={setFileIdToUrlMap}
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
          )
        )}
      </Page>
    </Tabs>
  );
}

export default DrefOperationalUpdate;

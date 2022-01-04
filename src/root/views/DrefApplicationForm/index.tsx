import React from 'react';
import type { History, Location } from 'history';
import { Link } from 'react-router-dom';
import {
  isDefined,
  listToMap,
} from '@togglecorp/fujs';
import {
  PartialForm,
  useForm,
  accumulateErrors,
  analyzeErrors,
} from '@togglecorp/toggle-form';
import type { match as Match } from 'react-router-dom';

import BlockLoading from '#components/block-loading';
import Button from '#components/Button';
import Container from '#components/Container';
import NonFieldError from '#components/NonFieldError';
import Page from '#components/Page';
import Tab from '#components/Tabs/Tab';
import TabList from '#components/Tabs/TabList';
import TabPanel from '#components/Tabs/TabPanel';
import Tabs from '#components/Tabs';
import { useButtonFeatures } from '#components/Button';
import {
  useLazyRequest,
  useRequest,
} from '#utils/restRequest';
import { ymdToDateString } from '#utils/common';
import LanguageContext from '#root/languageContext';
import useAlert from '#hooks/useAlert';

import DrefOverview from './DrefOverview';
import EventDetails from './EventDetails';
import ActionsFields from './ActionsFields';
import Response from './Response';
import Submission from './Submission';
import {
  DrefFields,
  DrefApiFields,
  overviewFields,
  eventDetailsFields,
  actionsFields,
  responseFields,
  submissionFields,
  ONSET_IMMINENT,
} from './common';
import useDrefFormOptions, { schema } from './useDrefFormOptions';

import styles from './styles.module.scss';

const defaultFormValues: PartialForm<DrefFields> = {
  /*
  country_district: [
    { clientId: randomString() },
  ],
   */
  country_district: [],
  planned_interventions: [],
  national_society_actions: [],
  needs_identified: [],
  images: [],
  users: [],
};

function scrollToTop() {
  window.setTimeout(() => {
    window.scrollTo({
      top: Math.min(145, window.scrollY),
      left: 0,
      behavior: 'smooth',
    });
  }, 0);
}

interface DrefResponseFields {
  id: number;
}

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
    // location,
    history,
    match,
  } = props;

  const alert = useAlert();
  const { drefId } = match.params;
  const { strings } = React.useContext(LanguageContext);
  const {
    value,
    error,
    onValueChange,
    validate,
    onErrorSet,
    onValueSet,
  } = useForm(defaultFormValues, schema);

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

      const erroredFields = Object.keys(error?.fields ?? {}) as (keyof DrefFields)[];
      const hasError = erroredFields.some(d => currentFieldsMap[d]);
      tabs[tabKey] = hasError;
    });

    return tabs;
  }, [error]);

  const {
    pending: drefSubmitPending,
    trigger: submitRequest,
  } = useLazyRequest<DrefResponseFields, Partial<DrefApiFields>>({
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
      }
    },
    onFailure: ({
      value: {
        messageForNotification,
        formErrors,
      },
      debugMessage,
    }) => {
      onErrorSet({
        fields: formErrors,
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
    pending: drefApplicationPending,
    response: drefResponse,
  } = useRequest<DrefApiFields>({
    skip: !drefId,
    url: `api/v2/dref/${drefId}/`,
    onSuccess: (response) => {
      setFileIdToUrlMap((prevMap) => {
        const newMap = {
          ...prevMap,
        };

        if (response.event_map_details) {
          newMap[response.event_map_details.id] = response.event_map_details.file;
        }

        if (response.cover_image_details) {
          newMap[response.cover_image_details.id] = response.cover_image_details.file;
        }

        if (response.images_details?.length > 0) {
          response.images_details.forEach((img) => {
            newMap[img.id] = img.file;
          });
        }

        if (response.budget_file_details) {
          newMap[response.budget_file_details.id] = response.budget_file_details.file;
        }

        return newMap;
      });
      onValueSet({
        ...response,
        country_district: response.country_district?.map((cd) => ({
          ...cd,
          clientId: String(cd.id),
        })),
        planned_interventions: response.planned_interventions?.map((pi) => ({
          ...pi,
          clientId: String(pi.id),
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
    const validationError = accumulateErrors(value, schema);
    const currentFields = stepTypesToFieldsMap[currentStep];
    const exceptionsMap = listToMap(exceptions, d => d, d => true);

    if (!validationError) {
      return true;
    }

    const currentTabFieldErrors = listToMap(
      currentFields.filter(field => (
        !exceptionsMap[field] && analyzeErrors(validationError.fields?.[field]
        ))),
      field => field,
      field => validationError.fields?.[field]
    ) as NonNullable<NonNullable<(typeof error)>['fields']>;

    const newError: typeof error = {
      ...error,
      fields: {
        ...error?.fields,
        ...validationError.fields,
        ...currentTabFieldErrors,
      }
    };

    onErrorSet(newError);

    const hasError = Object.keys(currentTabFieldErrors).some(d => !!d);
    return !hasError;
  }, [value, currentStep, onErrorSet, error]);

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    scrollToTop();
    const isCurrentTabValid = validateCurrentTab(['event_map']);

    if (!isCurrentTabValid) {
      return;
    }

    setCurrentStep(newStep);
  }, [validateCurrentTab]);

  const submitDref = React.useCallback(() => {
    const {
      errored,
      error,
      value: finalValues,
    } = validate();

    onErrorSet(error);

    if (errored) {
      return;
    }

    if (finalValues && userDetails && userDetails.id) {
      const body = {
        user: userDetails.id,
        ...finalValues,
      };
      submitRequest(body as DrefApiFields);
    }
  }, [submitRequest, validate, userDetails, onErrorSet]);

  const handleSubmitButtonClick = React.useCallback(() => {
    scrollToTop();

    const isCurrentTabValid = validateCurrentTab([
      'event_map'
    ]);

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

  const isImminentOnset = value?.type_of_onset === ONSET_IMMINENT;
  React.useEffect(() => {
    onValueSet((oldValue) => {
      if (value.type_of_onset !== ONSET_IMMINENT) {
        return {
          ...oldValue,
          event_text: undefined,
          anticipatory_actions: undefined,
          people_targeted_with_early_actions: undefined,
          event_date: undefined,
        };
      }

      return oldValue;
    });
  }, [onValueSet, value.type_of_onset]);

  React.useEffect(() => {
    onValueSet((oldValue) => {
      if (value.ns_request_fund === false || value.ns_respond === false || value.affect_same_population === false || value.affect_same_area === false) {
        return {
          ...oldValue,
          dref_recurrent_text: undefined,
        };
      }
      return oldValue;
    });
  }, [onValueSet, value.ns_request_fund, value.ns_respond, value.affect_same_population, value.affect_same_area]);

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
        onValueChange(ymdToDateString(yyyy, mm, dd), 'end_date' as const);
      }
    }
  }, [onValueChange, value.date_of_approval, value.operation_timeframe]);

  const exportLinkProps = useButtonFeatures({
    variant: 'secondary',
    children: strings.drefFormExportLabel,
  });

  const failedToLoadDref = !pending && isDefined(drefId) && !drefResponse;

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
            {isDefined(drefId) && (
              <Link
                to={`/dref-application/${drefId}/export/`}
                {...exportLinkProps}
              />
            )}
            <Button
              name={undefined}
              onClick={submitDref}
              type="submit"
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
                {strings.drefFormLoadErrorTitle}
              </h3>
              <p>
                {strings.drefFormLoadErrorDescription}
              </p>
              <p>
                {strings.drefFormLoadErrorHelpText}
              </p>
            </Container>
          ) : (
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
                  onValueSet={onValueSet}
                  userOptions={userOptions}
                  onCreateAndShareButtonClick={submitDref}
                />
              </TabPanel>
              <TabPanel name="eventDetails">
                <EventDetails
                  isImminentOnset={isImminentOnset}
                  error={error}
                  onValueChange={onValueChange}
                  value={value}
                  yesNoOptions={yesNoOptions}
                  fileIdToUrlMap={fileIdToUrlMap}
                  setFileIdToUrlMap={setFileIdToUrlMap}
                />
              </TabPanel>
              <TabPanel name="action">
                <ActionsFields
                  error={error}
                  onValueChange={onValueChange}
                  value={value}
                  yesNoOptions={yesNoOptions}
                  needOptions={needOptions}
                  nsActionOptions={nsActionOptions}
                />
              </TabPanel>
              <TabPanel name="response">
                <Response
                  interventionOptions={interventionOptions}
                  error={error}
                  onValueChange={onValueChange}
                  value={value}
                  fileIdToUrlMap={fileIdToUrlMap}
                  setFileIdToUrlMap={setFileIdToUrlMap}
                  needOptions={needOptions}
                />
              </TabPanel>
              <TabPanel name="submission">
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
                  type="submit"
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

export default DrefApplication;

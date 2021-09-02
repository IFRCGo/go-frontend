import React from 'react';
import type { History, Location } from 'history';
import {
  randomString,
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
import {
  useLazyRequest,
  useRequest,
} from '#utils/restRequest';
import { isObject } from '#utils/common';
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
  country_district: [
    { clientId: randomString() },
  ],
  planned_interventions: [],
  national_society_actions: [],
  needs_identified: [],
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

type StepTypes = 'drefOverview' | 'eventDetails' | 'action' | 'response' | 'submission';
const stepTypesToFieldsMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in StepTypes]: (keyof DrefFields)[];
} = {
  drefOverview: overviewFields,
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
  } = useDrefFormOptions(value);

  const [fileIdToUrlMap, setFileIdToUrlMap] = React.useState<Record<number, string>>({});
  const [currentStep, setCurrentStep] = React.useState<StepTypes>('drefOverview');
  const submitButtonLabel = currentStep === 'submission' ? strings.fieldReportSubmit : strings.fieldReportContinue;
  const shouldDisabledBackButton = currentStep === 'drefOverview';

  const erroredTabs = React.useMemo(() => {
    const tabs: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      [key in StepTypes]: boolean;
    } = {
      drefOverview: false,
      eventDetails: false,
      action: false,
      response: false,
      submission: false,
    };

    const tabKeys = (Object.keys(tabs)) as StepTypes[];
    tabKeys.forEach((tabKey) => {
      const currentFields = stepTypesToFieldsMap[tabKey];
      const currentFieldsMap = listToMap(currentFields, d => d, d => true);

      const erroredFields = Object.keys(error?.fields ?? {});
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
        'Dref application created / updated successfully',
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
        errors,
        formErrors,
      },
      debugMessage,
    }) => {
      if (errors && isObject(errors)) {
        const objErrors = errors as Record<string, string | string[]>;
        const errorKeys = Object.keys(objErrors) as (keyof (typeof objErrors))[];

        const transformedError: Record<string, string> = {};
        errorKeys.forEach((ek) => {
          if (Array.isArray(objErrors[ek])) {
            transformedError[ek] = (objErrors[ek] as string[]).join(', ');
          } else {
            transformedError[ek] = objErrors[ek] as string;
          }
        });

        onErrorSet({
          fields: transformedError,
        });
      }
      alert.show(
        <p>
          Failed to create / update Dref Application
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

        if (response.images_details?.length > 0) {
          response.images_details.forEach((img) => {
            newMap[img.id] = img.file;
          });
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
      });
    },
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
    );

    const newError = {
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

    const isCurrentTabValid = validateCurrentTab([
      'event_map',
    ]);

    if (!isCurrentTabValid) {
      return;
    }

    setCurrentStep(newStep);
  }, [validateCurrentTab]);

  const handleSubmitButtonClick = React.useCallback(() => {
    scrollToTop();

    const isCurrentTabValid = validateCurrentTab([
      'event_map'
    ]);
    if (!isCurrentTabValid) {
      return;
    }

    if (currentStep === 'submission') {
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
          ...getDefinedValues(finalValues),
        };
        submitRequest(body as DrefApiFields);
      }
    } else {
      const nextStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'submission'>]: Exclude<StepTypes, 'drefOverview'>;
      } = {
        drefOverview: 'eventDetails',
        eventDetails: 'action',
        action: 'response',
        response: 'submission',
      };

      handleTabChange(nextStepMap[currentStep]);
    }
  }, [validateCurrentTab, currentStep, handleTabChange, validate, onErrorSet, submitRequest, userDetails]);
  const handleBackButtonClick = React.useCallback(() => {
    if (currentStep !== 'drefOverview') {
      const prevStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'drefOverview'>]: Exclude<StepTypes, 'submission'>;
      } = {
        eventDetails: 'drefOverview',
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

  return (
    <Tabs
      disabled={false}
      onChange={handleTabChange}
      value={currentStep}
      variant="step"
    >
      <Page
        className={className}
        heading="DREF Application"
        info={(
          <TabList className={styles.tabList}>
            <Tab
              name="drefOverview"
              step={1}
              errored={erroredTabs['drefOverview']}
            >
              Dref Overview
            </Tab>
            <Tab
              name="eventDetails"
              step={2}
              errored={erroredTabs['eventDetails']}
            >
              Event Details
            </Tab>
            <Tab
              name="action"
              step={3}
              errored={erroredTabs['action']}
            >
              Actions/Needs
            </Tab>
            <Tab
              name="response"
              step={4}
              errored={erroredTabs['response']}
            >
              Response
            </Tab>
            <Tab
              name="submission"
              step={5}
              errored={erroredTabs['submission']}
            >
              Submission/Contacts
            </Tab>
          </TabList>
        )}
      >
        {pending ? (
          <Container>
            <BlockLoading />
          </Container>
        ) : (
          <>
            <Container>
              <NonFieldError
                error={error}
                message="Please correct all the errors!"
              />
            </Container>
            <TabPanel name="drefOverview">
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
              />
            </TabPanel>
            <TabPanel name="eventDetails">
              <EventDetails
                isImminentOnset={isImminentOnset}
                error={error}
                onValueChange={onValueChange}
                value={value}
                yesNoOptions={yesNoOptions}
                onValueSet={onValueSet}
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
                Back
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
        )}
      </Page>
    </Tabs>
  );
}

export default DrefApplication;

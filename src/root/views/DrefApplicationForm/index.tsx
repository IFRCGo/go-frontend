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

type StepTypes = 'DrefOverview' | 'EventDetails' | 'Action' | 'Response' | 'Submisson';
const stepTypesToFieldsMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in StepTypes]: (keyof DrefFields)[];
} = {
  DrefOverview: overviewFields,
  EventDetails: eventDetailsFields,
  Action: actionsFields,
  Response: responseFields,
  Submisson: submissionFields,
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

  const [currentStep, setCurrentStep] = React.useState<StepTypes>('DrefOverview');
  const submitButtonLabel = currentStep === 'Submisson' ? strings.fieldReportSubmit : strings.fieldReportContinue;
  const shouldDisabledBackButton = currentStep === 'DrefOverview';

  const erroredTabs = React.useMemo(() => {
    const tabs: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      [key in StepTypes]: boolean;
    } = {
      DrefOverview: false,
      EventDetails: false,
      Action: false,
      Response: false,
      Submisson: false,
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

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    scrollToTop();

    const validationError = accumulateErrors(value, schema);

    if (!validationError) {
      setCurrentStep(newStep);
      return;
    }

    const currentFields = stepTypesToFieldsMap[currentStep];

    const currentTabFieldErrors = listToMap(
      currentFields.filter(field => !!validationError.fields?.[field]),
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


    if (hasError) {
      return;
    }

    setCurrentStep(newStep);
  }, [value, setCurrentStep, onErrorSet, error, currentStep]);

  const handleSubmitButtonClick = React.useCallback(() => {
    scrollToTop();
    const {
      errored,
      error,
      value: finalValues,
    } = validate();

    onErrorSet(error);

    if (errored) {
      return;
    }

    if (currentStep === 'Submisson') {
      if (finalValues && userDetails && userDetails.id) {
        const body = {
          user: userDetails.id,
          ...getDefinedValues(finalValues),
        } as DrefApiFields;

        submitRequest(body);
      }
    } else {
      const nextStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'Submisson'>]: Exclude<StepTypes, 'DrefOverview'>;
      } = {
        DrefOverview: 'EventDetails',
        EventDetails: 'Action',
        Action: 'Response',
        Response: 'Submisson',
      };

      handleTabChange(nextStepMap[currentStep]);
    }
  }, [currentStep, handleTabChange, validate, onErrorSet, submitRequest, userDetails]);

  const handleBackButtonClick = React.useCallback(() => {
    if (currentStep !== 'DrefOverview') {
      const prevStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'DrefOverview'>]: Exclude<StepTypes, 'Submisson'>;
      } = {
        EventDetails: 'DrefOverview',
        Action: 'EventDetails',
        Response: 'Action',
        Submisson: 'Response',
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
              name="DrefOverview"
              step={1}
              errored={erroredTabs['DrefOverview']}
            >
              Dref Overview
            </Tab>
            <Tab
              name="EventDetails"
              step={2}
              errored={erroredTabs['EventDetails']}
            >
              Event Details
            </Tab>
            <Tab
              name="Action"
              step={3}
              errored={erroredTabs['Action']}
            >
              Actions/Needs
            </Tab>
            <Tab
              name="Response"
              step={4}
              errored={erroredTabs['Response']}
            >
              Response
            </Tab>
            <Tab
              name="Submisson"
              step={5}
              errored={erroredTabs['Submisson']}
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
            <TabPanel name="DrefOverview">
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
              />
            </TabPanel>
            <TabPanel name="EventDetails">
              <EventDetails
                error={error}
                onValueChange={onValueChange}
                value={value}
                yesNoOptions={yesNoOptions}
              />
            </TabPanel>
            <TabPanel name="Action">
              <ActionsFields
                error={error}
                onValueChange={onValueChange}
                value={value}
                yesNoOptions={yesNoOptions}
                needOptions={needOptions}
                nsActionOptions={nsActionOptions}
              />
            </TabPanel>
            <TabPanel name="Response">
              <Response
                interventionOptions={interventionOptions}
                error={error}
                onValueChange={onValueChange}
                value={value}
              />
            </TabPanel>
            <TabPanel name="Submisson">
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

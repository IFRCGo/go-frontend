import React from 'react';
import type { History, Location } from 'history';
import {
  _cs,
  randomString,
  isDefined,
} from '@togglecorp/fujs';
import { PartialForm, useForm } from '@togglecorp/toggle-form';
import type { match as Match } from 'react-router-dom';

import BlockLoading from '#components/block-loading';
import NonFieldError from '#components/NonFieldError';
import Button from '#components/Button';
import Container from '#components/Container';
import TabPanel from '#components/Tabs/TabPanel';
import Page from '#components/Page';
import Tabs from '#components/Tabs';
import TabList from '#components/Tabs/TabList';
import Tab from '#components/Tabs/Tab';
import DrefOverview from '#views/DrefApplication/DrefOverview';
import {
  useLazyRequest,
  useRequest,
} from '#utils/restRequest';
import useAlert from '#hooks/useAlert';

import EventDetails from './EventDetails';
import ActionsFields from './ActionsFields';
import Response from './Response';
import Submission from './Submission';
import { DrefFields } from './common';
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

interface DrefApiFields extends DrefFields {
  user: number;
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

  type StepTypes = 'DrefOverview' | 'EventDetails' | 'Action' | 'Response' | 'Submisson';
  const [currentStep, setCurrentStep] = React.useState<StepTypes>('DrefOverview');
  const submitButtonLabel = currentStep === 'Submisson' ? 'Submit' : 'Continue';
  const shouldDisabledBackButton = currentStep === 'DrefOverview';

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
      value: { messageForNotification, errors },
      debugMessage,
    }) => {
      console.error(errors);
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
        country_district: response.country_district?.map((d) => ({
          ...d,
          district: [d.district as unknown as number],
        })),
      });
    },
  });

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    scrollToTop();
    const {
      errored,
      error,
    } = validate();

    onErrorSet(error);

    if (!errored) {
      setCurrentStep(newStep);
    }
  }, [setCurrentStep, onErrorSet, validate]);

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

      setCurrentStep(nextStepMap[currentStep]);
    }
  }, [currentStep, setCurrentStep, validate, onErrorSet, submitRequest, userDetails]);

  const handleBackButtonClick = React.useCallback(() => {
    scrollToTop();
    const {
      errored,
      error,
    } = validate();

    onErrorSet(error);

    if (!errored && currentStep !== 'DrefOverview') {
      const prevStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'DrefOverview'>]: Exclude<StepTypes, 'Submisson'>;
      } = {
        EventDetails: 'DrefOverview',
        Action: 'EventDetails',
        Response: 'Action',
        Submisson: 'Response',
      };
      setCurrentStep(prevStepMap[currentStep]);
    }
  }, [validate, setCurrentStep, currentStep, onErrorSet]);

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
            >
              Dref Overview
            </Tab>
            <Tab
              name="EventDetails"
              step={2}
            >
              Event Details
            </Tab>
            <Tab
              name="Action"
              step={3}
            >
              Actions/Needs
            </Tab>
            <Tab
              name="Response"
              step={4}
            >
              Response
            </Tab>
            <Tab
              name="Submisson"
              step={5}
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
                message="Please fill in all thre required fields"
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
                variant="secondary"
                onClick={handleBackButtonClick}
                disabled={shouldDisabledBackButton}
              >
                Back
              </Button>
              <Button
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

import React from 'react';
import { _cs } from '@togglecorp/fujs';
import type { match as Match } from 'react-router-dom';
import Container from '#components/Container';
import TabPanel from '#components/Tabs/TabPanel';
import { PartialForm, useForm } from '@togglecorp/toggle-form';

import {
  FormType,
  Option,
  DrefApplicationAPIFields
} from './common';
import useDrefFormOptions, { schema } from './useDrefFormOptions';
import Page from '#components/Page';
import Tabs from '#components/Tabs';
import TabList from '#components/Tabs/TabList';
import Tab from '#components/Tabs/Tab';
import DrefOverview from '#views/DrefApplication/DrefOverview';

import styles from './styles.module.scss';
import EventDetails from './EventDetails';
import ActionsFields from './ActionsFields';
import Response from './Response';
import Submission from './Submission';
import { useRequest } from '#utils/restRequest';

const defaultFormValues: PartialForm<FormType> = {};
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
  className?: string;
  match: Match<{ reportId?: string }>;
  history: History;
  location: Location;
}
function DrefApplication() {

  const {
    value,
    error,
    onValueChange,
    validate,
    onErrorSet,
  } = useForm(defaultFormValues, schema);
  const [initialEventOptions, setInitialEventOptions] = React.useState<Option[]>([]);

  const {
    countryOptions,
    disasterTypeOptions,
    districtOptions,
    fetchingCountries,
    fetchingDisasterTypes,
    fetchingDistricts,
    statusOptions,
    nationalSocietyOptions,
    fetchingNationalSociety,
    yesNoOptions,
  } = useDrefFormOptions(value);

  const {
    pending: fieldReportPending,
    response: fieldReportResponse,
  } = useRequest<DrefApplicationAPIFields>({
    // skip: !reportId,
    url: `/api/v2/dref/`,
  });

  type StepTypes = 'DrefOverview' | 'EventDetails' | 'Action' | 'Response' | 'Submisson';
  const [currentStep, setCurrentStep] = React.useState<StepTypes>('DrefOverview');
  const submitButtonLabel = currentStep === 'Submisson' ? 'Submit' : 'Continue';
  const submitButtonClassName = currentStep === 'Submisson' ? 'button--primary-filled' : 'button--secondary-filled';
  const shouldDisabledBackButton = currentStep === 'DrefOverview';

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    scrollToTop();
    const {
      errored,
      error,
    } = validate();

    onErrorSet(error);

    setCurrentStep(newStep);
  }, [setCurrentStep]);

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
  }, [currentStep, setCurrentStep, validate, onErrorSet]);
  const handleBackButtonClick = React.useCallback(() => {
    scrollToTop();
    const {
      errored,
      error,
    } = validate();

    onErrorSet(error);

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
      setCurrentStep(prevStepMap[currentStep]);
    }
  }, [validate, setCurrentStep, currentStep, onErrorSet]);

  return (
    <Tabs
      disabled={false}
      onChange={handleTabChange}
      value={currentStep}
      variant="step"
    >
      <Page
        heading="DREF Application"
        // breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
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
        <Container>
          <TabPanel name="DrefOverview">
            <DrefOverview
              error={error}
              onValueChange={onValueChange}
              statusOptions={statusOptions}
              value={value}
              yesNoOptions={yesNoOptions}
              disasterTypeOptions={disasterTypeOptions}
              countryOptions={countryOptions}
              districtOptions={districtOptions}
              fetchingCountries={fetchingCountries}
              fetchingDistricts={fetchingDistricts}
              fetchingDisasterTypes={fetchingDisasterTypes}
              nationalSocietyOptions={nationalSocietyOptions}
              fetchingNationalSociety={fetchingNationalSociety}
            />
          </TabPanel>
          <TabPanel name="EventDetails">
            <EventDetails
              error={error}
              onValueChange={onValueChange}
              statusOptions={statusOptions}
              value={value}
              yesNoOptions={yesNoOptions}
              disasterTypeOptions={disasterTypeOptions}
              countryOptions={countryOptions}
              districtOptions={districtOptions}
              fetchingCountries={fetchingCountries}
              fetchingDistricts={fetchingDistricts}
              fetchingDisasterTypes={fetchingDisasterTypes}
              initialEventOptions={initialEventOptions}
            />
          </TabPanel>
          <TabPanel name="Action">
            <ActionsFields
              error={error}
              onValueChange={onValueChange}
              statusOptions={statusOptions}
              value={value}
              yesNoOptions={yesNoOptions}
              disasterTypeOptions={disasterTypeOptions}
              countryOptions={countryOptions}
              districtOptions={districtOptions}
              fetchingCountries={fetchingCountries}
              fetchingDistricts={fetchingDistricts}
              fetchingDisasterTypes={fetchingDisasterTypes}
              initialEventOptions={initialEventOptions}
            />
          </TabPanel>
          <TabPanel name="Response">
            <Response
              error={error}
              onValueChange={onValueChange}
              statusOptions={statusOptions}
              value={value}
              yesNoOptions={yesNoOptions}
              disasterTypeOptions={disasterTypeOptions}
              countryOptions={countryOptions}
              districtOptions={districtOptions}
              fetchingCountries={fetchingCountries}
              fetchingDistricts={fetchingDistricts}
              fetchingDisasterTypes={fetchingDisasterTypes}
              initialEventOptions={initialEventOptions}
            />
          </TabPanel>
          <TabPanel name="Submisson">
            <Submission
              error={error}
              onValueChange={onValueChange}
              statusOptions={statusOptions}
              value={value}
              yesNoOptions={yesNoOptions}
              disasterTypeOptions={disasterTypeOptions}
              countryOptions={countryOptions}
              districtOptions={districtOptions}
              fetchingCountries={fetchingCountries}
              fetchingDistricts={fetchingDistricts}
              fetchingDisasterTypes={fetchingDisasterTypes}
              initialEventOptions={initialEventOptions}
            />
          </TabPanel>
          <div className={styles.actions}>
            <button
              className={_cs('button button--secondary-bounded', shouldDisabledBackButton && 'disabled')}
              onClick={handleBackButtonClick}
              type="button"
              disabled={shouldDisabledBackButton}
            >
              Back
              </button>
            <button
              className={_cs('button', submitButtonClassName)}
              onClick={handleSubmitButtonClick}
              type="submit"
            >
              {submitButtonLabel}
            </button>
          </div>
        </Container>
      </Page>
    </Tabs>
  );
}

export default DrefApplication;

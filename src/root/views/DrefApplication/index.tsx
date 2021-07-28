import React from 'react';
import { _cs } from '@togglecorp/fujs';
import type { match as Match } from 'react-router-dom';
import Container from '#components/Container';
import TabPanel from '#components/Tabs/TabPanel';
import { PartialForm, useForm } from '@togglecorp/toggle-form';

import {
  BULLETIN_PUBLISHED_NO,
  FormType,
  STATUS_EARLY_WARNING,
  STATUS_EVENT,
  VISIBILITY_PUBLIC,
  Option
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

const defaultFormValues: PartialForm<FormType> = {
  status: STATUS_EVENT,
  is_covid_report: false,
  visibility: VISIBILITY_PUBLIC,
  bulletin: BULLETIN_PUBLISHED_NO,
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
    onValueSet,
  } = useForm(defaultFormValues, schema);
  const [initialEventOptions, setInitialEventOptions] = React.useState<Option[]>([]);

  const {
    countryOptions,
    disasterTypeOptions,
    districtOptions,
    fetchingCountries,
    fetchingDisasterTypes,
    fetchingDistricts,
    reportType,
    statusOptions,
    yesNoOptions,
  } = useDrefFormOptions(value);

  type StepTypes = 'step1' | 'step2' | 'step3' | 'step4' | 'step5';
  const [currentStep, setCurrentStep] = React.useState<StepTypes>('step1');
  const submitButtonLabel = currentStep === 'step5' ? 'Submit' : 'Continue';
  const submitButtonClassName = currentStep === 'step5' ? 'button--primary-filled' : 'button--secondary-filled';
  const shouldDisabledBackButton = currentStep === 'step1';

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    scrollToTop();

    // const {
    //   errored,
    //   error,
    // } = validate();

    // onErrorSet(error);

    setCurrentStep(newStep);
  }, [setCurrentStep]);

  const handleSubmitButtonClick = React.useCallback(() => {
    scrollToTop();
    // const {
    //   errored,
    //   error,
    //   value: finalValues,
    // } = validate();

    // onErrorSet(error);

    // if (errored) {
    //   return;
    // }

    if (currentStep === 'step5') {
    } else {
      const nextStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'step5'>]: Exclude<StepTypes, 'step1'>;
      } = {
        step1: 'step2',
        step2: 'step3',
        step3: 'step4',
        step4: 'step5',
      };

      setCurrentStep(nextStepMap[currentStep]);
    }
  }, [currentStep, setCurrentStep, validate, onErrorSet]);


  const handleBackButtonClick = React.useCallback(() => {
    scrollToTop();
    // const {
    //   errored,
    //   error,
    // } = validate();

    // onErrorSet(error);

    if (currentStep !== 'step1') {
      const prevStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'step1'>]: Exclude<StepTypes, 'step5'>;
      } = {
        step2: 'step1',
        step3: 'step2',
        step4: 'step3',
        step5: 'step4',
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
              name="step1"
              step={1}
            >
              Dref Overview
            </Tab>
            <Tab
              name="step2"
              step={2}
            >
              Event Details
            </Tab>
            <Tab
              name="step3"
              step={3}
            >
              Actions/Needs
            </Tab>
            <Tab
              name="step4"
              step={4}
            >
              Response
            </Tab>
            <Tab
              name="step5"
              step={5}
            >
              Submission/Contacts
            </Tab>
          </TabList>
        )}
      >
        <Container>
          <TabPanel name="step1">
            <DrefOverview
              error={error}
              onValueChange={onValueChange}
              statusOptions={statusOptions}
              value={value}
              yesNoOptions={yesNoOptions}
              disasterTypeOptions={disasterTypeOptions}
              reportType={reportType}
              countryOptions={countryOptions}
              districtOptions={districtOptions}
              fetchingCountries={fetchingCountries}
              fetchingDistricts={fetchingDistricts}
              fetchingDisasterTypes={fetchingDisasterTypes}
              initialEventOptions={initialEventOptions}
            />
          </TabPanel>
          <TabPanel name="step2">
            <EventDetails
              error={error}
              onValueChange={onValueChange}
              statusOptions={statusOptions}
              value={value}
              yesNoOptions={yesNoOptions}
              disasterTypeOptions={disasterTypeOptions}
              reportType={reportType}
              countryOptions={countryOptions}
              districtOptions={districtOptions}
              fetchingCountries={fetchingCountries}
              fetchingDistricts={fetchingDistricts}
              fetchingDisasterTypes={fetchingDisasterTypes}
              initialEventOptions={initialEventOptions}
            />
          </TabPanel>
          <TabPanel name="step3">
            <ActionsFields
              error={error}
              onValueChange={onValueChange}
              statusOptions={statusOptions}
              value={value}
              yesNoOptions={yesNoOptions}
              disasterTypeOptions={disasterTypeOptions}
              reportType={reportType}
              countryOptions={countryOptions}
              districtOptions={districtOptions}
              fetchingCountries={fetchingCountries}
              fetchingDistricts={fetchingDistricts}
              fetchingDisasterTypes={fetchingDisasterTypes}
              initialEventOptions={initialEventOptions}
            />
          </TabPanel>
          <TabPanel name="step4">
            <Response
              error={error}
              onValueChange={onValueChange}
              statusOptions={statusOptions}
              value={value}
              yesNoOptions={yesNoOptions}
              disasterTypeOptions={disasterTypeOptions}
              reportType={reportType}
              countryOptions={countryOptions}
              districtOptions={districtOptions}
              fetchingCountries={fetchingCountries}
              fetchingDistricts={fetchingDistricts}
              fetchingDisasterTypes={fetchingDisasterTypes}
              initialEventOptions={initialEventOptions}
            />
          </TabPanel>
          <TabPanel name="step5">
            <Submission
              error={error}
              onValueChange={onValueChange}
              statusOptions={statusOptions}
              value={value}
              yesNoOptions={yesNoOptions}
              disasterTypeOptions={disasterTypeOptions}
              reportType={reportType}
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

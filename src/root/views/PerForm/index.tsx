import React from 'react';
import { PartialForm, useForm } from '@togglecorp/toggle-form';
import type { match as Match } from 'react-router-dom';
import LanguageContext from '#root/languageContext';

import scrollToTop from '#utils/scrollToTop';
import {
  useLazyRequest,
  useRequest,
} from '#utils/restRequest';

import Page from '#components/Page';
import Tabs from '#components/Tabs';
import TabList from '#components/Tabs/TabList';
import Tab from '#components/Tabs/Tab';
import Button from '#components/Button';
import TabPanel from '#components/Tabs/TabPanel';

import PerOverview from './PerOverview';
import Assessment from './Assessment';
import usePerFormOptions, { schema } from './usePerFormOptions';
import { PerOverviewFields } from './common';
import Prioritization from './Prioritization';
import WorkPlan from './WorkPlan';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  history: History;
  location: Location;
  match: Match<{ perId?: string }>;
}

type StepTypes = 'overview' | 'assessment' | 'prioritization' | 'workPlan';

function PerForm(props: Props) {
  const {
    className,
    history,
    match,
  } = props;

  const {
    value,
    error,
    setFieldValue,
    validate,
    setError,
    setValue,
  } = useForm(schema, { value: {} as PartialForm<PerOverviewFields> });

  const {
    nationalSocietyOptions,
    yesNoOptions,
    assessmentOptions,
  } = usePerFormOptions(value);

  const [fileIdToUrlMap, setFileIdToUrlMap] = React.useState<Record<number, string>>({});

  const [
    showObsoletePayloadResolutionModal,
    setShowObsoletePayloadResolutionModal,
  ] = React.useState(false);

  const { perId } = match.params;

  const { strings } = React.useContext(LanguageContext);

  const [currentStep, setCurrentStep] = React.useState<StepTypes>('overview');

  const handlePerLoad = React.useCallback((response: PerOverviewFields) => {
  }, []);

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    scrollToTop();

    setCurrentStep(newStep);
  }, []);

  const {
    pending: drefSubmitPending,
    trigger: submitRequest,
  } = useLazyRequest<PerOverviewFields, Partial<PerOverviewFields>>({
    url: perId ? `api/v2/new-per/${perId}/` : 'api/v2/new-per/',
    method: perId ? 'PUT' : 'POST',
    body: ctx => ctx,
    onSuccess: (response) => {
      alert.show(
        strings.drefFormSaveRequestSuccessMessage,
        { variant: 'success' },
      );

      if (!perId) {
        window.setTimeout(
          () => history.push(`/new-per/${response?.id}/edit/`),
          250,
        );
      } else {
        handlePerLoad(response);
      }
    },
    onFailure: ({
      value: {
        messageForNotification,
        formErrors,
      },
      debugMessage,
    }) => {
      // setError(formErrors);
      // if (formErrors.modified_at === 'OBSOLETE_PAYLOAD') {
      //   // There was a save conflict due to obsolete payload
      //   setShowObsoletePayloadResolutionModal(true);
      // }

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
  } = useRequest<PerOverviewFields>({
    skip: !perId,
    url: `api/v2/new-per/${perId}/`,
    onSuccess: (response) => {
      handlePerLoad(response);
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

  return (
    <Tabs
      disabled={undefined}
      onChange={handleTabChange}
      value={currentStep}
      variant="step"
    >
      <Page
        className={className}
        actions={(
          <>
            <Button
              variant='secondary'
              name={undefined}
              onClick={undefined}
              >
              Cancel
            </Button>
            <Button
              variant='primary'
              name={undefined}
              onClick={undefined}
            >
              Save and Close
            </Button>
          </>
        )}
        title={strings.perFormTitle}
        heading={strings.perFormHeading}
        info={(
          <TabList className={styles.tabList}>
            <Tab
              name="overview"
              step={1}
              errored={undefined}
            >
              {strings.perFormTabOverviewLabel}
            </Tab>
            <Tab
              name="assessment"
              step={2}
              errored={undefined}
            >
              {strings.perFormTabAssessmentLabel}
            </Tab>
            <Tab
              name="prioritization"
              step={3}
              errored={undefined}
            >
              {strings.perFormTabPrioritizationLabel}
            </Tab>
            <Tab
              name="workPlan"
              step={4}
              errored={undefined}
            >
              {strings.perFormTabWorkPlanLabel}
            </Tab>
          </TabList>
        )}
      >
        <TabPanel name="overview">
          <PerOverview
            onValueChange={setFieldValue}
            error={error}
            value={value}
            nationalSocietyOptions={nationalSocietyOptions}
            yesNoOptions={yesNoOptions}
            assessmentOptions={assessmentOptions}
            fileIdToUrlMap={fileIdToUrlMap}
            setFileIdToUrlMap={setFileIdToUrlMap}
          />
        </TabPanel>
        <TabPanel name="assessment">
          <Assessment />
        </TabPanel>
        <TabPanel name="prioritization">
          <Prioritization />
        </TabPanel>
        <TabPanel name="workPlan">
          <WorkPlan />
        </TabPanel>
      </Page>
    </Tabs>
  );
}

export default PerForm;

import React from 'react';
import {
  Link,
  match,
} from 'react-router-dom';
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
} from '@togglecorp/toggle-form';

import TabList from '#components/Tabs/TabList';
import Page from '#components/Page';
import Tabs from '#components/Tabs';
import Tab from '#components/Tabs/Tab';
import Button,
{ useButtonFeatures } from '#components/Button';
import TabPanel from '#components/Tabs/TabPanel';
import languageContext from '#root/languageContext';
import Container from '#components/Container';
import BlockLoading from '#components/block-loading';

import {
  DrefOperationalUpdateFields,
  eventFields,
  needsFields,
  overviewFields,
  operationFields,
  submissionFields,
} from './common';
import useDrefOperationalFormOptions,
{
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
  match: match<{ drefId?: string }>;
  history: History;
  location: Location;
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

const defaultFormValues: PartialForm<DrefOperationalUpdateFields> = {};

function DrefOperationalUpdate(props: Props) {
  const {
    match,
    history,
  } = props;
  const { drefId } = match.params;
  const {
    value,
    error,
    setFieldValue: onValueChange,
    validate,
    setValue: onValueSet,
    setError: onErrorSet,
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

    onErrorSet(newError);

    const hasError = Object.keys(currentTabErrors).some(d => !!d);
    return !hasError;
  }, [value, currentStep, onErrorSet]);

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    scrollToTop();
    setCurrentStep(newStep);
  }, []);


  const exportLinkProps = useButtonFeatures({
    variant: 'secondary',
    children: strings.drefOperationalUpdateExportButtonLabel,
  });

  const submitDrefOperationalUpdate = React.useCallback(() => {
    //TODO
    console.log('submit called');
  }, []);



  const handleSubmitButtonClick = React.useCallback(() => {
    scrollToTop();

    const isCurrentTabValid = validateCurrentTab(['event_map']);

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

  const pending = fetchingCountries
    || fetchingDisasterTypes
    || fetchingDrefOptions
    || fetchingUserDetails;

  return (
    <>
      <Tabs
        disabled={false}
        onChange={handleTabChange}
        value={currentStep}
        variant='step'
      >
        <Page
          actions={(
            <>
              <Link
                to=''
                {...exportLinkProps}
              />
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
            <>
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
                  onValueSet={onValueSet}
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
          )}
        </Page>
      </Tabs>

    </>
  );
}

export default DrefOperationalUpdate;

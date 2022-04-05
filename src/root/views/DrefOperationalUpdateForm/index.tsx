import React from 'react';
import {
  Link,
  match,
} from 'react-router-dom';
import {
  listToMap,
  mapToMap,
} from '@togglecorp/fujs';
import {
  analyzeErrors,
  getErrorObject,
  PartialForm,
  useForm,
} from '@togglecorp/toggle-form';
import TabList from '#components/Tabs/TabList';
import Page from '#components/Page';
import Tabs from '#components/Tabs';
import Tab from '#components/Tabs/Tab';
import Button,
{ useButtonFeatures } from '#components/Button';
import TabPanel from '#components/Tabs/TabPanel';
import languageContext from '#root/languageContext';
import {
  DrefOperationalUpdateFields,
  eventFields,
  needsFields,
  overviewFields,
  operationFields,
  submissionFields,
} from './common';
import { schema } from './useDrefOperationalUpdateOptions';
import Overview from './Overview';
import EventDetails from './EventDetails';
import Needs from './Needs';
import Operation from './Operation';
import Submission from './Submission';

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
  const { error } = useForm(schema, { value: defaultFormValues });
  const { strings } = React.useContext(languageContext);
  const [currentStep, setCurrentStep] = React.useState<StepTypes>('operationOverview');

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

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    scrollToTop();
    setCurrentStep(newStep);
  }, []);

  const submitDrefOptionalUpdate = React.useCallback(() => {
    //TODO
    console.log('submit called');
  }, []);

  const exportLinkProps = useButtonFeatures({
    variant: 'secondary',
    children: strings.drefOperationalUpdateExportButtonLabel,
  });

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
            <Link
              to=''
              {...exportLinkProps}
            />
            <Button
              name={undefined}
              onClick={submitDrefOptionalUpdate}
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
        <TabPanel name='operationOverview'>
          <Overview />
        </TabPanel>
        <TabPanel name='eventDetails'>
          <EventDetails />
        </TabPanel>
        <TabPanel name='needs'>
          <Needs />
        </TabPanel>
        <TabPanel name='operation'>
          <Operation />
        </TabPanel>
        <TabPanel name='submission'>
          <Submission />
        </TabPanel>
      </Page>
    </Tabs>
  );
}

export default DrefOperationalUpdate;

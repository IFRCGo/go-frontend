import React from 'react';
import LanguageContext from '#root/languageContext';

import scrollToTop from '#utils/scrollToTop';

import Page from '#components/Page';
import Tabs from '#components/Tabs';
import TabList from '#components/Tabs/TabList';
import Tab from '#components/Tabs/Tab';
import Button from '#components/Button';
import TabPanel from '#components/Tabs/TabPanel';

import PerOverview from './PerOverview';
import Assessment from './Assessment';
import { perAssessmentFields, PerOverviewFields } from './common';
import Prioritization from './Prioritization';
import WorkPlan from './WorkPlan';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  history: History;
  location: Location;
}

type StepTypes = 'overview' | 'assessment' | 'prioritization' | 'workPlan';

const stepTypesToFieldsMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in StepTypes]: (keyof PerOverviewFields)[];
} = {
  overview: perAssessmentFields,
  assessment: perAssessmentFields,
  prioritization: perAssessmentFields,
  workPlan: perAssessmentFields,
};

function PerForm(props: Props) {
  const {
    className,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const [currentStep, setCurrentStep] = React.useState<StepTypes>('assessment');

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    scrollToTop();

    setCurrentStep(newStep);
  }, []);
  /*
    const validateCurrentTab = React.useCallback((exceptions: (keyof PerOverviewFields)[] = []) => {
      const validationError = getErrorObject(accumulateErrors(value, overviewSchema, value, undefined));
      const currentFields = stepTypesToFieldsMap[currentStep];
      const exceptionsMap = listToMap(exceptions, d => d, d => true);

      const currentTabErrors = listToMap(
        currentFields.filter(field => (!exceptionsMap[field])),
        field => field,
      ) as ObjectError<PerOverviewFields>;

      const newError: typeof error = {
        ...currentTabErrors,
      };

      setError(newError);
      const hasError = Object.keys(currentTabErrors).some(d => !!d);
      return !hasError;
    }, [value, currentStep, setError]);
  */
  return (
    <Tabs
      disabled={undefined}
      onChange={handleTabChange}
      value={currentStep}
      variant='step'
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
        description={strings.perFormProcessDescription}
        info={(
          <TabList className={styles.tabList}>
            <Tab
              name='overview'
              step={1}
              errored={undefined}
            >
              {strings.perFormTabOverviewLabel}
            </Tab>
            <Tab
              name='assessment'
              step={2}
              errored={undefined}
            >
              {strings.perFormTabAssessmentLabel}
            </Tab>
            <Tab
              name='prioritization'
              step={3}
              errored={undefined}
            >
              {strings.perFormTabPrioritizationLabel}
            </Tab>
            <Tab
              name='workPlan'
              step={4}
              errored={undefined}
            >
              {strings.perFormTabWorkPlanLabel}
            </Tab>
          </TabList>
        )}
      >
        <TabPanel name='overview'>
          <PerOverview />
        </TabPanel>
        <TabPanel name='assessment'>
          <Assessment />
        </TabPanel>
        <TabPanel name='prioritization'>
          <Prioritization />
        </TabPanel>
        <TabPanel name='workPlan'>
          <WorkPlan />
        </TabPanel>
      </Page>
    </Tabs>
  );
}

export default PerForm;

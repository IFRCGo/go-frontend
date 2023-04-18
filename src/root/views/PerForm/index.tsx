import React from 'react';
import type { match as Match } from 'react-router-dom';
import LanguageContext from '#root/languageContext';
import scrollToTop from '#utils/scrollToTop';

import Page from '#components/Page';
import Tabs from '#components/Tabs';
import TabList from '#components/Tabs/TabList';
import Tab from '#components/Tabs/Tab';
import TabPanel from '#components/Tabs/TabPanel';
import PerOverview from './PerOverview';
import Assessment from './Assessment';

import styles from './styles.module.scss';
import usePerFormOptions from './usePerFormOptions';

interface Props {
  className?: string;
  history: History;
  location: Location;
}

type StepTypes = 'overview' | 'assessment' | 'prioritization' | 'workPlan';

function PerForm(props: Props) {
  const {
    className,
    history,
  } = props;

  const {
    nationalSocietyOptions,
    yesNoOptions,
  } = usePerFormOptions();

  const { strings } = React.useContext(LanguageContext);

  const [currentStep, setCurrentStep] = React.useState<StepTypes>('overview');

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    scrollToTop();

    setCurrentStep(newStep);
  }, []);

  return (
    <Tabs
      disabled={undefined}
      onChange={handleTabChange}
      value={currentStep}
      variant="step"
    >
      <Page
        className={className}
        actions={undefined}
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
            nationalSocietyOptions={nationalSocietyOptions}
            yesNoOptions={yesNoOptions}
          />
        </TabPanel>
        <TabPanel name="assessment">
          <Assessment />
        </TabPanel>
      </Page>
    </Tabs>
  );
}

export default PerForm;

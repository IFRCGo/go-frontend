import React from 'react';
import type { match as Match } from 'react-router-dom';
import LanguageContext from '#root/languageContext';

import Page from '#components/Page';
import Tabs from '#components/Tabs';
import TabList from '#components/Tabs/TabList';
import Tab from '#components/Tabs/Tab';
import TabPanel from '#components/Tabs/TabPanel';
import PerOverview from './PerOverview';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  match: Match<{ drefId?: string }>;
  history: History;
  location: Location;
}

type StepTypes = 'overview' | 'assessment' | 'prioritisation' | 'workPaln';

function PerForm(props: Props) {
  const {
    className,
    history,
    match,
  } = props;

  const { strings } = React.useContext(LanguageContext);
  const [currentStep, setCurrentStep] = React.useState<StepTypes>('overview');

  return (
    <Tabs
      disabled={undefined}
      onChange={undefined}
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
          <PerOverview />
        </TabPanel>
      </Page>
    </Tabs>
  );
}

export default PerForm;

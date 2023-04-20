import React from 'react';
import LanguageContext from '#root/languageContext';

import styles from './styles.module.scss';
import Tabs from '#components/Tabs';
import TabList from '#components/Tabs/TabList';
import Tab from '#components/Tabs/Tab';
import TabPanel from '#components/Tabs/TabPanel';
import Container from '#components/Container';
import scrollToTop from '#utils/scrollToTop';
import CustomActivityInput from './CustomActivityInput';
import { ListResponse, useRequest } from '#utils/restRequest';
import { AssessmentQuestion } from '../common';

interface Props {
  className?: string;
}

type StepTypes = 'area1' | 'area2' | 'area3' | 'area4';

function Assessment(props: Props) {
  const {
    className,
  } = props;

  const { strings } = React.useContext(LanguageContext);
  const [currentStep, setCurrentStep] = React.useState<StepTypes>('area1');

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    scrollToTop();
    setCurrentStep(newStep);
  }, []);

  const {
    pending: fetchingAssessmentOptions,
    response: assessmentResponse,
  } = useRequest<ListResponse<AssessmentQuestion>>({
    url: 'api/v2/per-formquestion/',
  });

  return (
    <Tabs
      disabled={undefined}
      onChange={handleTabChange}
      value={currentStep}
      variant="primary"
    >
      <Container>
        <TabList className={styles.tabList}>
          <Tab
            name="area1"
            step={1}
            errored={undefined}
          >
            {strings.perFormArea1Tab}
          </Tab>
          <Tab
            name="area2"
            step={2}
            errored={undefined}
          >
            {strings.perFormArea2Tab}
          </Tab>
          <Tab
            name="area3"
            step={3}
            errored={undefined}
          >
            {strings.perFormArea2Tab}
          </Tab>
          <Tab
            name="area4"
            step={4}
            errored={undefined}
          >
            {strings.perFormArea4Tab}
          </Tab>
          <Tab
            name="area5"
            step={4}
            errored={undefined}
          >
            {strings.perFormArea5Tab}
          </Tab>
        </TabList>
        <TabPanel name="area1">
          {
            assessmentResponse?.results.map((item) => (
              <CustomActivityInput
                key={item.id}
                data={item}
                />
            ))
          }
        </TabPanel>
        <TabPanel name="area2">
          <>world</>
        </TabPanel>
      </Container>
    </Tabs>
  );
}

export default Assessment;

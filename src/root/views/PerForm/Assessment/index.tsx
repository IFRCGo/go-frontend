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
import ProgressBar from '#components/ProgressBar';
import ExpandableContainer from '#components/ExpandableContainer';
import { _cs } from '@togglecorp/fujs';
import Button from '#components/Button';
import { Area, Component } from '../common';

interface Props {
  className?: string;
}

function Assessment(props: Props) {
  const {
    className,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const [currentStep, setCurrentStep] = React.useState(1);

  const handleTabChange = React.useCallback((newStep) => {
    scrollToTop();
    setCurrentStep(newStep);
  }, []);

  const {
    pending: fetchingAssessmentOptions,
    response: assessmentResponse,
  } = useRequest<ListResponse<Component>>({
    url: 'api/v2/per-formquestion/',
  });

  const {
    pending: fetchingAreas,
    response: areaResponse,
  } = useRequest<ListResponse<Area>>({
    url: 'api/v2/per-formarea/',
  });

  return (
    <Container>
      <ExpandableContainer
        className={_cs(styles.customActivity, styles.errored)}
        componentRef={undefined}
        // actionsContainerClassName={styles}
        headingSize='small'
        sub
        actions='Show Summary'
      >
        <Container
          className={styles.inputSection}
        >
          <div className={styles.progressBar}>
            <ProgressBar
              // className={styles.questionAnswered}
              label='Answered'
              value={20}
            />
            <h5>5 Yes;</h5>
            <h5>4 NO</h5>
            <ProgressBar
              // className={styles.questionAnswered}
              label='Answered'
              value={20}
            />
          </div>
        </Container>
      </ExpandableContainer>
      <Tabs
        disabled={undefined}
        onChange={handleTabChange}
        value={currentStep}
        variant='primary'
      >
        <TabList className={styles.tabList}>
          {areaResponse?.results?.map((item) => (
            <Tab
              name={item.id}
              step={item?.area_num}
              errored={undefined}
            >
              Area {item?.area_num}: {item?.title}
            </Tab>
          ))}
        </TabList>
        {areaResponse?.results?.map((item) => (
          <TabPanel
            name={item.id}
          >
            <div className={styles.actions}>
              <h3>
                Area {item?.area_num}: {item?.title}
              </h3>
            </div>
            <CustomActivityInput
              id={item.id}
            />
          </TabPanel>
        ))}
        <div className={styles.actions}>
          <Button
            name={undefined}
            variant="secondary"
            onClick={undefined}
            disabled={undefined}
          >
            Back
          </Button>
          <div className={styles.actions}>
            <Button
              name={undefined}
              variant="secondary"
              onClick={undefined}
              disabled={undefined}
            >
              Next
            </Button>
            <div className={styles.actions}>
              <Button
                name={undefined}
                variant="secondary"
                onClick={undefined}
                disabled={undefined}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Tabs>
    </Container>
  );
}

export default Assessment;

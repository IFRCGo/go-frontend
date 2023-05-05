import React from 'react';
import LanguageContext from '#root/languageContext';
import Tabs from '#components/Tabs';
import TabList from '#components/Tabs/TabList';
import Tab from '#components/Tabs/Tab';
import TabPanel from '#components/Tabs/TabPanel';
import Container from '#components/Container';
import { ListResponse, useLazyRequest, useRequest } from '#utils/restRequest';
import ProgressBar from '#components/ProgressBar';
import ExpandableContainer from '#components/ExpandableContainer';
import { _cs } from '@togglecorp/fujs';
import Button from '#components/Button';
import { Area, Component, PerOverviewFields } from '../common';
import { EntriesAsList, PartialForm, SetBaseValueArg, useForm } from '@togglecorp/toggle-form';
import { prioritizationSchema } from '../usePerFormOptions';
import useAlert from '#hooks/useAlert';
import ComponentsInput from './ComponentInput';

import styles from './styles.module.scss';

type Value = PartialForm<PerOverviewFields>;

interface Props {
  className?: string;
  initialValue: Value;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  onValueSet: (value: SetBaseValueArg<Value>) => void;
  perId?: string;
  onSubmitSuccess?: (result: Component) => void;
}
type StepTypes = 'assessment' | 'prioritization';

function Assessment(props: Props) {
  const {
    className,
    perId,
    onSubmitSuccess,
    initialValue,
  } = props;
  const alert = useAlert();

  const {
    value,
    setFieldValue: onValueChange,
    setValue: onValueSet,
  } = useForm(prioritizationSchema, { value: {} });

  const { strings } = React.useContext(LanguageContext);
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

  const {
    pending: perSubmitPending,
    trigger: submitRequest,
  } = useLazyRequest({
    url: perId ? `api/v2/updatemultipleperforms/${perId}/` : 'api/v2/updatemultipleperforms/',
    method: perId ? 'PUT' : 'POST',
    body: ctx => ctx,
    onSuccess: (response) => {
      alert.show(
        strings.perFormSaveRequestSuccessMessage,
        { variant: 'success' },
      );

      // if (!perId) {
      //   window.setTimeout(
      //     () => history.push(`/new-per/${response?.id}/edit/`),
      //     250,
      //   );
      // }
      //  else {
      //   handlePerLoad(response);
      // }
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
          {strings.perFormSaveRequestFailureMessage}
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

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    const isCurrentTabValid = (['orientation_document']);

    if (!isCurrentTabValid) {
      return;
    }

    setCurrentStep(newStep);
  }, []);

  const handleSubmitButtonClick = React.useCallback(() => {
    if (currentStep === 'assessment') {
      const nextStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'prioritization'>]: Exclude<StepTypes, 'assessment'>;
      } = {
        assessment: 'prioritization',
      };
      submitRequest(value as Component);
      handleTabChange(nextStepMap[currentStep]);
    }
  }, []);

  console.warn('value', value);

  const tabs = (areaResponse?.results.length ?? 0) + 1;

  const [currentStep, setCurrentStep] = React.useState(1);

  const handleNextTab = () => {
    setCurrentStep((currentStep + 1) % tabs);
  };

  const handlePrevTab = () => {
    setCurrentStep((currentStep - 1 + tabs) % tabs);
  };

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
        <TabList
          className={styles.tabList}
        >
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
            key={item.id}
          >
            <div className={styles.actions}>
              <h3>
                Area {item?.area_num}: {item?.title}
              </h3>
            </div>
            <ComponentsInput
              id={item.id}
              onValueChange={onValueChange}
              value={value}
            />
          </TabPanel>
        ))}
        <div className={styles.actions}>
          <Button
            name={undefined}
            variant='secondary'
            onClick={handlePrevTab}
            disabled={undefined}
          >
            Back
          </Button>
          <div className={styles.actions}>
            <Button
              name={undefined}
              variant='secondary'
              onClick={handleNextTab}
              disabled={undefined}
            >
              Next
            </Button>
            <div className={styles.actions}>
              <Button
                name={undefined}
                variant='secondary'
                onClick={handleSubmitButtonClick}
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

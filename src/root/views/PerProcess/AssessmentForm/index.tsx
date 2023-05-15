import React, { useContext, useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';
import { EntriesAsList, PartialForm, useForm, useFormArray } from '@togglecorp/toggle-form';
import LanguageContext from '#root/languageContext';
import { ListResponse, useLazyRequest, useRequest } from '#utils/restRequest';
import useAlert from '#hooks/useAlert';

import { assessmentSchema } from '../usePerProcessOptions';
import Tabs from '#components/Tabs';
import TabList from '#components/Tabs/TabList';
import Tab from '#components/Tabs/Tab';
import TabPanel from '#components/Tabs/TabPanel';
import Container from '#components/Container';
import ProgressBar from '#components/ProgressBar';
import ExpandableContainer from '#components/ExpandableContainer';
import Button from '#components/Button';
import { Area, PerAssessmentForm } from '../common';
import ComponentInput from './ComponentInput';

import styles from './styles.module.scss';

type Value = PartialForm<PerAssessmentForm>;

interface Props {
  className?: string;
  perId?: string;
}

function AssessmentForm(props: Props) {
  const {
    className,
    perId,
  } = props;

  const {
    value,
    setFieldValue,
  } = useForm(
    assessmentSchema,
    { value: {} }
  );

  const minArea = 1;
  const maxArea = 5;

  const { strings } = useContext(LanguageContext);

  const alert = useAlert();

  const [currentStep, setCurrentStep] = React.useState("1");

  const {
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
    },
    onFailure: ({
      value: {
        messageForNotification,
        formErrors,
      },
      debugMessage,
    }) => {
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

  const handleTabChange = useCallback((newStep: string) => {
    setCurrentStep(Number(newStep));
  }, []);

  /* Rename to handleSubmitCancel */
  const handleButtonCancel = useCallback(() => {
    console.warn('Cancelling submit');
  }, []);

  const handleSubmitButtonClick = useCallback(() => {
    alert.show(
      <p className={styles.alertMessage}>
        <strong>
          {strings.perFormSubmitAssessmentTitle}
          <br />
        </strong>
        {strings.perFormSubmitAssessmentDescription}
        <div className={styles.alertButtons}>
          <Button
            name='cancel'
            variant='secondary'
            type='reset'
            onClick={handleButtonCancel}
          >
            Cancel
          </Button>
          <Button
            name='submit'
            variant='secondary'
            type='submit'
            onClick={undefined}
          >
            Save
          </Button>
        </div>
      </p>,
      {
        variant: 'warning',
      }
    );
  }, [alert, handleButtonCancel, strings]);

  const noOfAreas = (areaResponse?.results.length ?? 0) + 1;

  const handleNextTab = () => {
    setCurrentStep(Math.min(currentStep + 1, noOfAreas));
  };

  const handlePrevTab = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const {
    setValue: setComponentValue,
    removeValue: removeComponentValue,
  } = useFormArray('components', setFieldValue);

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
        value={String(currentStep)}
        variant='primary'
      >
        <TabList
          className={styles.tabList}
        >
          {areaResponse?.results?.map((item) => (
            <Tab
              name={String(item.id)}
              step={item?.area_num}
              errored={undefined}
            >
              Area {item?.area_num}: {item?.title}
            </Tab>
          ))}
        </TabList>
        {areaResponse?.results?.map((area) => (
          <TabPanel
            name={String(area.id)}
            key={area.id}
          >
            <ComponentInput
              id={area.id}
              onChange={setComponentValue}
              onRemove={removeComponentValue}
              value={value?.components?.find(component => component.componentId === area.id)}
            />
          </TabPanel>
        ))}
        <div className={styles.actions}>
          {currentStep > minArea &&
            <Button
              name={undefined}
              variant='secondary'
              onClick={handlePrevTab}
              disabled={undefined}
            >
              Back
            </Button>
          }
          <div className={styles.actions}>
            {currentStep < maxArea &&
              <Button
                name={undefined}
                variant='secondary'
                onClick={handleNextTab}
                disabled={undefined}
              >
                Next
              </Button>
            }
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

export default AssessmentForm;

import React, { useContext, useCallback } from 'react';
import { isNotDefined, _cs } from '@togglecorp/fujs';
import { EntriesAsList, PartialForm, SetValueArg, useForm, useFormArray, useFormObject } from '@togglecorp/toggle-form';
import LanguageContext from '#root/languageContext';
import { ListResponse, useLazyRequest, useRequest } from '#utils/restRequest';
import useAlert from '#hooks/useAlert';

import usePerProcessOptions, { assessmentSchema } from '../usePerProcessOptions';
import Tabs from '#components/Tabs';
import TabList from '#components/Tabs/TabList';
import Tab from '#components/Tabs/Tab';
import TabPanel from '#components/Tabs/TabPanel';
import Container from '#components/Container';
import ProgressBar from '#components/ProgressBar';
import ExpandableContainer from '#components/ExpandableContainer';
import Button from '#components/Button';
import { Area, Component, PerAssessmentForm } from '../common';
import scrollToTop from '#utils/scrollToTop';
import SelectInput from '#components/SelectInput';
import QuestionInput from './QuestionInput';

import styles from './styles.module.scss';

type Value = PerAssessmentForm;
type InputValue = PartialForm<Value>;

interface Props {
  className?: string;
  perId?: string;
  onChange: (value: SetValueArg<InputValue>) => void;
  // onRemove: (index: number) => void;
  index: number | string;
  value: InputValue | undefined | null;
}

function AssessmentForm(props: Props) {
  const {
    className,
    perId,
    onChange,
    index,
    value,
  } = props;

  const {
    error: formError,
    validate,
    setFieldValue: onValueChange,
    setError: onErrorSet,
  } = useForm(assessmentSchema, { value: {} });

  const {
    formStatusOptions,
  } = usePerProcessOptions(value);

  const minArea = 1;
  const maxArea = 5;

  const { strings } = useContext(LanguageContext);

  const alert = useAlert();

  const [currentAreaStep, setAreaCurrentStep] = React.useState("1");

  const {
    response: areaResponse,
  } = useRequest<ListResponse<Area>>({
    url: 'api/v2/per-formarea/',
  });

  const {
    pending: fetchingComponents,
    response: componentResponse,
  } = useRequest<ListResponse<Component>>({
    url: `api/v2/per-formcomponent/?area_id=${currentAreaStep}`,
  });

  const {
    response: questionResponse,
  } = useRequest<ListResponse<PerAssessmentForm>>({
    url: `api/v2/per-formquestion/?component=&area_id=${currentAreaStep}`,
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


  const handlePerTabChange = useCallback((newStep: string) => {
    scrollToTop();
    setAreaCurrentStep(Number(newStep));
  }, []);

  const handleAreaTabChange = useCallback((newStep: string) => {
    setAreaCurrentStep(Number(newStep));
  }, []);

  const handleSubmitCancel = useCallback(() => {
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
            onClick={handleSubmitCancel}
          >
            Cancel
          </Button>
          <Button
            name='submit'
            variant='secondary'
            type='submit'
            onClick={handlePerTabChange}
          >
            Save
          </Button>
        </div>
      </p>,
      {
        variant: 'warning',
      }
    );
  }, [alert, handleSubmitCancel, strings, handlePerTabChange]);

  const noOfAreas = (areaResponse?.results.length ?? 0) + 1;

  const handleNextTab = () => {
    setAreaCurrentStep(Math.min(currentAreaStep + 1, noOfAreas));
  };

  const handlePrevTab = () => {
    setAreaCurrentStep(Math.max(currentAreaStep - 1, 1));
  };
  const onFieldChange = useFormObject(index, onChange, () => ({ component_id: index }));

  const {
    setValue: setBenchmarkValue,
    removeValue: removeBenchmarkValue,
  } = useFormArray('component_responses', onFieldChange);

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
        onChange={handleAreaTabChange}
        value={String(currentAreaStep)}
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
        {areaResponse?.results?.map((component) => (
          <TabPanel
            name={String(component.id)}
            key={component.id}
          >
            {componentResponse?.results.map((cr, i) => (
              <ExpandableContainer
                className={_cs(styles.customActivity, styles.errored)}
                heading={`Component ${i + 1}: ${cr?.title}`}
                headingSize='small'
                sub
                actions={
                  <SelectInput
                    className={styles.improvementSelect}
                    name={"status" as const}
                    onChange={onValueChange}
                    options={formStatusOptions}
                    value={value?.status}
                  />
                }
              >
                {questionResponse?.results.map((question, i) => (
                  <QuestionInput
                    key={question.id}
                    name={question.id}
                    index={i}
                    onChange={setBenchmarkValue}
                    // onRemove={removeBenchmarkValue}
                    value={question}
                  // index={value?.component_responses?.filter(Boolean)?.findIndex(res => res.component_id === component.id)}
                  // value={value?.component_responses?.filter(Boolean)?.find(res => res.component_id === component.id)}
                  />
                ))}
                {/* <div className={styles.dot} /> */}
              </ExpandableContainer>
            ))}
          </TabPanel>
        ))}
        <div className={styles.actions}>
          {currentAreaStep > minArea &&
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
            {currentAreaStep < maxArea &&
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

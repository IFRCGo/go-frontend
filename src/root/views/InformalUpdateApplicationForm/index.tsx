import React from 'react';
import { isDefined, listToMap } from '@togglecorp/fujs';
import type { match as Match } from 'react-router-dom';
import type {
  History,
  Location
} from 'history';
import { Link } from 'react-router-dom';
import {
  getErrorObject,
  PartialForm,
  useForm,
  accumulateErrors,
  ObjectError,
} from '@togglecorp/toggle-form';

import Page from '#components/Page';
import Button, { useButtonFeatures } from '#components/Button';
import LanguageContext from '#root/languageContext';
import TabList from '#components/Tabs/TabList';
import Tab from '#components/Tabs/Tab';
import Tabs from '#components/Tabs';
import Container from '#components/Container';
import NonFieldError from '#components/NonFieldError';
import TabPanel from '#components/Tabs/TabPanel';
import useAlert from '#hooks/useAlert';
import { useLazyRequest } from '#utils/restRequest';

import ContextOverview from './ContextOverview';
import FocalPoints from './FocalPoint';
import ActionsOverview from './ActionOverview';

import {
  InformalUpdateFields,
  InformalUpdateAPIFields,
  transformFormFieldsToAPIFields,
  contextFields,
  actionsFields,
  focalFields
} from './common';
import
useInformalUpdateFormOptions,
{
  schema
}
  from './useInformalUpdateFormOptions';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  match: Match<{ id?: string }>;
  history: History;
  location: Location;
}
function scrollToTop() {
  window.setTimeout(() => {
    window.scrollTo({
      top: Math.min(145, window.scrollY),
      left: 0,
      behavior: 'smooth',
    });
  }, 0);
}

type StepTypes = 'context' | 'action' | 'focal';
const stepTypesToFieldsMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in StepTypes]: (keyof InformalUpdateFields)[];
} = {
  context: contextFields,
  action: actionsFields,
  focal: focalFields
};

const defaultFormValues: PartialForm<InformalUpdateFields> = {
  country_district: [],
};

function InformalUpdateForm(props: Props) {
  const {
    className,
    // location,
    history,
    match,
  } = props;
  const alert = useAlert();
  const { id } = match.params;

  const { strings } = React.useContext(LanguageContext);

  const {
    value,
    error,
    setFieldValue: onValueChange,
    validate,
    setError: onErrorSet,
    setValue: onValueSet,
  } = useForm(schema, defaultFormValues);

  const {
    countryOptions,
    disasterTypeOptions,
    fetchingCountries,
    fetchingDistricts,
    districtOptions,
    fetchingDisasterTypes,
    yesNoOptions,
    shareWithOptions,
    orgGroupedActionForCurrentReport,
  } = useInformalUpdateFormOptions(value);

  const [currentStep, setCurrentStep] = React.useState<StepTypes>('context');
  const [fileIdToUrlMap, setFileIdToUrlMap] = React.useState<Record<number, string>>({});
  const submitButtonLabel = currentStep === 'focal' ? strings.informalUpdateSaveButtonLabel : strings.informalUpdateContinueButtonLabel;
  const shouldDisabledBackButton = currentStep === 'context';

  const erroredTabs = React.useMemo(() => {
    const tabs: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      [key in StepTypes]: boolean;
    } = {
      context: false,
      action: false,
      focal: false
    };

    const tabKeys = (Object.keys(tabs)) as StepTypes[];
    tabKeys.forEach((tabKey) => {
      const currentFields = stepTypesToFieldsMap[tabKey];
      const currentFieldsMap = listToMap(currentFields, d => d, d => true);

      const erroredFields = Object.keys(getErrorObject(error) ?? {}) as (keyof InformalUpdateFields)[];
      const hasError = erroredFields.some(d => currentFieldsMap[d]);
      tabs[tabKey] = hasError;
    });

    return tabs;
  }, [error]);


  const validateCurrentTab = React.useCallback((exceptions: (keyof InformalUpdateFields)[] = []) => {
    const validationError = getErrorObject(accumulateErrors(value, schema));
    const currentFields = stepTypesToFieldsMap[currentStep];
    const exceptionsMap = listToMap(exceptions, d => d, d => true);

    if (!validationError) {
      return true;
    }

    const currentTabErrors = listToMap(
      currentFields.filter(field => (!exceptionsMap[field] && !!validationError?.[field])),
      field => field,
      field => validationError?.[field]
    ) as ObjectError<InformalUpdateFields>;

    const newError: typeof error = {
      ...currentTabErrors,
    };

    onErrorSet(newError);

    const hasError = Object.keys(currentTabErrors).some(d => !!d);
    return !hasError;
  }, [value, currentStep, onErrorSet]);


  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    scrollToTop();
    const isCurrentTabValid = validateCurrentTab(['title']);

    if (!isCurrentTabValid) {
      return;
    }
    setCurrentStep(newStep);
  }, [validateCurrentTab]);

  const {
    pending: informalUpdateSubmitPending,
    trigger: submitRequest,
  } = useLazyRequest<InformalUpdateAPIFields, Partial<InformalUpdateAPIFields>>({
    url: 'api/v2/informal-update/',
    method: 'POST',
    body: ctx => ctx,
    onSuccess: (response) => {
      alert.show(
        strings.informalUpdateFormRedirectMessage,
        { variant: 'success' },
      );
      window.setTimeout(
        () => history.push('/emergencies'),
        250,
      );
    },
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.fieldReportFormErrorLabel}
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

  const submitInformalUpdate = React.useCallback(() => {
    const result = validate();

    if (result.errored) {
      onErrorSet(result.error);
    } else {
      const apiFields = transformFormFieldsToAPIFields(result.value as InformalUpdateFields);

      submitRequest(apiFields);
    }

  }, [validate, onErrorSet, submitRequest]);

  const handleSubmitButtonClick = React.useCallback(() => {
    scrollToTop();
    const isCurrentTabValid = validateCurrentTab(['title']);

    if (!isCurrentTabValid) {
      return;
    }

    if (currentStep === 'focal') {
      submitInformalUpdate();
    } else {
      const nextStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'focal'>]: Exclude<StepTypes, 'context'>;
      } = {
        context: 'action',
        action: 'focal',
      };

      handleTabChange(nextStepMap[currentStep]);
    }
  }, [validateCurrentTab, currentStep, handleTabChange, submitInformalUpdate]);

  const handleBackButtonClick = React.useCallback(() => {
    if (currentStep !== 'context') {
      const prevStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'context'>]: Exclude<StepTypes, 'focal'>;
      } = {
        action: 'context',
        focal: 'action',
      };

      handleTabChange(prevStepMap[currentStep]);
    }
  }, [handleTabChange, currentStep]);

  const exportLinkProps = useButtonFeatures({
    variant: 'secondary',
    children: strings.informalUpdateFormExportLabel,
  });

  console.log({ value });



  return (
    <Tabs
      disabled={false}
      onChange={handleTabChange}
      value={currentStep}
      variant="step"
    >
      <Page
        className={className}
        actions={(
          <>
            {isDefined(id) && (
              <Link
                to={`/dref-application/${id}/export/`}
                {...exportLinkProps}
              />
            )}
            <Button
              name={undefined}
              onClick={submitInformalUpdate}
              type="submit"
            >
              {strings.informalUpdateFormSaveButtonLabel}
            </Button>
          </>
        )}
        title={strings.informalUpdateFormPageTitle}
        heading={strings.informalUpdateFormPageHeading}
        info={(
          <TabList className={styles.tableList}>
            <Tab
              name="context"
              step={1}
              errored={erroredTabs['context']}
            >
              {strings.informalUpdateTabContextLabel}
            </Tab>
            <Tab
              name="action"
              step={2}
              errored={erroredTabs['action']}
            >
              {strings.informalUpdateTabActionLabel}
            </Tab>
            <Tab
              name="focal"
              step={3}
              errored={erroredTabs['focal']}
            >
              {strings.informalUpdateTabFocalLabel}
            </Tab>
          </TabList>
        )}
      >
        <Container>
          <NonFieldError
            error={error}
            message={strings.informalUpdateFormFieldGeneralError}
          />
        </Container>
        <TabPanel name="context">
          <ContextOverview
            error={error}
            onValueChange={onValueChange}
            value={value}
            disasterTypeOptions={disasterTypeOptions}
            countryOptions={countryOptions}
            fetchingCountries={fetchingCountries}
            fetchingDisasterTypes={fetchingDisasterTypes}
            fileIdToUrlMap={fileIdToUrlMap}
            setFileIdToUrlMap={setFileIdToUrlMap}
            onValueSet={onValueSet}
            onCreateAndShareButtonClick={submitInformalUpdate}
            fetchingDistricts={fetchingDistricts}
            districtOptions={districtOptions}
          />
        </TabPanel>
        <TabPanel name="action">
          <ActionsOverview
            error={error}
            onValueChange={onValueChange}
            value={value}
            yesNoOptions={yesNoOptions}
            onValueSet={onValueSet}
            actionOptions={orgGroupedActionForCurrentReport}
          />
        </TabPanel>
        <TabPanel name="focal">
          <FocalPoints
            error={error}
            onValueChange={onValueChange}
            value={value}
            yesNoOptions={yesNoOptions}
            onValueSet={onValueSet}
            shareWithOptions={shareWithOptions}
          />
        </TabPanel>
        <div className={styles.actions}>
          <Button
            name={undefined}
            variant="secondary"
            onClick={handleBackButtonClick}
            disabled={shouldDisabledBackButton}
          >
            {strings.informalUpdateBackButtonLabel}
          </Button>
          <Button
            name={undefined}
            variant="secondary"
            onClick={handleSubmitButtonClick}
            type="submit"
            disabled={informalUpdateSubmitPending}
          >
            {submitButtonLabel}
          </Button>
        </div>
      </Page>
    </Tabs>
  );
}

export default InformalUpdateForm;

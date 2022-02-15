import React from 'react';
import { isDefined, listToMap, randomString } from '@togglecorp/fujs';
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
import { useLazyRequest, useRequest } from '#utils/restRequest';

import Context from './Context';
import FocalPoints from './FocalPoint';
import ActionsInput from './ActionsInput';

import {
  InformalUpdateFields,
  InformalUpdateAPIFields,
  InformalUpdateAPIResponseFields,
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
import BlockLoading from '#components/block-loading';

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
  country_district: [{
    clientId: randomString(),
  }],
  references: [{
    clientId: randomString(),
  }],
  actions_taken: [
    { organization: 'NTLS' },
    { organization: 'IFRC' },
    { organization: 'RCRC' },
    { organization: 'GOV' },
  ],
};

function InformalUpdateForm(props: Props) {
  const {
    className,
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
    actionOptionsMap,
    countryOptions,
    disasterTypeOptions,
    districtOptions,
    fetchingActions,
    fetchingCountries,
    fetchingDisasterTypes,
    fetchingDistricts,
    fetchingShareWithOptions,
    shareWithOptions,
  } = useInformalUpdateFormOptions(value);

  const [currentStep, setCurrentStep] = React.useState<StepTypes>('context');
  const [fileIdToUrlMap, setFileIdToUrlMap] = React.useState<Record<number, string>>({});
  const submitButtonLabel = currentStep === 'focal' ? strings.informalUpdateSaveButtonLabel : strings.informalUpdateContinueButtonLabel;
  const shouldDisabledBackButton = currentStep === 'context';

  const {
    pending: informalUpdatePending,
    response: InformalUpdateResponse
  } = useRequest<InformalUpdateAPIResponseFields>({
    skip: !id,
    url: `api/v2/informal-update/${id}`,
    onSuccess: (response) => {
      onValueSet({
        ...response,

        country_district: response?.country_district?.map((cd) => ({
          ...cd,
          clientId: String(cd.id)
        })),

        references: response?.references?.map((ref) => ({
          ...ref,
          clientId: String(ref.id)
        })),
      });
    },

    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.informalUpdateFormLoadRequestFailureMessage}
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
    }
  });

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
    const isCurrentTabValid = validateCurrentTab([]);

    if (!isCurrentTabValid) {
      return;
    }
    setCurrentStep(newStep);
  }, [validateCurrentTab]);

  const {
    pending: informalUpdateSubmitPending,
    trigger: submitRequest,
  } = useLazyRequest<InformalUpdateAPIResponseFields, Partial<InformalUpdateAPIFields>>({
    url: id ? `api/v2/informal-update/${id}/` : 'api/v2/informal-update/',
    method: id ? 'PUT' : 'POST',
    body: ctx => ctx,
    onSuccess: (response) => {
      alert.show(
        strings.informalUpdateFormRedirectMessage,
        { variant: 'success' },
      );
      window.setTimeout(
        () => window.location.reload(),
        250,
      );
    },
    onFailure: ({
      value: {
        messageForNotification,
        formErrors,
      },
      debugMessage,
    }) => {
      onErrorSet(formErrors);
      alert.show(
        <p>
          {strings.informalUpdateFormSaveRequestFailureMessage}
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
      const finalValue = transformFormFieldsToAPIFields(result.value);
      submitRequest(finalValue);
    }

  }, [validate, onErrorSet, submitRequest]);

  const handleSubmitButtonClick = React.useCallback(() => {
    scrollToTop();
    const isCurrentTabValid = validateCurrentTab([]);

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

  // Auto generate title
  React.useEffect(() => {
    if (!isDefined(value.country_district) || !isDefined(value.hazard_type)) {
      return;
    }

    const date = `${(new Date().getMonth() + 1)} / ${(new Date().getFullYear())}`;

    // TODO: simplify this
    const countryNameTitle = value.country_district?.flatMap((item) => {
      return countryOptions.find((x) => x.value === item?.country)?.label ?? ' ';
    }).reduce((item, name) => {
      return `${item} - ${name}`;
    });

    const hazardTitle = disasterTypeOptions.find((x) => x.value === value?.hazard_type)?.label ?? ' ';
    const title = `${countryNameTitle} - ${hazardTitle}  ${date}`;

    onValueChange(title, 'title' as const);
  }, [value, disasterTypeOptions, countryOptions, onValueChange]);

  const pending = fetchingCountries
    || fetchingDistricts
    || fetchingDisasterTypes
    || fetchingActions
    || fetchingShareWithOptions
    || informalUpdateSubmitPending
    || informalUpdatePending;

  const failedToLoadInformalUpdate = !pending && isDefined(id) && !InformalUpdateResponse;

  return (
    <Tabs
      disabled={failedToLoadInformalUpdate}
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
        {pending ? (
          <Container>
            <BlockLoading />
          </Container>
        ) :
          failedToLoadInformalUpdate ? (
            <Container
              contentClassName={styles.errorMessage}
            >
              <h3>
                {strings.informalUpdateFormLoadErrorTitle}
              </h3>
              <p>
                {strings.informalUpdateFormLoadErrorDescription}
              </p>
              <p>
                {strings.informalUpdateFormLoadErrorHelpText}
              </p>
            </Container>

          ) : (
            <>
              <Container>
                <NonFieldError
                  error={error}
                  message={strings.informalUpdateFormFieldGeneralError}
                />
              </Container>
              <TabPanel name="context">
                <Context
                  error={error}
                  onValueChange={onValueChange}
                  value={value}
                  disasterTypeOptions={disasterTypeOptions}
                  countryOptions={countryOptions}
                  fetchingCountries={fetchingCountries}
                  fetchingDisasterTypes={fetchingDisasterTypes}
                  fileIdToUrlMap={fileIdToUrlMap}
                  setFileIdToUrlMap={setFileIdToUrlMap}
                  onCreateAndShareButtonClick={submitInformalUpdate}
                  fetchingDistricts={fetchingDistricts}
                  districtOptions={districtOptions}
                />
              </TabPanel>
              <TabPanel name="action">
                <ActionsInput
                  error={error}
                  onValueChange={onValueChange}
                  value={value}
                  actionOptionsMap={actionOptionsMap}
                />
              </TabPanel>
              <TabPanel name="focal">
                <FocalPoints
                  error={error}
                  onValueChange={onValueChange}
                  value={value}
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
            </>
          )
        }
      </Page>
    </Tabs>
  );
}

export default InformalUpdateForm;

import React from 'react';
import type { History, Location } from 'history';
import {
  isDefined,
  listToMap,
} from '@togglecorp/fujs';
import useAlert from '#hooks/useAlert';
import LanguageContext from '#root/languageContext';
import { EapsFields } from './common';
import Button from '#components/Button';
import {
  EapsApiFields,
  overviewFields,
  eventDetailsFields,
  contactFields,
} from './common';
import {
  useLazyRequest, useRequest,
} from '#utils/restRequest';
import type { match as Match } from 'react-router-dom';

import Page from '#components/Page';
import Tab from '#components/Tabs/Tab';
import TabList from '#components/Tabs/TabList';
import TabPanel from '#components/Tabs/TabPanel';
import Tabs from '#components/Tabs';
import EapOverview from './EapOverview';
import Contacts from './Contacts';
import EarlyAction from './EarlyAction';
import {
  useForm,
  getErrorObject,
  PartialForm,
  accumulateErrors,
  ObjectError,
} from '@togglecorp/toggle-form';
import useEapFormOptions, { schema } from './useEapFormOptions';
import styles from './styles.module.scss';

const defaultFormValues: PartialForm<EapsFields> = {
  country: [],
  sectors: [],
  early_actions_indicators: [],
};

interface EapsResponseFields {
  id: number;
}

export function getDefinedValues<T extends Record<string, any>>(o: T): Partial<T> {
  type Key = keyof T;
  const keys = Object.keys(o) as Key[];
  const definedValues: Partial<T> = {};
  keys.forEach((key) => {
    if (isDefined(o[key])) {
      definedValues[key] = o[key];
    }
  });

  return definedValues;
}

type StepTypes = 'eapOverview' | 'earlyActions' | 'contacts';
const stepTypesToFieldsMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in StepTypes]: (keyof EapsFields)[];
} = {
  eapOverview: overviewFields,
  earlyActions: eventDetailsFields,
  contacts: contactFields,
};

interface Props {
  className?: string;
  match: Match<{ eapId?: string }>;
  history: History;
  location: Location;
}

function EapApplication(props: Props) {
  const {
    className,
    match,
    history,
  } = props;

  const alert = useAlert();
  const { eapId } = match.params;
  const { strings } = React.useContext(LanguageContext);

  const {
    value,
    error,
    setFieldValue: onValueChange,
    validate,
    setError: onErrorSet,
    setValue: onValueSet,
  } = useForm(schema, { value: defaultFormValues });

  const {
    countryOptions,
    fetchingEapDetails,
    disasterTypeOptions,
    fetchingCountries,
    fetchingDisasterTypes,
    statusOptions,
    earlyActionIndicatorsOptions,
    sectorsOptions,
    fetchingDistricts,
    districtOptions,
    disasterCategoryOptions,
  } = useEapFormOptions(value);

  const [fileIdToUrlMap, setFileIdToUrlMap] = React.useState<Record<number, string>>({});

  const [currentStep, setCurrentStep] = React.useState<StepTypes>('eapOverview');
  const submitButtonLabel = currentStep === 'contacts' ? strings.drefFormSaveButtonLabel : strings.drefFormContinueButtonLabel;
  const shouldDisabledBackButton = currentStep === 'eapOverview';

  const erroredTabs = React.useMemo(() => {
    const tabs: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      [key in StepTypes]: boolean;
    } = {
      eapOverview: false,
      earlyActions: false,
      contacts: false,
    };

    const tabKeys = (Object.keys(tabs)) as StepTypes[];
    tabKeys.forEach((tabKey) => {
      const currentFields = stepTypesToFieldsMap[tabKey];
      const currentFieldsMap = listToMap(currentFields, d => d, d => true);

      const erroredFields = Object.keys(getErrorObject(error) ?? {}) as (keyof EapsFields)[];
      const hasError = erroredFields.some(d => currentFieldsMap[d]);
      tabs[tabKey] = hasError;
    });

    return tabs;
  }, [error]);

  const {
    pending: eapSubmitPending,
    trigger: submitRequest,
  } = useLazyRequest<EapsResponseFields, Partial<EapsApiFields>>({
    url: eapId ? `api/v2/eap/${eapId}/` : `api/v2/eap/`,
    method: eapId ? 'PUT' : 'POST',
    body: ctx => ctx,
    onSuccess: (response) => {
      alert.show(
        strings.drefFormSaveRequestSuccessMessage,
        { variant: 'success' },
      );
      if (!eapId) {
        window.setTimeout(
          () => history.push(`/eap-application/${response?.id}/edit/`),
          250,
        );
      }
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
          {strings.drefFormSaveRequestFailureMessage}
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
  const validateCurrentTab = React.useCallback((exceptions: (keyof EapsFields)[] = []) => {
    const validationError = getErrorObject(accumulateErrors(value, schema, value, undefined));
    const currentFields = stepTypesToFieldsMap[currentStep];
    const exceptionsMap = listToMap(exceptions, d => d, d => true);

    if (!validationError) {
      return true;
    }

    const currentTabErrors = listToMap(
      currentFields.filter(field => (!exceptionsMap[field] && !!validationError?.[field])),
      field => field,
      field => validationError?.[field]
    ) as ObjectError<EapsFields>;

    const newError: typeof error = {
      ...currentTabErrors,
    };

    onErrorSet(newError);

    const hasError = Object.keys(currentTabErrors).some(d => !!d);
    return !hasError;
  }, [value, currentStep, onErrorSet]);

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    const isCurrentTabValid = validateCurrentTab(['eap_number']);

    if (!isCurrentTabValid) {
      return;
    }

    setCurrentStep(newStep);
  }, [validateCurrentTab]);

  const submitEap = React.useCallback(() => {
    const result = validate();

    if (result.errored) {
      onErrorSet(result.error);
    } else if (result.value) {
      const body = {
        ...result.value,
      };
      submitRequest(body as EapsApiFields);
    }
  }, [submitRequest, validate, onErrorSet]);

  const handleSubmitButtonClick = React.useCallback(() => {

    const isCurrentTabValid = validateCurrentTab(['eap_number']);

    if (!isCurrentTabValid) {
      return;
    }

    if (currentStep === 'contacts') {
      submitEap();
    } else {
      const nextStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'contacts'>]: Exclude<StepTypes, 'eapOverview'>;
      } = {
        eapOverview: 'earlyActions',
        earlyActions: 'contacts',
      };

      handleTabChange(nextStepMap[currentStep]);
    }
  }, [validateCurrentTab, currentStep, handleTabChange, submitEap]);

  const handleBackButtonClick = React.useCallback(() => {
    if (currentStep !== 'eapOverview') {
      const prevStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'eapOverview'>]: Exclude<StepTypes, 'contacts'>;
      } = {
        earlyActions: 'eapOverview',
        contacts: 'earlyActions',
      };

      handleTabChange(prevStepMap[currentStep]);
    }
  }, [handleTabChange, currentStep]);

  const pending = fetchingCountries
    || fetchingDisasterTypes
    || fetchingEapDetails
    || eapSubmitPending;

  const failedToLoadEap = !pending && isDefined(eapId);

  return (
    <Tabs
      disabled={undefined}
      onChange={handleTabChange}
      value={currentStep}
      variant="step"
    >
      <Page
        className={className}
        actions={(
          <>
            <Button
              name={undefined}
              onClick={undefined}
            >
              {strings.eapsFormSaveButtonLabel}
            </Button>
          </>
        )}
        title={strings.eapsFormPageTitle}
        heading={strings.eapsFormPageHeading}
        description={strings.eapsFormPageDescription}
        info={(
          <TabList className={styles.tabList}>
            <Tab
              name="eapOverview"
              step={1}
              errored={erroredTabs['eapOverview']}
            >
              {strings.eapsFormTabEapOverview}
            </Tab>
            <Tab
              name="earlyActions"
              step={2}
              errored={erroredTabs['earlyActions']}
            >
              {strings.eapsFormTabEarlyActions}
            </Tab>
            <Tab
              name="contacts"
              step={3}
              errored={erroredTabs['contacts']}
            >
              {strings.eapsFormTabContacts}
            </Tab>
          </TabList>
        )}
      >
        <TabPanel name="eapOverview">
          <EapOverview
            error={undefined}
            onValueChange={onValueChange}
            value={value}
            fetchingDistricts={fetchingDistricts}
            districtOptions={districtOptions}
            statusOptions={statusOptions}
            disasterTypeOptions={disasterTypeOptions}
            disasterCategoryOptions={disasterCategoryOptions}
            onValueSet={onValueSet}
            fetchingDisasterTypes={fetchingDisasterTypes}
            fetchingCountries={fetchingCountries}
            countryOptions={countryOptions}
            fetchingEapDetails={fetchingEapDetails}
            fileIdToUrlMap={fileIdToUrlMap}
            setFileIdToUrlMap={setFileIdToUrlMap}
          />
        </TabPanel>
        <TabPanel name="earlyActions">
          <EarlyAction
            error={undefined}
            earlyActionIndicatorOptions={earlyActionIndicatorsOptions}
            sectorsOptions={sectorsOptions}
            onValueChange={onValueChange}
            value={value}
          />
        </TabPanel>
        <TabPanel name="contacts">
          <Contacts
            error={undefined}
            onValueChange={onValueChange}
            value={value}
          />
        </TabPanel>
        <div className={styles.actions}>
          <Button
            name={undefined}
            variant="secondary"
            onClick={handleBackButtonClick}
            disabled={shouldDisabledBackButton}
          >
            {strings.eapsFormBackButtonLabel}
          </Button>
          <Button
            name={undefined}
            variant="secondary"
            onClick={handleSubmitButtonClick}
          >
            {submitButtonLabel}
          </Button>
        </div>
      </Page>
    </Tabs>
  );
}

export default EapApplication;

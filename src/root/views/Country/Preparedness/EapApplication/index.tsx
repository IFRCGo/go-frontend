import React from 'react';
import type { History, Location } from 'history';
import {
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
  useLazyRequest,
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
} from '@togglecorp/toggle-form';
import useEapFormOptions, { schema } from './useEapFormOptions';
import styles from './styles.module.scss';

const defaultFormValues: PartialForm<EapsFields> = {
};

interface EapsResponseFields {
  id: number;
}

interface Props {
  className?: string;
  match: Match<{ eapId?: string }>;
  history: History;
  location: Location;
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
    fetchingCountries,
    countryOptions,
  } = useEapFormOptions(value);

  const [currentStep, setCurrentStep] = React.useState<StepTypes>('eapOverview');
  const submitButtonLabel = currentStep === 'contacts' ? strings.drefFormSaveButtonLabel : strings.drefFormContinueButtonLabel;
  const shouldDisabledBackButton = currentStep === 'eapOverview';

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    setCurrentStep(newStep);
  }, []);

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
            fetchingCountries={fetchingCountries}
            countryOptions={countryOptions}
          />
        </TabPanel>
        <TabPanel name="earlyActions">
          <EarlyAction />
        </TabPanel>
        <TabPanel name="contacts">
          <Contacts />
        </TabPanel>
        <div className={styles.actions}>
          <Button
            name={undefined}
            variant="secondary"
            onClick={undefined}
            disabled={shouldDisabledBackButton}
          >
            {strings.eapsFormBackButtonLabel}
          </Button>
          <Button
            name={undefined}
            variant="secondary"
            onClick={undefined}
          >
            {submitButtonLabel}
          </Button>
        </div>
      </Page>
    </Tabs>
  );
}

export default EapApplication;

import React, { useCallback } from 'react';
import {
  listToMap,
} from '@togglecorp/fujs';
import useAlert from '#hooks/useAlert';
import LanguageContext from '#root/languageContext';
import { EapsFields } from './common';
import Button from '#components/Button';
import {
  overviewFields,
  eventDetailsFields,
  contactFields,
} from './common';

import Page from '#components/Page';
import Tab from '#components/Tabs/Tab';
import TabList from '#components/Tabs/TabList';
import TabPanel from '#components/Tabs/TabPanel';
import Tabs from '#components/Tabs';
import EapOverview from './EapOverview';

import styles from './styles.module.scss';
import { any } from 'prop-types';

function scrollToTop() {
  window.setTimeout(() => {
    window.scrollTo({
      top: Math.min(145, window.scrollY),
      left: 0,
      behavior: 'smooth',
    });
  }, 0);
}

interface Props {
  className?: string;
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
    history,
  } = props;

  const alert = useAlert();
  const { strings } = React.useContext(LanguageContext);

  // const {
  //   value,
  //   error,
  //   setFieldValue: onValueChange,
  //   validate,
  //   setError: onErrorSet,
  //   setValue: onValueSet,
  // } = useForm(schema, { value: defaultFormValues });
  const [currentStep, setCurrentStep] = React.useState<StepTypes>('eapOverview');
  const submitButtonLabel = currentStep === 'contacts' ? strings.drefFormSaveButtonLabel : strings.drefFormContinueButtonLabel;
  const shouldDisabledBackButton = currentStep === 'eapOverview';

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    scrollToTop();
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

      // const erroredFields = Object.keys(getErrorObject(error) ?? {}) as (keyof EapsFields)[];
      // const hasError = erroredFields.some(d => currentFieldsMap[d]);
      // tabs[tabKey] = hasError;
    });

    return tabs;
  }, []);

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
          <EapOverview />
        </TabPanel>
        <TabPanel name="earlyActions">
          <h5>This is action</h5>
        </TabPanel>
        <TabPanel name="contact">
          <h5>This is contact</h5>
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

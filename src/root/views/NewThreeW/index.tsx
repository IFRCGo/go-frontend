import React from 'react';
import { _cs } from '@togglecorp/fujs';
import type { Location, History } from 'history';

import Page from '#components/Page';
import InputSection from '#components/InputSection';
import BreadCrumb from '#components/breadcrumb';
import Container from '#components/Container';
import ThreeWForm from '#components/ThreeWForm';
import EmergencyThreeWForm from '#components/EmergencyThreeWForm';
import SegmentInput from '#components/SegmentInput';
import useInputState from '#hooks/useInputState';

import LanguageContext from '#root/languageContext';
import {
  Project,
  EmergencyProjectResponse,
  StringValueOption,
} from '#types';

import styles from './styles.module.scss';

const operationTypeOptions: StringValueOption[] = [
  { value: 'program', label: 'Program' },
  { value: 'response_activity', label: 'Response Activity' },
];

interface Props {
  className?: string;
  history: History;
  location: Location<{
    operationType?: string;
    initialValue?: EmergencyProjectResponse;
  }>,
}

function NewThreeW(props: Props) {
  const { strings } = React.useContext(LanguageContext);
  const {
    className,
    history,
    location,
  } = props;

  const { state } = location;

  const [operationType, setOperationType] = useInputState<string | undefined>(state?.operationType ?? 'program');

  const handleProgramSubmitSuccess = React.useCallback((result: Project) => {
    if (history?.push) {
      const { project_country: countryId } = result;
      history.push(`/countries/${countryId}#3w`);
    }
  }, [history]);

  const handleEmergencyResponseSubmitSuccess = React.useCallback((result: EmergencyProjectResponse) => {
    if (history?.push) {
      const { event: eventId } = result;
      history.push(`/emergency/${eventId}#activities`);
    }
  }, [history]);

  const crumbs= React.useMemo(() => [
    {link: location?.pathname, name: strings.breadCrumbNewThreeW},
    {link: '/', name: strings.breadCrumbHome},
  ], [strings.breadCrumbHome, strings.breadCrumbNewThreeW, location]);

  return (
    <Page
      className={_cs(styles.newThreeW, className)}
      title={strings.newThreeWPageTitle}
      heading={strings.newThreeWPageHeading}
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
    >
      <Container
        visibleOverflow
        heading="Operation Details"
      >
        <InputSection className={styles.segementInputWrapper}>
          <SegmentInput
            name={undefined}
            options={operationTypeOptions}
            keySelector={d => d.value}
            labelSelector={d => d.label}
            value={operationType}
            onChange={setOperationType}
          />
        </InputSection>
        {operationType === 'program' && (
          <ThreeWForm
            onSubmitSuccess={handleProgramSubmitSuccess}
            className={styles.threeWProgram}
          />
        )}
        {operationType === 'response_activity' && (
          <EmergencyThreeWForm
            onSubmitSuccess={handleEmergencyResponseSubmitSuccess}
            initialValue={state?.initialValue}
          />
        )}
      </Container>
    </Page>
  );
}

export default NewThreeW;

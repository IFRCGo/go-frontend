import React from 'react';
import {
  EntriesAsList,
  PartialForm,
  Error,
  getErrorObject,
} from '@togglecorp/toggle-form';
import InputSection from '#components/InputSection';
import Container from '#components/Container';

import NumberInput from '#components/NumberInput';
import SelectInput from '#components/SelectInput';
import TextArea from '#components/TextArea';
import languageContext from '#root/languageContext';
import { EarlyAction } from '../common';

import styles from './styles.module.scss';

type EarlyActionsValue = PartialForm<EarlyAction>;

export interface Props {
  error: Error<EarlyActionsValue> | undefined;
  onValueChange: (...entries: EntriesAsList<EarlyActionsValue>) => void;
  value: EarlyActionsValue;
}

function EapFields(props: Props) {
const {strings} = React.useContext(languageContext);

const {
  error: formError,
  onValueChange,
  value,
} = props;

const error = React.useMemo(
  () => getErrorObject(formError),
  [formError],
);

  return (
    <Container
      visibleOverflow 
      heading={strings.eapsFieldReportFormTitle}
    >
      <InputSection
        title="Health"
      >
      </InputSection>
      <InputSection>
        <NumberInput
          label={strings.eapsFieldReportFormBudgetPerSectorLabel}
          name={"budget_per_sector" as const}
          value={value.budget_per_sector}
          onChange={onValueChange}
          error={error?.budget_per_sector}
        />
      </InputSection>
      <div className={styles.sectorContainer}>
        <InputSection>
          <SelectInput
            label={strings.eapsFieldReportFormIndicatorLabel}
            name={"indicators" as const}
            value={value.indicators}
            onChange={onValueChange}
            error={error?.indicators}
          />
          <NumberInput
            label={strings.eapsFieldReportFormIndicatorValueLabel}
            name={"indicator_value" as const}
            value={value.indicator_value}
            onChange={onValueChange}
            error={error?.indicator_value}
          />
        </InputSection>
      </div>
      <div className={styles.riskContainer}>
        <InputSection>
          <TextArea
            label={strings.eapsFieldReportFormPrioritizedRiskLabel}
            name={"prioritized_risk" as const}
            value={value.prioritized_risks}
            onChange={onValueChange}
            error={error?.prioritized_risks}
          />
          <NumberInput
            label={strings.eapsFieldReortFormTargetedPeopleLabel}
            name={"targeted_people" as const}
            value={value.targeted_people}
            onChange={onValueChange}
            error={error?.targeted_people}
          />
        </InputSection>
      </div>
      <div className={styles.sector}>
        <InputSection>
          <TextArea
            label={strings.eapsFieldReportFormEarlyActionLabel}
            name={"early_action" as const}
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
        </InputSection>
        <InputSection>
          <TextArea
            label={strings.eapsFieldReportFormReadinessActivitiesLabel}
            name={"readiness_activities" as const}
            value={value.readiness_activities}
            onChange={onValueChange}
            error={error?.readiness_activities}
          />
        </InputSection>
        <InputSection>
          <TextArea
            label={strings.eapsFieldReportFormPrePositioningActivitiesLabel}
            name={"pre-positioning_activities" as const}
            value={value.prepositioning_activities}
            onChange={onValueChange}
            error={error?.prepositioning_activities}
          />
        </InputSection>
      </div>
    </Container>
  );
}

export default EapFields;

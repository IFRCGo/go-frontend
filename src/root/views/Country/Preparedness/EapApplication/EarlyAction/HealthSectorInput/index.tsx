import React from 'react';
import languageContext from '#root/languageContext';
import {
  IoAdd,
  IoTrash,
} from 'react-icons/io5';
import {
  PartialForm,
  Error,
  EntriesAsList,
  getErrorObject,
} from '@togglecorp/toggle-form';

import InputSection from '#components/InputSection';
import NumberInput from '#components/NumberInput';
import Button from '#components/Button';
import SearchSelectInput from '#components/SearchSelectInput';
import BulletTextArea from '#components/BulletTextArea';

import styles from './styles.module.scss';
import { EapsFields } from '../../common';

type Value = PartialForm<EapsFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
}

function HealthSectorInput(props: Props) {
  const { strings } = React.useContext(languageContext);

  const {
    error: formError,
    onValueChange,
    value,
  } = props;

  const error = getErrorObject(formError);

  return (
    <>
      <div className={styles.healthSectorInput}>
        <InputSection
          className={styles.inputSection}
          title={strings.eapsFormHealth}
        >
        </InputSection>
        <InputSection
          className={styles.inputSection}
          title={strings.eapsFormBudgetPerSector}
        >
          <NumberInput
            name="budget_per_sector"
            value={value?.budget_per_sector}
            onChange={onValueChange}
            error={error?.budget_per_sector}
          />
          <Button
            className={styles.removeButton}
            name={undefined}
            onClick={undefined}
            variant="action"
          >
            <IoTrash />
          </Button>
        </InputSection>
      </div>
      <div className={styles.sector}>
        <SearchSelectInput
          label={strings.eapsFormSectorIndicator}
          className={styles.indicator}
          name="priortised_risk"
          value={onValueChange}
          onChange={undefined}
          error={undefined}
        />
        <NumberInput
          label={strings.eapsFormSectorIndicatorValue}
          className={styles.indicator}
          name="indicator"
          placeholder={strings.eapsFormSectorPlaceholder}
          value={undefined}
          onChange={undefined}
          error={undefined}
        />
        <InputSection
          className={styles.indicator}
        >
          <Button
            name={undefined}
            onClick={undefined}
            variant="secondary"
          >
            <IoAdd />
            {strings.eapsFormSectorAddIndicator}
          </Button>
        </InputSection>
      </div>
      <InputSection
        normalDescription
        description={(
          <>
            <BulletTextArea
              className={styles.addRiskButton}
              label={strings.eapsFormPriotisedRisk}
              value={undefined}
              placeholder={strings.eapsFormListTheRisk}
              onChange={undefined}
              error={undefined}
              name={undefined}>
            </BulletTextArea>
            <Button
              name={undefined}
              onClick={undefined}
              variant="secondary"
            >
              <IoAdd />
              {strings.eapsFormAddRisk}
            </Button>
          </>
        )}
      >
        <div className={styles.targetPeople}>
          <NumberInput
            label={strings.eapsFormTargetPeople}
            name="targeted_people"
            placeholder={strings.eapsFormSectorPlaceholder}
            value={value?.targeted_people}
            onChange={onValueChange}
            error={error?.targeted_people}
          />
          <div className={styles.earlyActions}>
            <BulletTextArea
              label={strings.eapsFormEarlyActions}
              name="early_actions"
              placeholder={strings.eapsFormListTheEarlyAction}
              value={value?.early_actions}
              onChange={onValueChange}
              error={error?.early_actions}
            />
            <Button
              name={undefined}
              onClick={undefined}
              variant="secondary"
            >
              <IoAdd />
              {strings.eapsFormAddEarlyAction}
            </Button>
          </div>
          <BulletTextArea
            label={strings.eapsFormReadinessActivities}
            name="readiness_activities"
            placeholder={strings.eapsFormListTheReadinessActivities}
            value={value?.readiness_activities}
            onChange={onValueChange}
            error={error?.readiness_activities}
          />
          <BulletTextArea
            label={strings.eapsFormPrePositioningActivities}
            name="prepositioning_activities"
            placeholder="List the pre-positioning activities (if any)"
            value={value?.prepositioning_activities}
            onChange={onValueChange}
            error={error?.prepositioning_activities}
          />
        </div>
      </InputSection>
    </>
  );
}

export default HealthSectorInput;
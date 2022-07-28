import React from 'react';
import { randomString } from '@togglecorp/fujs';
import {
  IoAdd,
  IoTrash,
} from 'react-icons/io5';
import {
  PartialForm,
  Error,
  EntriesAsList,
  getErrorObject,
  useFormArray,
} from '@togglecorp/toggle-form';

import languageContext from '#root/languageContext';
import InputSection from '#components/InputSection';
import NumberInput from '#components/NumberInput';
import Button from '#components/Button';
import BulletTextArea from '#components/BulletTextArea';

import Indicators from './Indicators';
import Actions from './Actions';
import {
  Action,
  EapsFields,
  Indicator,
  NumericValueOption,
  Risk,
} from '../../common';
import Risks from './Risks';

import styles from './styles.module.scss';

type Value = PartialForm<EapsFields>;
type SetValueArg<T> = T | ((value: T) => T);

interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  onRemove: (index: number) => void;
  earlyActionIndicatorsOptions: NumericValueOption[];
  index: number;
}

function HealthSectorInput(props: Props) {
  const { strings } = React.useContext(languageContext);

  const [risk, setRisk] = React.useState<number | undefined>();
  const [action, setAction] = React.useState<number | undefined>();

  const {
    error: formError,
    index,
    onRemove,
    onValueChange,
    value,
    earlyActionIndicatorsOptions,
  } = props;

  const {
    setValue: onIndicatorsChange,
    removeValue: onIndicatorsRemove,
  } = useFormArray<'indicators', PartialForm<Indicator>>(
    'indicators',
    onValueChange,
  );

  type IndicatorsItem = typeof value.indicators;

  const handleIndicatorAddButtonClick = React.useCallback(() => {
    const clientId = randomString();
    const newList: PartialForm<Indicator> = {
      clientId,
    };

    onValueChange(
      (oldValue: PartialForm<IndicatorsItem>) => (
        [...(oldValue ?? []), newList]
      ),
      'indicators' as const,
    );
  }, [onValueChange]);

  const {
    setValue: onRiskChange,
    removeValue: onRiskRemove,
  } = useFormArray<'prioritized_risks', PartialForm<Risk>>(
    'prioritized_risks',
    onValueChange,
  );

  type RiskItem = typeof value.prioritized_risks;
  
  const handleRiskAddButtonClick = React.useCallback(() => {
    const clientId = randomString();
    const newList: PartialForm<Risk> = {
      clientId,
    };

    onValueChange(
      (oldValue: PartialForm<RiskItem>) => (
        [...(oldValue ?? []), newList]
      ),
      'prioritized_risks' as const,
    );
    setRisk(undefined);
  }, [onValueChange, setRisk]);

  const {
    setValue: onActionChange,
    removeValue: onActionRemove,
  } = useFormArray<'actions', PartialForm<Action>>(
    'actions',
    onValueChange,
  );

  type ActionItem = typeof value.early_act;
  const handleActionAddButtonClick = React.useCallback(() => {
    const clientId = randomString();
    const newList: PartialForm<Action> = {
      clientId,
    };

    onValueChange(
      (oldValue: PartialForm<ActionItem>) => (
        [...(oldValue ?? []), newList]
      ),
      'actions' as const,
    );
    setAction(undefined);
  }, [onValueChange, setAction]);

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
            name={index}
            onClick={onRemove}
            variant="action"
          >
            <IoTrash />
          </Button>
        </InputSection>
      </div>
      <div className={styles.sector}>
        {value.indicators?.map((indicator, i) => (
          <Indicators
            key={indicator.clientId}
            index={i}
            value={indicator} 
            onChange={onIndicatorsChange}
            onRemove={onIndicatorsRemove}
            earlyActionIndicatorsOptions={earlyActionIndicatorsOptions}
            error={getErrorObject(error?.indicators)}
          />
        ))}
        <InputSection
          className={styles.indicator}
        >
          <Button
            name={undefined}
            onClick={handleIndicatorAddButtonClick}
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
            {value?.prioritized_risks?.map((prioritise, i) => (
              <Risks
                key={prioritise.clientId}
                index={i}
                value={prioritise}
                onChange={onRiskChange}
                onRemove={onRiskRemove}
                error={getErrorObject(error?.prioritized_risks)}
              />
            ))}
            <Button
              name={undefined}
              onClick={handleRiskAddButtonClick}
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
            {value?.actions?.map((action, i) => (
              <Actions
                key={action.clientId}
                index={i}
                value={action}
                onChange={onActionChange}
                onRemove={onActionRemove}
                error={getErrorObject(error?.early_act)}
              />
            ))}
            <Button
              name={action}
              onClick={handleActionAddButtonClick}
              variant="secondary"
            >
              <IoAdd />
              Add early action
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
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
  useFormArray,
  useFormObject,
} from '@togglecorp/toggle-form';
import {
  EapsFields,
  Indicator,
  NumericValueOption,
  Sectors,
  StringValueOption,
} from '../../common';

import InputSection from '#components/InputSection';
import NumberInput from '#components/NumberInput';
import Button from '#components/Button';
import BulletTextArea from '#components/BulletTextArea';
import SelectInput from '#components/SelectInput';

import styles from './styles.module.scss';
import { randomString } from '@togglecorp/fujs';

type Value = PartialForm<EapsFields>;
type SetValueArg<T> = T | ((value: T) => T);

const defaultSectorValue: PartialForm<Sectors> = {
  value: randomString(),
};

interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  onChange: (value: SetValueArg<PartialForm<Sectors>>, index: number) => void;
  onRemove: (index: number) => void;
  earlyActionIndicatorsOptions: NumericValueOption[];
  index: number;
  showNewFieldOperational: boolean;
  sectorOptions: StringValueOption[];
}

function HealthSectorInput(props: Props) {
  const { strings } = React.useContext(languageContext);
  const [indicator, setIndicator] = React.useState<number | undefined>();
  const {
    error: formError,
    onChange,
    index,
    onRemove,
    onValueChange,
    earlyActionIndicatorsOptions,
    value,
  } = props;

  const onFieldChange = useFormObject(index, onChange, defaultSectorValue);

  const {
    setValue: onIndicatorChange,
    removeValue: onIndicatorRemove,
  } = useFormArray<'indicator', PartialForm<Indicator>>(
    'indicator',
    onFieldChange,
  );

  type Sectors = typeof value.sectors;
  const handleIndicatorAddButtonClick = React.useCallback((title) => {
    const key = randomString();
    const newList: PartialForm<IndicatorType> = {
      key,
      value,
    };

    onFieldChange(
      (oldValue: PartialForm<Indicator>) => (
        [...(oldValue ?? []), newList]
      ),
      'indicator' as const,
    );
    setIndicator(undefined);
  }, [onFieldChange, setIndicator]);

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
        <SelectInput
          label={strings.eapsFormSectorIndicator}
          className={styles.indicator}
          name="early_actions_indicators"
          options={earlyActionIndicatorsOptions}
          onChange={onFieldChange}
          value={value?.early_actions_indicators}
          error={error?.early_actions_indicators}
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
              name={indicator}
              onClick={handleIndicatorAddButtonClick}
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
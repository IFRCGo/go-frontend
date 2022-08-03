import React from 'react';
import { randomString } from '@togglecorp/fujs';
import {
  IoAdd,
  IoTrash,
} from 'react-icons/io5';
import {
  PartialForm,
  Error,
  getErrorObject,
  useFormArray,
  useFormObject,
} from '@togglecorp/toggle-form';

import languageContext from '#root/languageContext';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import NumberInput from '#components/NumberInput';
import Button from '#components/Button';
import ListView from '#components/ListView';
import { SetValueArg } from '#utils/common';
import BulletTextArea from '#components/BulletTextArea';

import ActionInput, { Props as ActionInputProps } from './ActionInput';
import RisksInput, { Props as RisksInputProps } from './RisksInput';
import IndicatorInput, { Props as IndicatorInputProps } from './IndicatorInput';
import {
  Action,
  Indicator,
  StringValueOption,
  EarlyAction,
  Risk,
} from '../../common';

import styles from './styles.module.scss';

type Value = PartialForm<EarlyAction>;

type RiskValue = PartialForm<Risk>;
type ActionValue = PartialForm<Action>;
type IndicatorValue = PartialForm<Indicator>;

const defaultEarlyActionValue: Value = {
  clientId: randomString(),
};

function riskKeySelector(value: RiskValue) {
  return value.clientId as string;
}
function actionKeySelector(value: ActionValue) {
  return value.clientId as string;
}
function indicatorKeySelector(value: IndicatorValue) {
  return value.clientId as string;
}

export interface Props {
  error: Error<Value> | undefined;
  index: number;
  onRemove: (index: number) => void;
  onValueChange: (value: SetValueArg<Value>, index: number) => void;
  value: Value;
  earlyActionIndicatorsOptions: StringValueOption[];
}

function EarlyActionInput(props: Props) {
  const { strings } = React.useContext(languageContext);

  const [indicator, setIndicator] = React.useState<string | undefined>();
  const [risk, setRisk] = React.useState<string | undefined>();
  const [action, setAction] = React.useState<string | undefined>();

  const {
    error: formError,
    index,
    onRemove,
    onValueChange,
    value,
    earlyActionIndicatorsOptions,
  } = props;

  const onFieldChange = useFormObject(index, onValueChange, defaultEarlyActionValue);

  const handleIndicatorAddButtonClick = React.useCallback(() => {
    const newList: IndicatorValue = {
      clientId: randomString(),
    };

    onFieldChange(
      (oldValue: IndicatorValue[] | undefined) => (
        [...(oldValue ?? []), newList]
      ),
      'indicators' as const,
    );
  }, [onFieldChange]);

  const {
    setValue: setIndicatorValue,
    removeValue: removeIndicatorValue,
  } = useFormArray<'indicators', IndicatorValue>(
    'indicators',
    onFieldChange,
  );

  const handleRiskAddButtonClick = React.useCallback(() => {
    const newList: RiskValue = {
      clientId: randomString(),
    };

    onFieldChange(
      (oldValue: RiskValue[] | undefined) => (
        [...(oldValue ?? []), newList]
      ),
      'prioritized_risks' as const,
    );
  }, [onFieldChange]);

  const {
    setValue: setRiskValue,
    removeValue: removeRiskValue,
  } = useFormArray<'prioritized_risks', RiskValue>(
    'prioritized_risks',
    onFieldChange,
  );

  const handleActionAddButtonClick = React.useCallback(() => {
    const newList: ActionValue = {
      clientId:randomString(),
    };

    onFieldChange(
      (oldValue: ActionValue[] | undefined) => (
        [...(oldValue ?? []), newList]
      ),
      'actions' as const,
    );
  }, [onFieldChange]);

  const {
    setValue: setActionValue,
    removeValue: removeActionValue,
  } = useFormArray<'actions', IndicatorValue>(
    'actions',
    onFieldChange,
  );

  const indicatorRendererParams: (
    key: string, datum: IndicatorValue, index: number
  ) => IndicatorInputProps = (key, datum, index) => ({
    value: datum,
    onChange: setIndicatorValue,
    index,
    // error: error?.indicators?.[key],
    error: undefined,
    onRemove: removeIndicatorValue,
    earlyActionIndicatorsOptions,
  });

  const riskRendererParams: (
    key: string, datum: RiskValue, index: number
  ) => RisksInputProps = (key, datum, index) => ({
    value: datum,
    onChange: setRiskValue,
    index,
    error: undefined,
    onRemove: removeRiskValue,
  });

  const actionRendererParams: (
    key: string, datum: ActionValue, index: number
  ) => ActionInputProps = (key, datum, index) => ({
    value: datum,
    onChange: setActionValue,
    index,
    error: undefined,
    onRemove: removeActionValue,
  });

  const error = getErrorObject(formError);

  return (
    <Container
      sub
      heading={value?.sector}
      actions={(
        <Button
          className={styles.removeButton}
          name={index}
          onClick={onRemove}
          variant="action"
        >
          <IoTrash />
        </Button>
      )}
    >
      <InputSection
        className={styles.inputSection}
        title={strings.eapsFormBudgetPerSector}
      >
        <NumberInput
          name={"budget_per_sector" as const}
          value={value?.budget_per_sector}
          onChange={onFieldChange}
          error={error?.budget_per_sector}
        />
      </InputSection>
      <InputSection
        className={styles.indicator}>
        <ListView
          data={value?.indicators}
          renderer={IndicatorInput}
          keySelector={indicatorKeySelector}
          rendererParams={indicatorRendererParams}
          errored={!!error}
          pending={false}
          emptyMessage={false}
          pendingMessage="Loading data"
        />
        <Button
          name={indicator}
          onClick={handleIndicatorAddButtonClick}
          variant="secondary"
          icons={<IoAdd />}
        >
          {strings.eapsFormSectorAddIndicator}
        </Button>
      </InputSection>
      <InputSection
        normalDescription
        description={(
          <>
            <ListView
              data={value?.prioritized_risks}
              renderer={RisksInput}
              keySelector={riskKeySelector}
              rendererParams={riskRendererParams}
              errored={!!error}
              pending={false}
              emptyMessage={false}
              pendingMessage="Loading data"
            />
            <Button
              name={risk}
              onClick={handleRiskAddButtonClick}
              variant="secondary"
              icons={<IoAdd />}
            >
              {strings.eapsFormAddRisk}
            </Button>
          </>
        )}
      >
        <div className={styles.targetPeople}>
          <NumberInput
            label={strings.eapsFormTargetPeople}
            name={"targeted_people" as const}
            placeholder={strings.eapsFormSectorPlaceholder}
            value={value?.targeted_people}
            onChange={onFieldChange}
            error={error?.targeted_people}
          />
          <div className={styles.earlyActions}>
            <ListView
              data={value?.actions}
              renderer={ActionInput}
              keySelector={actionKeySelector}
              rendererParams={actionRendererParams}
              errored={!!error}
              pending={false}
              emptyMessage={false}
              pendingMessage="Loading data"
            />
          </div>
          <Button
            name={action}
            onClick={handleActionAddButtonClick}
            variant="secondary"
            icons={<IoAdd />}
          >
            {strings.eapsFormEarlyActions}
          </Button>
          <BulletTextArea
            label={strings.eapsFormReadinessActivities}
            name="readiness_activities"
            placeholder={strings.eapsFormListTheReadinessActivities}
            value={value?.readiness_activities}
            onChange={onFieldChange}
            error={error?.readiness_activities}
          />
          <BulletTextArea
            label={strings.eapsFormPrePositioningActivities}
            name="prepositioning_activities"
            placeholder="List the pre-positioning activities (if any)"
            value={value?.prepositioning_activities}
            onChange={onFieldChange}
            error={error?.prepositioning_activities}
          />
        </div>
      </InputSection>
    </Container>
  );
}

export default EarlyActionInput;

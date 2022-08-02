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
  useFormObject,
} from '@togglecorp/toggle-form';

import languageContext from '#root/languageContext';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import NumberInput from '#components/NumberInput';
import Button from '#components/Button';
import BulletTextArea from '#components/BulletTextArea';
import { ListResponse, useRequest } from '#utils/restRequest';
import ListView from '#components/ListView';
import { SetValueArg } from '#utils/common';

import IndicatorInput, {Props as IndicatorInputProps} from './IndicatorInput';
import Actions from './Actions';

import {
  Action,
  Indicator,
  StringValueOption,
  EarlyAction,
  EapFormFields,
  Risk,
} from '../../common';

import styles from './styles.module.scss';
import Risks from './Risks';

type Value = PartialForm<EarlyAction>;

type RiskValue = PartialForm<Risk>;
type ActionValue = PartialForm<Action>;
type IndicatorValue = PartialForm<Indicator>;

const defaultEarlyActionValue: Value = {
  clientId: randomString(),
};

function riskKeySelector(value: RiskValue) {
  return value.clientId;
}
function actionKeySelector(value: EapFormFields) {
  return value.id;
}
function indicatorKeySelector(value: IndicatorValue) {
  return value.clientId as string;
}

interface Props {
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
    const clientId = randomString();
    const newList: IndicatorValue = {
      clientId,
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

  // type RiskItem = typeof riskValue.risks;

  // const handleRiskAddButtonClick = React.useCallback(() => {
  //   const clientId = randomString();
  //   const newList: PartialForm<Risk> = {
  //     clientId,
  //   };

  //   onValueChange(
  //     (oldValue: PartialForm<RiskItem>) => (
  //       [...(oldValue ?? []), newList]
  //     ),
  //     'risks' as const,
  //   );
  // }, [onValueChange]);

  // type ActionItem = typeof actionValue.early_act;

  // const handleActionAddButtonClick = React.useCallback(() => {
  //   const clientId = randomString();
  //   const newList: PartialForm<Action> = {
  //     clientId,
  //   };

  //   onValueChange(
  //     (oldValue: PartialForm<ActionItem>) => (
  //       [...(oldValue ?? []), newList]
  //     ),
  //     'early_act' as const,
  //   );
  // }, [onValueChange]);

  // const RiskRendererParams = (_, datum: RiskValue) => ({ riskValue: datum });
  // const ActionRendererParams = (_, datum: ActionValue) => ({ actionValue: datum });
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

  const {
    pending: fetchingEapDetails,
    response: eapDetailsResponse,
  } = useRequest<ListResponse<EapFormFields>>({
    url: `api/v2/eap/`,
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
      <InputSection>
        <ListView
          data={value?.indicators}
          renderer={IndicatorInput}
          keySelector={indicatorKeySelector}
          rendererParams={indicatorRendererParams}
          errored={!!error}
          pending={fetchingEapDetails}
          emptyMessage="No data to display"
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
      {/*
      <InputSection
        normalDescription
        description={(
          <>
            <ListView
              data={eapDetailsResponse?.results}
              renderer={Risks}
              keySelector={riskKeySelector}
              rendererParams={RiskRendererParams}
              errored={!!error}
              pending={fetchingEapDetails}
              emptyMessage="No data to display"
              pendingMessage="Loading data"
            />
            <Button
              name={risk}
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
            <ListView
              data={eapDetailsResponse?.results}
              renderer={Actions}
              keySelector={actionKeySelector}
              rendererParams={ActionRendererParams}
              errored={!!error}
              pending={fetchingEapDetails}
              emptyMessage="No data to display"
              pendingMessage="Loading data"
            />
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
      */}
    </Container>
  );
}

export default EarlyActionInput;

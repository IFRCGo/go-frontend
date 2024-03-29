import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
  useMemo,
} from 'react';
import {
  isNotDefined,
  listToMap,
  randomString,
} from '@togglecorp/fujs';
import {
  PartialForm,
  Error,
  EntriesAsList,
  getErrorObject,
  useFormArray,
} from '@togglecorp/toggle-form';

import Container from '#components/Container';
import languageContext from '#root/languageContext';
import { sumSafe } from '#utils/common';
import InputSection from '#components/InputSection';
import TextArea from '#components/TextArea';
import NumberInput from '#components/NumberInput';
import InputLabel from '#components/InputLabel';
import { IoWarning } from 'react-icons/io5';
import SelectInput from '#components/SelectInput';
import Button from '#components/Button';
import RadioInput from '#components/RadioInput';
import RiskSecurityInput from '#views/DrefApplicationForm/Response/RiskSecurityInput';
import DREFFileInput from '#components/DREFFileInput';

import InterventionInput from './InterventionInput';
import {
  InterventionType,
  RiskSecurityType,
} from '../useDreFinalReportOptions';
import {
  booleanOptionKeySelector,
  BooleanValueOption,
  DrefFinalReportFields,
  Intervention,
  TYPE_IMMINENT,
  optionLabelSelector,
  RiskSecurityProps,
  StringValueOption,
  TYPE_ASSESSMENT,
} from '../common';

import styles from './styles.module.scss';

const emptyList: string[] = [];
type Value = PartialForm<DrefFinalReportFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  interventionOptions: StringValueOption[];
  fileIdToUrlMap: Record<number, string>;
  setFileIdToUrlMap?: Dispatch<SetStateAction<Record<number, string>>>;
  yesNoOptions: BooleanValueOption[];
  drefType?: number;
}

function Operation(props: Props) {
  const { strings } = useContext(languageContext);

  const {
    error: formError,
    onValueChange,
    interventionOptions,
    value,
    yesNoOptions,
    drefType,
    fileIdToUrlMap,
    setFileIdToUrlMap,
  } = props;

  const error = getErrorObject(formError);
  const isChangeInOperationalStrategy = value.change_in_operational_strategy;

  const {
    setValue: onRiskSecurityChange,
    removeValue: onRiskSecurityRemove,
  } = useFormArray<'risk_security', PartialForm<RiskSecurityProps>>(
    'risk_security',
    onValueChange,
  );

  type riskSecurity = typeof value.risk_security;

  const handleRiskSecurityAdd = React.useCallback(() => {
    const clientId = randomString();
    const newRiskSecurityList: PartialForm<RiskSecurityType> = {
      clientId,
    };

    onValueChange(
      (oldValue: PartialForm<riskSecurity>) => (
        [...(oldValue ?? []), newRiskSecurityList]
      ),
      'risk_security' as const,
    );
  }, [onValueChange]);

  const [intervention, setIntervention] = useState<string | undefined>();
  const {
    setValue: onInterventionChange,
    removeValue: onInterventionRemove,
  } = useFormArray<'planned_interventions', PartialForm<Intervention>>(
    'planned_interventions',
    onValueChange,
  );

  type Interventions = typeof value.planned_interventions;
  const handleInterventionAddButtonClick = useCallback((title?: string) => {
    const newInterventionItem: PartialForm<InterventionType> = {
      clientId: randomString(),
      title,
    };

    onValueChange(
      (oldValue: PartialForm<Interventions>) => (
        [...(oldValue ?? []), newInterventionItem]
      ),
      'planned_interventions' as const,
    );
    setIntervention(undefined);
  }, [onValueChange, setIntervention]);

  const interventionsIdentifiedMap = useMemo(() => (
    listToMap(
      value.planned_interventions,
      d => d.title ?? '',
      d => true
    )
  ), [value.planned_interventions]);

  const warnings = useMemo(() => {
    if (isNotDefined(value?.total_targeted_population)) {
      return emptyList;
    }

    const warningMessage = [];

    if (sumSafe([
      value?.women,
      value?.men,
      value?.girls,
      value?.boys,
    ]) !== value?.total_targeted_population) {
      warningMessage.push('Total targeted population is not equal to sum of other population fields');
    }

    return warningMessage;
  }, [
    value?.total_targeted_population,
    value?.women,
    value?.men,
    value?.girls,
    value?.boys,
  ]);

  const filteredInterventionOptions = useMemo(() => (
    interventionsIdentifiedMap ? interventionOptions.filter(n => !interventionsIdentifiedMap[n.value]) : []
  ), [interventionsIdentifiedMap, interventionOptions]);

  return (
    <>
      <Container
        heading={strings.finalReportObjectiveAndStrategy}
        className={styles.objectiveRationale}
      >
        <InputSection
          title={strings.finalReportObjectiveOperation}
        >
          <TextArea
            error={error?.operation_objective}
            name="operation_objective"
            onChange={onValueChange}
            value={value.operation_objective}
            placeholder={strings.drefFormObjectiveOperationPlaceholder}
          />
        </InputSection>
        <InputSection
          title={strings.finalReportResponseStrategyImplementation}
        >
          <TextArea
            name="response_strategy"
            onChange={onValueChange}
            value={value.response_strategy}
            error={error?.response_strategy}
            placeholder={strings.drefFormResponseRationalePlaceholder}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.finalReportTargetingStrategy}
        className={styles.targetingStrategy}
      >
        <InputSection
          title={strings.finalReportPeopleAssistedThroughOperation}
        >
          <TextArea
            label={strings.drefFormDescription}
            name="people_assisted"
            onChange={onValueChange}
            value={value.people_assisted}
            error={error?.people_assisted}
          />
        </InputSection>
        <InputSection
          title={strings.finalReportSelectionCriteria}
        >
          <TextArea
            label={strings.drefFormDescription}
            name="selection_criteria"
            onChange={onValueChange}
            value={value.selection_criteria}
            error={error?.selection_criteria}
          />
        </InputSection>
        <InputSection
          title={strings.finalReportChangeToOperationStrategy}
        >
          <RadioInput
            name={"change_in_operational_strategy" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.change_in_operational_strategy}
            onChange={onValueChange}
            error={error?.change_in_operational_strategy}
          />
        </InputSection>
        {isChangeInOperationalStrategy &&
          <InputSection
            title={strings.finalReportChangeToOperationStrategyExplain}
          >
            <TextArea
              label={strings.drefFormDescription}
              name="change_in_operational_strategy_text"
              onChange={onValueChange}
              value={value.change_in_operational_strategy_text}
              error={error?.change_in_operational_strategy_text}
            />
          </InputSection>
        }
      </Container>
      <Container
        heading={strings.finalReportTargetedPopulation}
        className={styles.assistedPopulation}
        description={(
          warnings?.map((m, i) => (
            <div
              key={i}
              className={styles.warning}
            >
              <IoWarning />
              {m}
            </div>
          ))
        )}
      >
        <InputSection
          title={strings.finalReportTargetedPopulation}
          multiRow
          twoColumn
        >
          <NumberInput
            label={strings.finalReportWomen}
            name="women"
            value={value.women}
            onChange={onValueChange}
            error={error?.women}
          />
          <NumberInput
            label={strings.finalReportMen}
            name="men"
            value={value.men}
            onChange={onValueChange}
            error={error?.men}
          />
          <NumberInput
            label={strings.finalReportGirls}
            name="girls"
            value={value.girls}
            onChange={onValueChange}
            error={error?.girls}
          />
          <NumberInput
            label={strings.finalReportBoys}
            name="boys"
            value={value.boys}
            onChange={onValueChange}
            error={error?.boys}
          />
          <NumberInput
            label={strings.drefFormTotal}
            name="total_targeted_population"
            value={value.total_targeted_population}
            onChange={onValueChange}
            error={error?.total_targeted_population}
          />
        </InputSection>
        <InputSection
          title={strings.finalReportEstimateResponse}
          multiRow
          twoColumn
        >
          <NumberInput
            label={strings.finalReportEstimatePeopleDisability}
            name="disability_people_per"
            value={value.disability_people_per}
            onChange={onValueChange}
            error={error?.disability_people_per}
          />
          <div className={styles.urbanToRural}>
            <InputLabel>
              {strings.finalReportEstimatedPercentage}
            </InputLabel>
            <div className={styles.inputs}>
              <NumberInput
                placeholder={strings.finalReportEstimatedUrban}
                name="people_per_urban"
                value={value.people_per_urban}
                onChange={onValueChange}
                error={error?.people_per_urban}
              />
              <NumberInput
                placeholder={strings.finalReportEstimatedLocal}
                name="people_per_local"
                value={value.people_per_local}
                onChange={onValueChange}
                error={error?.people_per_local}
              />
            </div>
          </div>
          <NumberInput
            label={strings.finalReportEstimatedDisplacedPeople}
            name="displaced_people"
            value={value.displaced_people}
            onChange={onValueChange}
            error={error?.displaced_people}
          />
          {
            drefType === TYPE_IMMINENT &&
            <NumberInput
              label={strings.finalReportPeopleTargetedWithEarlyActions}
              name="people_targeted_with_early_actions"
              value={value.people_targeted_with_early_actions}
              onChange={onValueChange}
              error={error?.people_targeted_with_early_actions}
            />
          }
        </InputSection>
      </Container>
      <Container
        heading={strings.drefFormRiskSecurity}
      >
        <InputSection
          title={strings.drefFormRiskSecurityPotentialRisk}
          description={drefType === TYPE_ASSESSMENT && strings.drefFormRiskSecurityPotentialRiskDescription}
          multiRow
          oneColumn
        >
          {value.risk_security?.map((rs, i) => (
            <RiskSecurityInput
              key={rs.clientId}
              index={i}
              value={rs}
              onChange={onRiskSecurityChange}
              onRemove={onRiskSecurityRemove}
              error={getErrorObject(error?.risk_security)}
            />
          ))}
          <div className={styles.actions}>
            <Button
              name={undefined}
              onClick={handleRiskSecurityAdd}
              variant="secondary"
            >
              {strings.drefFormRiskSecurityAddButton}
            </Button>
          </div>
        </InputSection>
        <InputSection
          title={strings.drefFormRiskSecuritySafetyConcern}
        >
          <TextArea
            name='risk_security_concern'
            value={value.risk_security_concern}
            error={error?.risk_security_concern}
            onChange={onValueChange}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.finalReportImplementation}
        className={styles.plannedIntervention}
      >
        <InputSection>
          <SelectInput
            name={undefined}
            onChange={setIntervention}
            value={intervention}
            label={strings.drefFormInterventionsLabel}
            options={filteredInterventionOptions}
          />
          <div className={styles.actions}>
            <Button
              variant="secondary"
              name={intervention}
              onClick={handleInterventionAddButtonClick}
              disabled={isNotDefined(intervention)}
            >
              Add
            </Button>
          </div>
        </InputSection>
        {value?.planned_interventions?.map((pi, i) => (
          <InterventionInput
            key={pi.clientId}
            index={i}
            value={pi}
            onChange={onInterventionChange}
            onRemove={onInterventionRemove}
            error={getErrorObject(error?.planned_interventions)}
            interventionOptions={interventionOptions}
          />
        ))}
      </Container>
      <Container
        heading={strings.finalReportFinancialReport}
      >
        <InputSection>
          <DREFFileInput
            accept=".pdf"
            name="financial_report"
            value={value.financial_report}
            onChange={onValueChange}
            error={error?.financial_report}
            fileIdToUrlMap={fileIdToUrlMap}
            setFileIdToUrlMap={setFileIdToUrlMap}
          >
            {strings.finalReportFinancialReportAttachment}
          </DREFFileInput>
        </InputSection>
        <InputSection title={strings.finalReportFinancialReportVariances}>
          <TextArea
            name="financial_report_description"
            value={value.financial_report_description}
            onChange={onValueChange}
            error={error?.financial_report_description}
          />
        </InputSection>
      </Container>
    </>
  );
}

export default Operation;

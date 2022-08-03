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
import DREFFileInput from '#components/DREFFileInput';
import RadioInput from '#components/RadioInput';

import { InterventionType } from '../useDreFinalReportOptions';
import {
  booleanOptionKeySelector,
  BooleanValueOption,
  DrefFinalReportFields,
  Intervention,
  ONSET_IMMINENT,
  optionLabelSelector,
  StringValueOption,
} from '../common';
import InterventionInput from './InterventionInput';

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
}

function Operation(props: Props) {
  const { strings } = useContext(languageContext);

  const {
    error: formError,
    onValueChange,
    interventionOptions,
    value,
    fileIdToUrlMap,
    setFileIdToUrlMap,
    yesNoOptions
  } = props;

  const error = getErrorObject(formError);
  const isImminentOnSet = value.type_of_onset === ONSET_IMMINENT;
  const isChangeInOperationalStrategy = value.change_in_operational_strategy;

  const [intervention, setIntervention] = useState<number | undefined>();
  const {
    setValue: onInterventionChange,
    removeValue: onInterventionRemove,
  } = useFormArray<'planned_interventions', PartialForm<Intervention>>(
    'planned_interventions',
    onValueChange,
  );

  type Interventions = typeof value.planned_interventions;
  const handleInterventionAddButtonClick = useCallback(() => {
    const clientId = randomString();
    const newInterventionItem: PartialForm<InterventionType> = {
      clientId,
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
    if (isNotDefined(value?.number_of_people_targeted)) {
      return emptyList;
    }

    const warningMessage = [];

    if (sumSafe([
      value?.women,
      value?.men,
      value?.girls,
      value?.boys,
    ]) !== value?.number_of_people_targeted) {
      warningMessage.push('Total targeted population is not equal to sum of other population fields');
    }

    return warningMessage;
  }, [
    value?.number_of_people_targeted,
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
        heading={strings.finalReportOperationReportTitle}
        className={styles.targetingStrategy}
      >
        <InputSection
          title={strings.finalReportPeopleAssistedThroughOperation}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
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
            label={strings.cmpActionDescriptionLabel}
            name="selection_criteria"
            onChange={onValueChange}
            value={value.selection_criteria}
            error={error?.selection_criteria}
          />
        </InputSection>
        <InputSection
          title={strings.finalReportProtectionGenderAndInclusion}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="entity_affected"
            onChange={onValueChange}
            value={value.entity_affected}
            error={error?.entity_affected}
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
              label={strings.cmpActionDescriptionLabel}
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
            isImminentOnSet &&
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
        heading={strings.finalReportImplementation}
        className={styles.plannedIntervention}
        visibleOverflow
      >
        <InputSection>
          <DREFFileInput
            accept=".pdf"
            error={error?.budget_file}
            fileIdToUrlMap={fileIdToUrlMap}
            label={strings.drefFormBudgetTemplateLabel}
            name="budget_file"
            onChange={onValueChange}
            setFileIdToUrlMap={setFileIdToUrlMap}
            showStatus
            value={value.budget_file}
          >
            {strings.drefFormBudgetTemplateUploadButtonLabel}
          </DREFFileInput>
        </InputSection>
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
    </>
  );
}

export default Operation;

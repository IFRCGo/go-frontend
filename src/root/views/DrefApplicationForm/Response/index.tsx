import React from 'react';
import {
  randomString,
  isNotDefined,
  listToMap,
} from '@togglecorp/fujs';
import {
  PartialForm,
  Error,
  EntriesAsList,
  useFormArray,
  getErrorObject,
} from '@togglecorp/toggle-form';
import { IoWarning } from 'react-icons/io5';

import Button from '#components/Button';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import NumberInput from '#components/NumberInput';
import SelectInput from '#components/SelectInput';
import TextArea from '#components/TextArea';
import InputLabel from '#components/InputLabel';
import DREFFileInput from '#components/DREFFileInput';
import LanguageContext from '#root/languageContext';

import { sumSafe } from '#utils/common';
import InterventionInput from './InterventionInput';
import {
  DrefFields,
  StringValueOption,
  Intervention,
  ONSET_IMMINENT,
} from '../common';
import { InterventionType } from '../useDrefFormOptions';

import styles from './styles.module.scss';

const emptyList: string[] = [];
type Value = PartialForm<DrefFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  interventionOptions: StringValueOption[];
  fileIdToUrlMap: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

function Response(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    error: formError,
    onValueChange,
    interventionOptions,
    fileIdToUrlMap,
    setFileIdToUrlMap,
    value,
  } = props;

  const error = getErrorObject(formError);

  const [intervention, setIntervention] = React.useState<number | undefined>();
  const {
    setValue: onInterventionChange,
    removeValue: onInterventionRemove,
  } = useFormArray<'planned_interventions', PartialForm<Intervention>>(
    'planned_interventions',
    onValueChange,
  );

  type Interventions = typeof value.planned_interventions;
  const handleInterventionAddButtonClick = React.useCallback((title) => {
    const clientId = randomString();
    const newList: PartialForm<InterventionType> = {
      clientId,
      title,
    };

    onValueChange(
      (oldValue: PartialForm<Interventions>) => (
        [...(oldValue ?? []), newList]
      ),
      'planned_interventions' as const,
    );
    setIntervention(undefined);
  }, [onValueChange, setIntervention]);

  const interventionsIdentifiedMap = React.useMemo(() => (
    listToMap(
      value.planned_interventions,
      d => d.title ?? '',
      d => true
    )
  ), [value.planned_interventions]);

  const warnings = React.useMemo(() => {
    if (isNotDefined(value?.total_targeted_population)) {
      return emptyList;
    }

    const w = [];

    if (value?.num_assisted !== value?.total_targeted_population) {
      w.push('Total targeted population is different from that in Operation Overview');
    }


    if (sumSafe([
      value?.women,
      value?.men,
      value?.girls,
      value?.boys,
    ]) !== value?.total_targeted_population) {
      w.push('Total targeted population is not equal to sum of other population fields');
    }

    return w;
  }, [
    value?.num_assisted,
    value?.women,
    value?.men,
    value?.girls,
    value?.boys,
    value?.total_targeted_population,
  ]);

  const filteredInterventionOptions = interventionsIdentifiedMap ? interventionOptions.filter(n => !interventionsIdentifiedMap[n.value]) : [];
  const isImminentOnset = value.type_of_onset === ONSET_IMMINENT;

  return (
    <>
      <Container
        heading={strings.drefFormTargetingStrategy}
        className={styles.targetingStrategy}
      >
        <InputSection
          title={strings.drefFormPeopleAssistedthroughOperation}
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
          title={!isImminentOnset ? strings.drefFormSelectionCriteria : strings.drefFormSelectionCriteriaRisk}
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
          title={strings.drefFormProtectionGenderAndInclusion}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="entity_affected"
            onChange={onValueChange}
            value={value.entity_affected}
            error={error?.entity_affected}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.drefFormAssistedPopulation}
        className={styles.assistedPopulation}
        description={(
          warnings?.map((w) => (
            <div className={styles.warning}>
              <IoWarning />
              {w}
            </div>
          ))
        )}
      >
        <InputSection
          title={strings.drefFormTargetedPopulation}
          multiRow
          twoColumn
        >
          <NumberInput
            label={strings.drefFormWomen}
            name="women"
            value={value.women}
            onChange={onValueChange}
            error={error?.women}
          />
          <NumberInput
            label={strings.drefFormMen}
            name="men"
            value={value.men}
            onChange={onValueChange}
            error={error?.men}
          />
          <NumberInput
            label={strings.drefFormGirls}
            name="girls"
            value={value.girls}
            onChange={onValueChange}
            error={error?.girls}
          />
          <NumberInput
            label={strings.drefFormBoys}
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
          title={strings.drefFormEstimateResponse}
          multiRow
          twoColumn
        >
          <NumberInput
            label={strings.drefFormEstimatePeopleDisability}
            name="disability_people_per"
            value={value.disability_people_per}
            onChange={onValueChange}
            error={error?.disability_people_per}
          />
          <div className={styles.urbanToRural}>
            <InputLabel>
              {strings.drefFormEstimatedPercentage}
            </InputLabel>
            <div className={styles.inputs}>
              <NumberInput
                placeholder={strings.drefFormEstimatedUrban}
                name="people_per_urban"
                value={value.people_per_urban}
                onChange={onValueChange}
                error={error?.people_per_urban}
              />
              <NumberInput
                placeholder={strings.drefFormEstimatedLocal}
                name="people_per_local"
                value={value.people_per_local}
                onChange={onValueChange}
                error={error?.people_per_local}
              />
            </div>
          </div>
          <NumberInput
            label={strings.drefFormEstimatedDisplacedPeople}
            name="displaced_people"
            value={value.displaced_people}
            onChange={onValueChange}
            error={error?.displaced_people}
          />
          {isImminentOnset &&
            <NumberInput
              label={strings.drefFormPeopleTargetedWithEarlyActions}
              name="people_targeted_with_early_actions"
              value={value.people_targeted_with_early_actions}
              onChange={onValueChange}
              error={error?.people_targeted_with_early_actions}
            />
          }
        </InputSection>
      </Container>
      <Container
        heading={strings.drefFormObjectiveAndStrategy}
        className={styles.objectiveRationale}
      >
        <InputSection
          title={strings.drefFormObjectiveOperation}
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
          title={strings.drefFormResponseRationale}
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
        heading={strings.drefFormSupportServices}
      >
        <InputSection
          title={strings.drefFormHumanResourceDescription}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="human_resource"
            onChange={onValueChange}
            value={value.human_resource}
            error={error?.human_resource}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormSurgePersonnelDeployed}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="surge_personnel_deployed"
            onChange={onValueChange}
            value={value.surge_personnel_deployed}
            error={error?.surge_personnel_deployed}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormLogisticCapacityOfNs}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="logistic_capacity_of_ns"
            onChange={onValueChange}
            value={value.logistic_capacity_of_ns}
            error={error?.logistic_capacity_of_ns}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormSafetyConcerns}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="safety_concerns"
            onChange={onValueChange}
            value={value.safety_concerns}
            error={error?.safety_concerns}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormPmerDescription}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="pmer"
            onChange={onValueChange}
            value={value.pmer}
            error={error?.pmer}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormCommunicationDescription}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="communication"
            onChange={onValueChange}
            value={value.communication}
            error={error?.communication}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.drefFormPlannedIntervention}
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
        {value?.planned_interventions?.map((n, i) => (
          <InterventionInput
            key={n.clientId}
            index={i}
            value={n}
            onChange={onInterventionChange}
            onRemove={onInterventionRemove}
            error={getErrorObject(error?.planned_interventions)}
            interventionOptions={interventionOptions}
            showNewFieldOperational={false} />
        ))}
      </Container>
    </>
  );
}

export default Response;

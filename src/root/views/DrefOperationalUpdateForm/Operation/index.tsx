import React from 'react';
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
import InterventionInput from '#views/DrefApplicationForm/Response/InterventionInput';

import { InterventionType } from '../useDrefOperationalUpdateOptions';
import {
  DrefOperationalUpdateFields,
  Intervention,
  StringValueOption,
} from '../common';

import styles from './styles.module.scss';

const emptyList: string[] = [];
type Value = PartialForm<DrefOperationalUpdateFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  interventionOptions: StringValueOption[];
  fileIdToUrlMap: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

function Operation(props: Props) {
  const { strings } = React.useContext(languageContext);

  const {
    error: formError,
    onValueChange,
    interventionOptions,
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
    if (isNotDefined(value?.number_of_people_targeted)) {
      return emptyList;
    }

    const w = [];

    if (sumSafe([
      value?.women,
      value?.men,
      value?.girls,
      value?.boys,
    ]) !== value?.number_of_people_targeted) {
      w.push('Total targeted population is not equal to sum of other population fields');
    }

    return w;
  }, [
    value?.number_of_people_targeted,
    value?.women,
    value?.men,
    value?.girls,
    value?.boys,
  ]);

  const filteredInterventionOptions = React.useMemo(() => (
    interventionsIdentifiedMap ? interventionOptions.filter(n => !interventionsIdentifiedMap[n.value]) : []
  ), [interventionsIdentifiedMap, interventionOptions]);

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
          title={strings.drefFormSelectionCriteria}
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
        heading={strings.drefFormTargetedPopulation}
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
          <NumberInput
            label={strings.drefFormPeopleTargetedWithEarlyActions}
            name="people_targeted_with_early_actions"
            value={value.people_targeted_with_early_actions}
            onChange={onValueChange}
            error={error?.people_targeted_with_early_actions}
          />
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
        heading={strings.drefOperationalUpdatePlannedIntervention}
        className={styles.plannedIntervention}
        visibleOverflow
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
        {value?.planned_interventions?.map((n, i) => (
          <InterventionInput
            key={n.clientId}
            index={i}
            value={n}
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

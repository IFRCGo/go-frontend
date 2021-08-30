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
} from '@togglecorp/toggle-form';

import Button from '#components/Button';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import NumberInput from '#components/NumberInput';
import SelectInput from '#components/SelectInput';
import TextArea from '#components/TextArea';
import LanguageContext from '#root/languageContext';

import InterventionInput from './InterventionInput';
import {
  DrefFields,
  StringValueOption,
  Intervention,
} from '../common';
import { InterventionType } from '../useDrefFormOptions';

import styles from './styles.module.scss';


type Value = PartialForm<DrefFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  interventionOptions: StringValueOption[];
}

function Response(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    error,
    onValueChange,
    interventionOptions,
    value,
  } = props;

  const [intervention, setIntervention] = React.useState<number | undefined>();
  const {
    onValueChange: onInterventionChange,
    onValueRemove: onInterventionRemove,
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
  const filteredInterventionOptions = interventionOptions.filter(n => !interventionsIdentifiedMap[n.value]);

  return (
    <>
      <Container
        heading={strings.targetingStrategy}
        className={styles.targetingStrategy}
      >
        <InputSection
          title={strings.peopleAssistedthroughOperation}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="people_assisted"
            onChange={onValueChange}
            value={value.people_assisted}
            error={error?.fields?.people_assisted}
            placeholder={strings.maxThreeHundredCharacters}
          />
        </InputSection>
        <InputSection
          title={strings.protectionGenderAndInclusion}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="entity_affected"
            onChange={onValueChange}
            value={value.entity_affected}
            error={error?.fields?.entity_affected}
            placeholder={strings.maxThreeHundredCharacters}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.assistedPopulation}
        className={styles.assistedPopulation}
      >
        <InputSection
          multiRow
          twoColumn
        >
          <NumberInput
            label={strings.women}
            name="women"
            value={value.women}
            onChange={onValueChange}
            error={error?.fields?.women}
          />
          <NumberInput
            label={strings.men}
            name="men"
            value={value.men}
            onChange={onValueChange}
            error={error?.fields?.men}
          />
          <NumberInput
            label={strings.girls}
            name="girls"
            value={value.girls}
            onChange={onValueChange}
            error={error?.fields?.girls}
          />
          <NumberInput
            label={strings.boys}
            name="boys"
            value={value.boys}
            onChange={onValueChange}
            error={error?.fields?.boys}
          />
        </InputSection>
        <InputSection
          title={strings.estimateResponse}
          multiRow
          twoColumn
        >
          <NumberInput
            label={strings.estimatePeopleDisability}
            name="disability_people_per"
            value={value.disability_people_per}
            onChange={onValueChange}
            error={error?.fields?.disability_people_per}
          />
          <NumberInput
            label={strings.estimatedUran}
            name="people_per_urban_local"
            value={value.people_per_urban_local}
            onChange={onValueChange}
            error={error?.fields?.people_per_urban_local}
          />
          <NumberInput
            label={strings.estimatedDisplacedPeople}
            name="displaced_people"
            value={value.displaced_people}
            onChange={onValueChange}
            error={error?.fields?.displaced_people}
          />
          <NumberInput
            label={strings.peopleTargetedWithEarlyActions}
            name="people_targeted_with_early_actions"
            value={value.people_targeted_with_early_actions}
            onChange={onValueChange}
            error={error?.fields?.people_targeted_with_early_actions}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.objectiveAndStrategy}
        className={styles.objectiveRationale}
      >
        <InputSection
          title={strings.objectiveOperation}
        >
          <TextArea
            error={error?.fields?.operation_objective}
            name="operation_objective"
            onChange={onValueChange}
            value={value.operation_objective}
            placeholder={strings.objectiveOperationPlaceholder}
          />
        </InputSection>
        <InputSection
          title={strings.responseRationale}
        >
          <TextArea
            name="response_strategy"
            onChange={onValueChange}
            value={value.response_strategy}
            error={error?.fields?.response_strategy}
            placeholder={strings.responseRationalePlaceholder}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.supportServices}
      >
        <InputSection
          title={strings.humanResource}
          description={strings.humanResourceDescription}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="human_resource"
            onChange={onValueChange}
            value={value.human_resource}
            error={error?.fields?.human_resource}
            placeholder={strings.maxThreeHundredCharacters}
          />
        </InputSection>
        <InputSection
          title={strings.surgePersonnelDeployed}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="surge_personnel_deployed"
            onChange={onValueChange}
            value={value.surge_personnel_deployed}
            error={error?.fields?.surge_personnel_deployed}
            placeholder={strings.maxThreeHundredCharacters}
          />
        </InputSection>
        <InputSection
          title={strings.logisticCapacityOfNs}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="logistic_capacity_of_ns"
            onChange={onValueChange}
            value={value.logistic_capacity_of_ns}
            error={error?.fields?.logistic_capacity_of_ns}
            placeholder={strings.maxThreeHundredCharacters}
          />
        </InputSection>
        <InputSection
          title={strings.safetyConcerns}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="safety_concerns"
            onChange={onValueChange}
            value={value.safety_concerns}
            error={error?.fields?.safety_concerns}
            placeholder={strings.maxThreeHundredCharacters}
          />
        </InputSection>
        <InputSection
          title={strings.pMer}
          description={strings.pMerDescription}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="pmer"
            onChange={onValueChange}
            value={value.pmer}
            error={error?.fields?.pmer}
            placeholder={strings.maxThreeHundredCharacters}
          />
        </InputSection>
        <InputSection
          title={strings.communication}
          description={strings.communicationDescription}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="communication"
            onChange={onValueChange}
            value={value.communication}
            error={error?.fields?.communication}
            placeholder={strings.maxThreeHundredCharacters}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.plannedIntervention}
        className={styles.plannedIntervention}
        visibleOverflow
      >
        <InputSection>
          <SelectInput
            name={undefined}
            onChange={setIntervention}
            value={intervention}
            label={strings.interventionsLabel}
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
            error={error?.fields?.planned_interventions}
            interventionOptions={interventionOptions}
          />
        ))}
      </Container>
    </>
  );
}

export default Response;

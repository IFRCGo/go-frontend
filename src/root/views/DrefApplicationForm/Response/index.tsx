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

  const interventionsIdentifiedMap = React.useMemo(() =>(
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
            placeholder="Max 300 characters"
          />
        </InputSection>
        <InputSection
          title={strings.selectionCriteria}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="selection_criteria"
            onChange={onValueChange}
            value={value.selection_criteria}
            error={error?.fields?.selection_criteria}
            placeholder="Max 300 characters"
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
            placeholder="Max 300 characters"
          />
        </InputSection>
        <InputSection
          title={strings.analysisAndPlanningProcess}
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="community_involved"
            onChange={onValueChange}
            value={value.community_involved}
            error={error?.fields?.community_involved}
            placeholder="Max 300 characters"
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
          threeColumn
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
            name="people_per"
            value={value.people_per}
            onChange={onValueChange}
            error={error?.fields?.people_per}
          />
          <NumberInput
            label={strings.estimatedDisplacedPeople}
            name="displaced_people"
            value={value.displaced_people}
            onChange={onValueChange}
            error={error?.fields?.displaced_people}
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
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.plannedIntervention}
        className={styles.plannedIntervention}
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
        <InputSection
          title=""
        >
          <TextArea
            name="secretariat_service"
            onChange={onValueChange}
            value={value.secretariat_service}
            error={error?.fields?.secretariat_service}
            placeholder="Example: HR deployment, logistics, international procurement, Quality programing"
          />
        </InputSection>
        <InputSection
          title={strings.nationalSocietyStrengthening}
        >
          <TextArea
            name="national_society_strengthening"
            onChange={onValueChange}
            value={value.national_society_strengthening}
            error={error?.fields?.national_society_strengthening}
            placeholder="Example: Staff and valunteers involved."
          />
        </InputSection>
      </Container>
    </>
  );
}

export default Response;

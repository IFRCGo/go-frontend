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
        heading="Targeting Strategy"
        className={styles.targetingStrategy}
      >
        <InputSection
          title="Which group of people will be assisted through this operation?"
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
          title="What selection criteria or process has been applied to select affected people?"
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
          title="How has Protection, Gender and Inclusion been considered in planning this response?"
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
          title="How has the community been involved in the needs analysis and planning process?"
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
        heading="The Assisted Population"
        className={styles.assistedPopulation}
      >
        <InputSection
          multiRow
          twoColumn
        >
          <NumberInput
            label="Women"
            name="women"
            value={value.women}
            onChange={onValueChange}
            error={error?.fields?.women}
          />
          <NumberInput
            label="Men"
            name="men"
            value={value.men}
            onChange={onValueChange}
            error={error?.fields?.men}
          />
          <NumberInput
            label="Girls (under 18)"
            name="girls"
            value={value.girls}
            onChange={onValueChange}
            error={error?.fields?.girls}
          />
          <NumberInput
            label="Boys (under 18)"
            name="boys"
            value={value.boys}
            onChange={onValueChange}
            error={error?.fields?.boys}
          />
        </InputSection>
        <InputSection
          title="Estimate"
          threeColumn
        >
          <NumberInput
            label="Estimated % People with Disability"
            name="disability_people_per"
            value={value.disability_people_per}
            onChange={onValueChange}
            error={error?.fields?.disability_people_per}
          />
          <NumberInput
            label="Estimated % Urban/Rural"
            name="people_per"
            value={value.people_per}
            onChange={onValueChange}
            error={error?.fields?.people_per}
          />
          <NumberInput
            label="Estimated Number of Displaced People"
            name="displaced_people"
            value={value.displaced_people}
            onChange={onValueChange}
            error={error?.fields?.displaced_people}
          />
        </InputSection>
      </Container>
      <Container
        heading="Objective and Strategy Rationale"
        className={styles.objectiveRationale}
      >
        <InputSection
          title="Overall objective of the operation"
        >
          <TextArea
            error={error?.fields?.operation_objective}
            name="operation_objective"
            onChange={onValueChange}
            value={value.operation_objective}
          />
        </InputSection>
        <InputSection
          title="Response strategy rationale"
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
        heading="Planned Intervention"
        className={styles.plannedIntervention}
      >
        <InputSection>
          <SelectInput
            name={undefined}
            onChange={setIntervention}
            value={intervention}
            label="Select the interventions that apply."
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
          title="Secretariat services"
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
          title="National Society strengthening"
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

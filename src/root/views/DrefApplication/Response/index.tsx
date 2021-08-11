import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import TextInput from '#components/TextInput';
import SelectInput from '#components/SelectInput';
import LanguageContext from '#root/languageContext';

import {
  Option,
  FormType,
  NumericValueOption,
  BooleanValueOption,
} from '../common';

import styles from './styles.module.scss';
import TextArea from '#components/TextArea';


type Value = PartialForm<FormType>;
interface Props {
  disasterTypeOptions: NumericValueOption[];
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  statusOptions: NumericValueOption[];
  value: Value;
  yesNoOptions: BooleanValueOption[];
  countryOptions: NumericValueOption[];
  districtOptions: NumericValueOption[];
  fetchingCountries?: boolean;
  fetchingDistricts?: boolean;
  fetchingDisasterTypes?: boolean;
  initialEventOptions?: Option[];
}

function Response(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    countryOptions,
    fetchingCountries,
    error,
    onValueChange,
    value,
  } = props;

  return (
    <>
      <Container
        heading="TARGETING STRATEGY"
        className={styles.response}>
        <InputSection
          title="Which group of people will be assisted through this operation?"
          oneColumn
          multiRow
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
          oneColumn
          multiRow
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
          oneColumn
          multiRow
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
        heading="THE ASSISTED POPULATION"
        className={styles.eventDetails}>
        <InputSection>
          <div>
            <InputSection
              title="Women">
              <TextInput
                // label={strings.fieldReportFormTitleSecondaryLabel}
                // placeholder={strings.fieldReportFormTitleInputPlaceholder}
                name="women"
                value={value.women}
                onChange={onValueChange}
                error={error?.fields?.women}
              />
            </InputSection>
          </div>
          <div>
            <InputSection
              title="Men">
              <TextInput
                // label={strings.fieldReportFormTitleSecondaryLabel}
                // placeholder={strings.fieldReportFormTitleInputPlaceholder}
                name="men"
                value={value.men}
                onChange={onValueChange}
                error={error?.fields?.men}
              />
            </InputSection>
          </div>
        </InputSection>
        <InputSection>
          <div>
            <InputSection
              title="Girls(under18)">
              <TextInput
                // label={strings.fieldReportFormTitleSecondaryLabel}
                // placeholder={strings.fieldReportFormTitleInputPlaceholder}
                name="girls"
                value={value.girls}
                onChange={onValueChange}
                error={error?.fields?.girls}
              />
            </InputSection>
          </div>
          <div>
            <InputSection
              title="Boys(under18)">
              <TextInput
                // label={strings.fieldReportFormTitleSecondaryLabel}
                // placeholder={strings.fieldReportFormTitleInputPlaceholder}
                name="boys"
                value={value.boys}
                onChange={onValueChange}
                error={error?.fields?.boys}
              />
            </InputSection>
          </div>
        </InputSection>
        <InputSection>
          <div>
            <InputSection
              title="Estimate">
              <TextInput
                label="ESTIMATED % PEOPLE WITH DISABILITY"
                // placeholder={strings.fieldReportFormTitleInputPlaceholder}
                name="disability_people_per"
                value={value.disability_people_per}
                onChange={onValueChange}
                error={error?.fields?.disability_people_per}
              />
            </InputSection>
          </div>
          <div>
            <InputSection>
              <TextInput
                label="ESTIMATED % URBAN/RURAL"
                // placeholder={strings.fieldReportFormTitleInputPlaceholder}
                name="people_per"
                value={value.people_per}
                onChange={onValueChange}
                error={error?.fields?.people_per}
              />
            </InputSection>
          </div>
          <div>
            <InputSection>
              <TextInput
                label="ESTIMATED NUMBER OF DISPLACED PEOPLE"
                // placeholder={strings.fieldReportFormTitleInputPlaceholder}
                name="displaced_people"
                value={value.displaced_people}
                onChange={onValueChange}
                error={error?.fields?.displaced_people}
              />
            </InputSection>
          </div>
        </InputSection>
      </Container>
      <Container
        heading="OBJECTIVE AND STRATEGY RATIONALE"
        className={styles.eventDetails}>
        <InputSection
          title=""
          description="Overall objective of the operation"
        >
          <SelectInput
            error={error?.fields?.country}
            name="country"
            onChange={onValueChange}
            options={countryOptions}
            pending={fetchingCountries}
            value={value.country}
          />
        </InputSection>
        <InputSection
          title="Response strategy rationale"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="response_strategy"
            onChange={onValueChange}
            value={value.response_strategy}
            error={error?.fields?.response_strategy}
            placeholder="Max 300 characters"
          />
        </InputSection>
      </Container>
      <Container
        heading="Planned Intervention"
        className={styles.ActionsFields}>
        <InputSection
          title=""
          description="Select the needs that apply."
        >
          <SelectInput
            error={error?.fields?.planned_interventions}
            name="planned_interventions"
            onChange={onValueChange}
            options={countryOptions}
            pending={fetchingCountries}
            value={value.planned_interventions}
          />
        </InputSection>
        <InputSection
          title="Secretariat services"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="secretariat_service"
            onChange={onValueChange}
            value={value.secretariat_service}
            error={error?.fields?.secretariat_service}
            placeholder="Example: HR deployment, logistics, international procurement, Quality programing"
          />
        </InputSection>
        <InputSection
          title="National Society strengthening"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="national_society_strengthening"
            onChange={onValueChange}
            value={value.national_society_strengthening}
            error={error?.fields?.national_society_strengthening}
            placeholder="Example:Staff and valunteers involved."
          />
        </InputSection>
      </Container>
    </>
  );
}

export default Response;

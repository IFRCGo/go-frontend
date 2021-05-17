import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';

import Description from '#components/draft/Description';
import Container from '#components/draft/Container';
import InputSection from '#components/draft/InputSection';
import NumberInput from '#components/draft/NumberInput';
import TextArea from '#components/draft/TextArea';
import RadioInput from '#components/draft/RadioInput';
import DateInput from '#components/draft/DateInput';
import SelectInput from '#components/draft/SelectInput';
import LanguageContext from '#root/languageContext';

import {
  FormType,
  epiSourceOptions,
  StringValueOption,
  stringOptionKeySelector,
  optionLabelSelector,
  ReportType,
} from '../common';

import styles from './styles.module.scss';

type Value = PartialForm<FormType>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  sourceOptions: StringValueOption[];
  reportType: ReportType;
}

function SituationFields(props: Props) {
  const {
    error,
    onValueChange,
    value,
    sourceOptions,
    reportType,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  // FIXME: use translations
  const sectionHeading = "Numeric Details (People)";

  if (reportType === 'COVID') {
    return (
      <Container
        heading={sectionHeading}
        description={(
          <Description>
            {strings.fieldsStep2HeaderDescription}
          </Description>
        )}
      >
        <InputSection
          title={strings.fieldsStep2SituationFieldsEPICasesLabel}
          description={strings.fieldsStep2SituationFieldsEPICasesDescription}
        >
          <NumberInput
            label={strings.fieldsStep2SituationFieldsEstimation}
            name="epi_cases"
            value={value.epi_cases}
            onChange={onValueChange}
            error={error?.fields?.epi_cases}
          />
        </InputSection>
        <InputSection
          title={strings.fieldsStep2SituationFieldsEPIDeadLabel}
          description={strings.fieldsStep2SituationFieldsEPIDeadDescription}
        >
          <NumberInput
            label={strings.fieldsStep2SituationFieldsEstimation}
            name="epi_num_dead"
            value={value.epi_num_dead}
            onChange={onValueChange}
            error={error?.fields?.epi_num_dead}
          />
        </InputSection>
        <InputSection
          title={strings.fieldReportCasesSince}
          description={strings.fieldsStep2SituationFieldsEPICasesSinceDesciption}
        >
          <NumberInput
            label={strings.fieldsStep2SituationFieldsEstimation}
            name="epi_cases_since_last_fr"
            value={value.epi_cases_since_last_fr}
            onChange={onValueChange}
            error={error?.fields?.epi_cases_since_last_fr}
          />
        </InputSection>
        <InputSection
          title={strings.fieldReportDeathsSince}
          description={strings.fieldsStep2SituationFieldsEPIDeathsSinceDescription}
        >
          <NumberInput
            label={strings.fieldsStep2SituationFieldsEstimation}
            name="epi_cases_since_last_fr"
            value={value.epi_cases_since_last_fr}
            onChange={onValueChange}
            error={error?.fields?.epi_cases_since_last_fr}
          />
        </InputSection>
        <InputSection
          title={strings.fieldsStep2SourceOfFiguresLabel}
        >
          <SelectInput
            name="epi_figures_source"
            value={value.epi_figures_source}
            onChange={onValueChange}
            error={error?.fields?.epi_figures_source}
            options={epiSourceOptions}
          />
        </InputSection>
        <InputSection
          title={strings.fieldsStep2NotesLabel}
          description={strings.fieldsStep2EPINotes}
        >
          <TextArea
            name="epi_notes_since_last_fr"
            value={value.epi_notes_since_last_fr}
            onChange={onValueChange}
            error={error?.fields?.epi_notes_since_last_fr}
          />
        </InputSection>
        <InputSection
          title={strings.fieldsStep2SituationFieldsDateEPILabel}
          description={strings.fieldsStep2SituationFieldsDateEPIDescription}
        >
          <DateInput
            name="sit_fields_date"
            value={value.sit_fields_date}
            onChange={onValueChange}
            error={error?.fields?.sit_fields_date}
          />
        </InputSection>
        <InputSection
          title={strings.fieldReportFormSourceDetailsLabel}
          description={strings.fieldReportFormSourceDetailsDescription}
        >
          <TextArea
            name="other_sources"
            value={value.other_sources}
            onChange={onValueChange}
            error={error?.fields?.other_sources}
            placeholder={strings.fieldReportFormSourceDetailsEPIPlaceholder}
          />
        </InputSection>
        <InputSection
          title={strings.fieldsStep2DescriptionEPILabel}
          description={strings.fieldsStep2DescriptionEPICOVDescription}
        >
          <TextArea
            name="description"
            value={value.description}
            onChange={onValueChange}
            error={error?.fields?.description}
            placeholder={strings.fieldsStep2DescriptionCOVIDPlaceholder}
          />
        </InputSection>
      </Container>
    );
  }

  if (reportType === 'EPI') {
    return (
      <Container heading={sectionHeading}>
        <InputSection
          title={strings.fieldsStep2SituationFieldsEPICasesLabel}
          description={strings.fieldsStep2SituationFieldsEPICasesDescription}
        >
          <NumberInput
            label={strings.fieldsStep2SituationFieldsEstimation}
            name="epi_cases"
            value={value.epi_cases}
            onChange={onValueChange}
            error={error?.fields?.epi_cases}
          />
        </InputSection>
        <InputSection
          title={strings.fieldsStep2SituationFieldsEPISuspectedCasesLabel}
          description={strings.fieldsStep2SituationFieldsEPISuspectedCasesDescription}
        >
          <NumberInput
            label={strings.fieldsStep2SituationFieldsEstimation}
            name="epi_suspected_cases"
            value={value.epi_suspected_cases}
            onChange={onValueChange}
            error={error?.fields?.epi_suspected_cases}
          />
        </InputSection>
        <InputSection
          title={strings.fieldsStep2SituationFieldsEPIProbableCasesLabel}
          description={strings.fieldsStep2SituationFieldsEPIProbableCasesDescription}
        >
          <NumberInput
            label={strings.fieldsStep2SituationFieldsEstimation}
            name="epi_probable_cases"
            value={value.epi_probable_cases}
            onChange={onValueChange}
            error={error?.fields?.epi_probable_cases}
          />
        </InputSection>
        <InputSection
          title={strings.fieldsStep2SituationFieldsEPIConfirmedCasesLabel}
          description={strings.fieldsStep2SituationFieldsEPIConfirmedCasesDescription}
        >
          <NumberInput
            label={strings.fieldsStep2SituationFieldsEstimation}
            name="epi_confirmed_cases"
            value={value.epi_confirmed_cases}
            onChange={onValueChange}
            error={error?.fields?.epi_confirmed_cases}
          />
        </InputSection>
        <InputSection
          title={strings.fieldsStep2SituationFieldsEPIDeadLabel}
          description={strings.fieldsStep2SituationFieldsEPIDeadDescription}
        >
          <NumberInput
            label={strings.fieldsStep2SituationFieldsEstimation}
            name="epi_num_dead"
            value={value.epi_num_dead}
            onChange={onValueChange}
            error={error?.fields?.epi_num_dead}
          />
        </InputSection>
        <InputSection
          title={strings.fieldsStep2SourceOfFiguresLabel}
        >
          <SelectInput
            name="epi_figures_source"
            value={value.epi_figures_source}
            onChange={onValueChange}
            error={error?.fields?.epi_figures_source}
            options={epiSourceOptions}
          />
        </InputSection>
        <InputSection
          title={strings.fieldsStep2NotesLabel}
          description={strings.fieldsStep2EPINotes}
        >
          <TextArea
            name="epi_notes_since_last_fr"
            value={value.epi_notes_since_last_fr}
            onChange={onValueChange}
            error={error?.fields?.epi_notes_since_last_fr}
          />
        </InputSection>
        <InputSection
          title={strings.fieldsStep2SituationFieldsDateEPILabel}
          description={strings.fieldsStep2SituationFieldsDateEPIDescription}
        >
          <DateInput
            name="sit_fields_date"
            value={value.sit_fields_date}
            onChange={onValueChange}
            error={error?.fields?.sit_fields_date}
          />
        </InputSection>
        <InputSection
          title={strings.fieldReportFormSourceDetailsLabel}
          description={strings.fieldReportFormSourceDetailsDescription}
        >
          <TextArea
            name="other_sources"
            value={value.other_sources}
            onChange={onValueChange}
            error={error?.fields?.other_sources}
            placeholder={strings.fieldReportFormSourceDetailsEPIPlaceholder}
          />
        </InputSection>
        <InputSection
          title={strings.fieldsStep2DescriptionEPILabel}
          description={strings.fieldsStep2DescriptionEPIDescription}
        >
          <TextArea
            name="description"
            value={value.description}
            onChange={onValueChange}
            error={error?.fields?.description}
            placeholder={strings.fieldsStep2DescriptionEPIPlaceholder}
          />
        </InputSection>
      </Container>
    );
  }

  return (
    <Container heading={sectionHeading}>
      <InputSection
        title={strings.fieldsStep2SituationFieldsEVTInjuredLabel}
        description={strings.fieldsStep2SituationFieldsEVTInjuredDescription}
      >
        <NumberInput
          label={strings.fieldsStep2SituationFieldsEstimation}
          name="num_injured"
          value={value.num_injured}
          onChange={onValueChange}
          error={error?.fields?.num_injured}
        />
        <RadioInput
          label={strings.cmpSourceLabel}
          radioListContainerClassName={styles.sourceRadioListContainer}
          error={error?.fields?.num_injured_source}
          name="num_injured_source"
          onChange={onValueChange}
          options={sourceOptions}
          radioKeySelector={stringOptionKeySelector}
          radioLabelSelector={optionLabelSelector}
          value={value.num_injured_source}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep2SituationFieldsEVTDeadLabel}
        description={strings.fieldsStep2SituationFieldsEVTDeadDescription}
      >
        <NumberInput
          label={strings.fieldsStep2SituationFieldsEstimation}
          name="num_dead"
          value={value.num_dead}
          onChange={onValueChange}
          error={error?.fields?.num_dead}
        />
        <RadioInput
          label={strings.cmpSourceLabel}
          radioListContainerClassName={styles.sourceRadioListContainer}
          error={error?.fields?.num_dead_source}
          name="num_dead_source"
          onChange={onValueChange}
          options={sourceOptions}
          radioKeySelector={stringOptionKeySelector}
          radioLabelSelector={optionLabelSelector}
          value={value.num_dead_source}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep2SituationFieldsEVTMissingLabel}
        description={strings.fieldsStep2SituationFieldsEVTMissingDescription}
      >
        <NumberInput
          label={strings.fieldsStep2SituationFieldsEstimation}
          name="num_missing"
          value={value.num_missing}
          onChange={onValueChange}
          error={error?.fields?.num_missing}
        />
        <RadioInput
          label={strings.cmpSourceLabel}
          radioListContainerClassName={styles.sourceRadioListContainer}
          error={error?.fields?.num_missing_source}
          name="num_missing_source"
          onChange={onValueChange}
          options={sourceOptions}
          radioKeySelector={stringOptionKeySelector}
          radioLabelSelector={optionLabelSelector}
          value={value.num_missing_source}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep2SituationFieldsEVTAffectedLabel}
        description={strings.fieldsStep2SituationFieldsEVTAffectedDescription}
      >
        <NumberInput
          label={strings.fieldsStep2SituationFieldsEstimation}
          name="num_affected"
          value={value.num_affected}
          onChange={onValueChange}
          error={error?.fields?.num_affected}
        />
        <RadioInput
          label={strings.cmpSourceLabel}
          radioListContainerClassName={styles.sourceRadioListContainer}
          error={error?.fields?.num_affected_source}
          name="num_affected_source"
          onChange={onValueChange}
          options={sourceOptions}
          radioKeySelector={stringOptionKeySelector}
          radioLabelSelector={optionLabelSelector}
          value={value.num_affected_source}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep2SituationFieldsEVTDisplacedLabel}
        description={strings.fieldsStep2SituationFieldsEVTDisplacedDescription}
      >
        <NumberInput
          label={strings.fieldsStep2SituationFieldsEstimation}
          name="num_displaced"
          value={value.num_displaced}
          onChange={onValueChange}
          error={error?.fields?.num_displaced}
        />
        <RadioInput
          label={strings.cmpSourceLabel}
          radioListContainerClassName={styles.sourceRadioListContainer}
          error={error?.fields?.num_displaced_source}
          name="num_displaced_source"
          onChange={onValueChange}
          options={sourceOptions}
          radioKeySelector={stringOptionKeySelector}
          radioLabelSelector={optionLabelSelector}
          value={value.num_displaced_source}
        />
      </InputSection>
      <InputSection
        title={strings.fieldReportFormSourceDetailsLabel}
        description={strings.fieldReportFormSourceDetailsDescription}
      >
        <TextArea
          name="other_sources"
          value={value.other_sources}
          onChange={onValueChange}
          error={error?.fields?.other_sources}
          placeholder={strings.fieldReportFormSourceDetailsPlaceholder}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep2DescriptionEVTLabel}
        description={strings.fieldsStep2DescriptionEVTDescription}
      >
        <TextArea
          name="description"
          value={value.description}
          onChange={onValueChange}
          error={error?.fields?.description}
          placeholder={strings.fieldsStep2DescriptionEVTPlaceholder}
        />
      </InputSection>
    </Container>
  );
}

export default SituationFields;

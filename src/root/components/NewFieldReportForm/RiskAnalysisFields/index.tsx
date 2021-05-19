import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';

import Container from '#components/draft/Container';
import InputSection from '#components/draft/InputSection';
import NumberInput from '#components/draft/NumberInput';
import TextArea from '#components/draft/TextArea';
import RadioInput from '#components/draft/RadioInput';
import LanguageContext from '#root/languageContext';

import {
  FormType,
  StringValueOption,
  stringOptionKeySelector,
  optionLabelSelector,
} from '../common';

import styles from './styles.module.scss';

type Value = PartialForm<FormType>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  sourceOptions: StringValueOption[]
}

function RiskAnalysisFields(props: Props) {
  const {
    error,
    onValueChange,
    value,
    sourceOptions,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  return (
    // FIXME: use translations
    <Container heading="Numeric Details (People)">
      <InputSection
        title={strings.fieldsStep2SituationFieldsEWPotentiallyAffectedLabel}
        description={strings.fieldsStep2SituationFieldsEWPotentiallyAffectedDescription}
      >
        <NumberInput
          label={strings.fieldsStep2SituationFieldsEstimation}
          name="num_potentially_affected"
          value={value.num_potentially_affected}
          onChange={onValueChange}
          error={error?.fields?.num_potentially_affected}
        />
        <RadioInput
          label={strings.cmpSourceLabel}
          radioListContainerClassName={styles.sourceRadioListContainer}
          error={error?.fields?.num_potentially_affected_source}
          name="num_potentially_affected_source"
          onChange={onValueChange}
          options={sourceOptions}
          radioKeySelector={stringOptionKeySelector}
          radioLabelSelector={optionLabelSelector}
          value={value.num_potentially_affected_source}
          clearable
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep2SituationFieldsEWHighestRiskLabel}
        description={strings.fieldsStep2SituationFieldsEWHighestRiskDescription}
      >
        <NumberInput
          label={strings.fieldsStep2SituationFieldsEstimation}
          name="num_highest_risk"
          value={value.num_highest_risk}
          onChange={onValueChange}
          error={error?.fields?.num_highest_risk}
        />
        <RadioInput
          label={strings.cmpSourceLabel}
          radioListContainerClassName={styles.sourceRadioListContainer}
          error={error?.fields?.num_highest_risk_source}
          name="num_highest_risk_source"
          onChange={onValueChange}
          options={sourceOptions}
          radioKeySelector={stringOptionKeySelector}
          radioLabelSelector={optionLabelSelector}
          value={value.num_highest_risk_source}
          clearable
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep2SituationFieldsEWAffectedPopCenteresLabel}
        description={strings.fieldsStep2SituationFieldsEWAffectedPopCenteresDescription}
      >
        <NumberInput
          label={strings.fieldsStep2SituationFieldsEstimation}
          name="affected_pop_centres"
          value={value.affected_pop_centres}
          onChange={onValueChange}
          error={error?.fields?.affected_pop_centres}
        />
        <RadioInput
          label={strings.cmpSourceLabel}
          radioListContainerClassName={styles.sourceRadioListContainer}
          error={error?.fields?.affected_pop_centres_source}
          name="affected_pop_centres_source"
          onChange={onValueChange}
          options={sourceOptions}
          radioKeySelector={stringOptionKeySelector}
          radioLabelSelector={optionLabelSelector}
          value={value.affected_pop_centres_source}
          clearable
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
        title={strings.fieldsStep2DescriptionEWLabel}
        description={strings.fieldsStep2DescriptionEWDescription}
      >
        <TextArea
          name="description"
          value={value.description}
          onChange={onValueChange}
          error={error?.fields?.description}
          placeholder={strings.fieldsStep2DescriptionEWPlaceholder}
        />
      </InputSection>
    </Container>
  );
}

export default RiskAnalysisFields;

import React from 'react';
import { listToGroupList } from '@togglecorp/fujs';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';

import Container from '#components/draft/Container';
import InputSection from '#components/draft/InputSection';
import NumberInput from '#components/draft/NumberInput';
import TextArea from '#components/draft/TextArea';
import Checklist from '#components/draft/Checklist';
import LanguageContext from '#root/languageContext';

import {
  FormType,
  Action,
} from '../common';

import styles from './styles.module.scss';

type CategoryType = 'Health' | 'NS Institutional Strengthening' | 'Socioeconomic Interventions';
const categoryNameToFieldNameMap: {
  [key in CategoryType]: 'notes_health' | 'notes_ns' | 'notes_socioeco';
} = {
  'Health': 'notes_health',
  'NS Institutional Strengthening': 'notes_ns',
  'Socioeconomic Interventions': 'notes_socioeco',
};

type Value = PartialForm<FormType>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  options: Action[];
}

function CovidActionFields(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    value,
    error,
    onValueChange,
    options,
  } = props;

  const categoryGroupedOptions = React.useMemo(() => {
    /*
    const actionCategoryReverse = {
      'Health': 'health',
      'NS Institutional Strengthening': 'ns',
      'Socioeconomic Interventions': 'socioeco',
    };
     */

    return listToGroupList(options, d => d.category, d => d) as {
      [key in CategoryType]: Action[];
    };
  }, [options]);

  return (
    <Container
      heading={strings.fieldReportFormActionTakenTitle}
    >
      <InputSection
        title={strings.fieldsStep3Section1FieldsAssistedGovEVTEPILabel}
      >
        <NumberInput
          name="num_assisted_gov"
          value={value.num_assisted_gov}
          onChange={onValueChange}
          error={error?.fields?.num_assisted_gov}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep3Section1FieldsAssistedRCRCEVTEPILabel}
        description={strings.fieldsStep3TooltipDescriptionRCRC}
      >
        <NumberInput
          name="num_assisted_red_cross"
          value={value.num_assisted_red_cross}
          onChange={onValueChange}
          error={error?.fields?.num_assisted_red_cross}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep3Section1FieldsLocalStaffEVTEPILabel}
        description={strings.fieldsStep3TooltipDescriptionNS}
      >
        <NumberInput
          name="num_local_staff"
          value={value.num_local_staff}
          onChange={onValueChange}
          error={error?.fields?.num_local_staff}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep3Section1FieldsVolunteersEVTEPILabel}
        description={strings.fieldsStep3TooltipDescriptionVolunteers}
      >
        <NumberInput
          name="num_volunteers"
          value={value.num_volunteers}
          onChange={onValueChange}
          error={error?.fields?.num_volunteers}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep3CheckboxSectionsNSActionsEVTEPILabel}
        description={strings.fieldsStep3CheckboxSectionsNSActionsEVTEPIDescription}
      >
        <div>
          {(Object.keys(categoryGroupedOptions) as CategoryType[]).map((category) => (
            <div
              className={styles.actionTaken}
              key={category}
            >
              <div className={styles.category}>
                { category }
              </div>
              <Checklist
                name="actions_ntls"
                onChange={onValueChange}
                options={categoryGroupedOptions[category]}
                labelSelector={d => d.label}
                keySelector={d => d.value}
                value={value.actions_ntls}
                error={error?.fields?.actions_ntls?.$internal}
              />
              <TextArea
                label={strings.fieldsStep2NotesLabel}
                name={categoryNameToFieldNameMap[category]}
                onChange={onValueChange}
                value={value[categoryNameToFieldNameMap[category]]}
                error={error?.fields ? error.fields[categoryNameToFieldNameMap[category]] : undefined}
                placeholder={strings.fieldsStep3ActionsNotesPlaceholder}
              />
            </div>
          ))}
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
            placeholder={strings.fieldsStep3CheckboxSectionsNSActionsEPIEWPlaceholder}
          />
        </div>
      </InputSection>
      <InputSection
        title={strings.fieldsStep3CheckboxSectionsFederationActionsEVTEPILabel}
        description={strings.fieldsStep3CheckboxSectionsFederationActionsEVTEPIDescription}
      >
        <TextArea
          label={strings.cmpActionDescriptionLabel}
          name="actions_fdrn_desc"
          onChange={onValueChange}
          value={value.actions_fdrn_desc}
          error={error?.fields?.actions_fdrn_desc}
          placeholder={strings.fieldsStep3CheckboxSectionsFederationActionsEVTEPIEWPlaceholder}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep3CheckboxSectionsPNSActionsEVTLabel}
        description={strings.fieldsStep3CheckboxSectionsPNSActionsEVTEPIDescription}
      >
        <TextArea
          label={strings.cmpActionDescriptionLabel}
          name="actions_pns_desc"
          onChange={onValueChange}
          value={value.actions_pns_desc}
          error={error?.fields?.actions_pns_desc}
          placeholder={strings.fieldsStep3CheckboxSectionsPNSActionsEVTEPIEWPlaceholder}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep3ActionsOthersEVTEPILabel}
        description={strings.fieldsStep3ActionsOthersEVTEPIDescription}
      >
        <TextArea
          name="actions_others"
          value={value.actions_others}
          onChange={onValueChange}
          error={error?.fields?.actions_others}
          placeholder={strings.fieldReportFormOthersActionsPlaceholder}
        />
      </InputSection>
    </Container>
  );
}

export default CovidActionFields;

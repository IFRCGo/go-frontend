import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';

import InputSection from '#components/draft/InputSection';
import NumberInput from '#components/draft/NumberInput';
import TextArea from '#components/draft/TextArea';
import RadioInput from '#components/draft/RadioInput';
import Checklist from '#components/draft/Checklist';
import LanguageContext from '#root/languageContext';

import {
  FormType,
  Option,
  optionKeySelector,
  optionLabelSelector,
  OrganizationType,
} from '../common';

import styles from './styles.module.scss';

type Value = PartialForm<FormType>;
interface Props {
  options: {
    [key in OrganizationType]: Option[];
  };
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
}


function ActionsFields(props: Props) {
  const { strings } = React.useContext(LanguageContext);
  const {
    error,
    onValueChange,
    value,
    options,
  } = props;

  const bulletinOptions: Option[] = React.useMemo(() => [
    { label: strings.fieldReportFormOptionNoLabel, value: '0' },
    { label: strings.fieldReportFormOptionPlannedLabel, value: '2' },
    { label: strings.fieldReportFormOptionPublishedLabel, value: '3' },
  ], [strings]);

  return (
    <>
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
      >
        <NumberInput
          name="num_volunteers"
          value={value.num_volunteers}
          onChange={onValueChange}
          error={error?.fields?.num_volunteers}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep3Section1FieldsExpatsEVTEPILabel}
        description={strings.fieldsStep3Section1FieldsExpatsEVTEPIDescription}
      >
        <NumberInput
          name="num_expats"
          value={value.num_expats}
          onChange={onValueChange}
          error={error?.fields?.num_expats}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep3CheckboxSectionsNSActionsEVTEPILabel}
        description={strings.fieldsStep3CheckboxSectionsNSActionsEVTEPIDescription}
      >
        <div>
          <Checklist
            name="actions_ntls"
            onChange={onValueChange}
            options={options.NTLS}
            labelSelector={optionLabelSelector}
            keySelector={optionKeySelector}
            value={value.actions_ntls}
            error={error?.fields?.actions_ntls?.$internal}
          />
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
            placeholder={strings.fieldsStep3CheckboxSectionsNSActionsEVTPlaceholder}
          />
        </div>
      </InputSection>
      <InputSection
        title={strings.fieldsStep3CheckboxSectionsFederationActionsEVTEPILabel}
        description={strings.fieldsStep3CheckboxSectionsFederationActionsEVTEPIDescription}
      >
        <div>
          <Checklist
            name="actions_fdrn"
            onChange={onValueChange}
            options={options.FDRN}
            labelSelector={optionLabelSelector}
            keySelector={optionKeySelector}
            value={value.actions_fdrn}
            error={error?.fields?.actions_fdrn?.$internal}
          />
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_fdrn_desc"
            onChange={onValueChange}
            value={value.actions_fdrn_desc}
            error={error?.fields?.actions_fdrn_desc}
            placeholder={strings.fieldsStep3CheckboxSectionsFederationActionsEVTEPIEWPlaceholder}
          />
        </div>
      </InputSection>
      <InputSection
        title={strings.fieldsStep3CheckboxSectionsPNSActionsEVTLabel}
        description={strings.fieldsStep3CheckboxSectionsPNSActionsEVTEPIDescription}
      >
        <div>
          <Checklist
            name="actions_pns"
            onChange={onValueChange}
            options={options.PNS}
            labelSelector={optionLabelSelector}
            keySelector={optionKeySelector}
            value={value.actions_pns}
            error={error?.fields?.actions_pns?.$internal}
          />
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_pns_desc"
            onChange={onValueChange}
            value={value.actions_pns_desc}
            error={error?.fields?.actions_pns_desc}
            placeholder={strings.fieldsStep3CheckboxSectionsPNSActionsEVTEPIEWPlaceholder}
          />
        </div>
      </InputSection>
      <InputSection
        title={strings.fieldReportFormInformationBulletinDescription}
        description={strings.fieldReportFormInformationBulletinDescription}
      >
        <RadioInput
          name="bulletin"
          options={bulletinOptions}
          radioKeySelector={optionKeySelector}
          radioLabelSelector={optionLabelSelector}
          value={value.bulletin}
          onChange={onValueChange}
          error={error?.fields?.bulletin}
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
    </>
  );
}

export default ActionsFields;

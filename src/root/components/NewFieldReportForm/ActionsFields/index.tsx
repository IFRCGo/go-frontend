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
import Checklist from '#components/draft/Checklist';
import LanguageContext from '#root/languageContext';

import CovidActionFields from './CovidActionFields';

import {
  FormType,
  NumericValueOption,
  numericOptionKeySelector,
  optionLabelSelector,
  ReportType,
  ActionsByOrganization,
} from '../common';

// import styles from './styles.module.scss';

type Value = PartialForm<FormType>;
interface Props {
  actionOptions: ActionsByOrganization;
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  reportType: ReportType;
  bulletinOptions: NumericValueOption[];
  externalPartnerOptions: NumericValueOption[];
  supportedActivityOptions: NumericValueOption[];
  fetchingExternalPartners?: boolean;
  fetchingSupportedActivities?: boolean;
}

function ActionsFields(props: Props) {
  const { strings } = React.useContext(LanguageContext);
  const {
    error,
    onValueChange,
    value,
    actionOptions,
    reportType,
    bulletinOptions,
    externalPartnerOptions,
    supportedActivityOptions,
    fetchingExternalPartners,
    fetchingSupportedActivities,
  } = props;


  if (reportType === 'COVID') {
    return (
      <CovidActionFields
        value={value}
        error={error}
        onValueChange={onValueChange}
        actionOptions={actionOptions.NTLS}
        externalPartnerOptions={externalPartnerOptions}
        supportedActivityOptions={supportedActivityOptions}
        fetchingExternalPartners={fetchingExternalPartners}
        fetchingSupportedActivities={fetchingSupportedActivities}
      />
    );
  }

  return (
    <Container
      heading={strings.fieldReportFormActionTakenTitle}
    >
      <InputSection
        title={strings.fieldsStep3Section1FieldsAssistedGovEVTEPILabel}
      >
        <NumberInput
          name="gov_num_assisted"
          value={value.gov_num_assisted}
          onChange={onValueChange}
          error={error?.fields?.gov_num_assisted}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep3Section1FieldsAssistedRCRCEVTEPILabel}
      >
        <NumberInput
          name="num_assisted"
          value={value.num_assisted}
          onChange={onValueChange}
          error={error?.fields?.num_assisted}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep3Section1FieldsLocalStaffEVTEPILabel}
      >
        <NumberInput
          name="num_localstaff"
          value={value.num_localstaff}
          onChange={onValueChange}
          error={error?.fields?.num_localstaff}
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
          name="num_expats_delegates"
          value={value.num_expats_delegates}
          onChange={onValueChange}
          error={error?.fields?.num_expats_delegates}
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
            options={actionOptions.NTLS}
            labelSelector={optionLabelSelector}
            keySelector={numericOptionKeySelector}
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
            options={actionOptions.FDRN}
            labelSelector={optionLabelSelector}
            keySelector={numericOptionKeySelector}
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
            options={actionOptions.PNS}
            labelSelector={optionLabelSelector}
            keySelector={numericOptionKeySelector}
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
          radioKeySelector={numericOptionKeySelector}
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
    </Container>
  );
}

export default ActionsFields;

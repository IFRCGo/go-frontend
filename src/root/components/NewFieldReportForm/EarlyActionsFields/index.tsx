import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import NumberInput from '#components/NumberInput';
import TextArea from '#components/TextArea';
import RadioInput from '#components/RadioInput';
import Checklist from '#components/Checklist';
import LanguageContext from '#root/languageContext';

import {
  FormType,
  NumericValueOption,
  numericOptionKeySelector,
  optionLabelSelector,
  ActionsByOrganization,
} from '../common';

import styles from './styles.module.scss';

type Value = PartialForm<FormType>;
interface Props {
  actionOptions: ActionsByOrganization;
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  bulletinOptions: NumericValueOption[];
}

function EarlyActionFields(props: Props) {
  const { strings } = React.useContext(LanguageContext);
  const {
    error,
    onValueChange,
    value,
    actionOptions,
    bulletinOptions,
  } = props;

  return (
    <Container
      heading={strings.fieldReportFormActionTakenTitle}
      className={styles.earlyActionFields}
    >
      <div className={styles.numericSection}>
        <InputSection
          title={strings.fieldsStep3Section1FieldsAssistedGovEWLabel}
        >
          <NumberInput
            name="gov_num_assisted"
            value={value.gov_num_assisted}
            onChange={onValueChange}
            error={error?.fields?.gov_num_assisted}
          />
        </InputSection>
        <InputSection
          title={strings.fieldsStep3Section1FieldsAssistedRCRCEWLabel}
        >
          <NumberInput
            name="num_assisted"
            value={value.num_assisted}
            onChange={onValueChange}
            error={error?.fields?.num_assisted}
          />
        </InputSection>
      </div>
      <div className={styles.otherSection}>
        <InputSection
          title={strings.fieldsStep3CheckboxSectionsNSActionsEWLabel}
          description={strings.fieldsStep3CheckboxSectionsNSActionsEWDescription}
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
              // placeholder={strings.fieldsStep3CheckboxSectionsNSActionsEWPlaceholder}
            />
          </div>
        </InputSection>
        <InputSection
          title={strings.fieldsStep3CheckboxSectionsFederationActionsEWLabel}
          description={strings.fieldsStep3CheckboxSectionsFederationActionsEWDescription}
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
          title={strings.fieldsStep3CheckboxSectionsPNSActionsEWLabel}
          description={strings.fieldsStep3CheckboxSectionsPNSActionsEWDescription}
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
      </div>
    </Container>
  );
}

export default EarlyActionFields;

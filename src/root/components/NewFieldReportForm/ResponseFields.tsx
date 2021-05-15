import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';

import Header from '#components/draft/Header';
import Container from '#components/draft/Container';
import InputSection from '#components/draft/InputSection';
import NumberInput from '#components/draft/NumberInput';
import TextInput from '#components/draft/TextInput';
import RadioInput from '#components/draft/RadioInput';
import LanguageContext from '#root/languageContext';

import {
  FormType,
  Option,
  optionKeySelector,
  optionLabelSelector,
  ReportType,
} from './common';

type Value = PartialForm<FormType>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  reportType: ReportType;
}

function ResponseFields(props: Props) {
  const { strings } = React.useContext(LanguageContext);
  const {
    error,
    onValueChange,
    value,
    reportType,
  } = props;

  const [
    drefOptions,
    appealOptions,
    responseOptions,
    visibilityOptions,
  ] = React.useMemo(() => [
    // FIXME: use translations
    [
      { label: 'Planned', value: '2' },
      { label: 'Requested', value: '1' },
      { label: 'Allocated', value: '3' },
    ] as Option[],
    [
      { label: 'Planned', value: '2' },
      { label: 'Requested', value: '1' },
      { label: 'Launched', value: '3' },
    ] as Option[],
    [
      { label: 'Planned', value: '2' },
      { label: 'Requested', value: '1' },
      { label: 'Deployed', value: '3' },
    ] as Option[],
    [
      { label: strings.fieldReportConstantVisibilityPublicLabel, value: '3' },
      { label: strings.fieldReportConstantVisibilityRCRCMovementLabel, value: '1' },
      { label: strings.fieldReportConstantVisibilityIFRCSecretariatLabel, value: '2' },
    ] as Option[],
  ], [strings]);

  return (
    <>
      <Container
        heading={strings.fieldReportFormResponseTitle}
        description={(
          <Header
            heading={strings.fieldReportFormResponseLabel}
            description={strings.fieldReportFormResponseDescription}
            headingSize="extraSmall"
          />
        )}
      >
        { reportType !== 'COVID' && (
          <>
            <InputSection
              title={strings.fieldsStep4PlannedResponseRowsDREFEVTEPILabel}
            >
              <RadioInput
                error={error?.fields?.dref_status}
                name="dref_status"
                onChange={onValueChange}
                options={drefOptions}
                radioKeySelector={optionKeySelector}
                radioLabelSelector={optionLabelSelector}
                value={value.dref_status}
              />
              <NumberInput
                label={strings.fieldsStep4PlannedResponseRowsDREFValueFieldLabel}
                name="dref_value"
                value={value.dref_value}
                onChange={onValueChange}
                error={error?.fields?.dref_value}
              />
            </InputSection>
            <InputSection
              title={strings.fieldsStep4PlannedResponseRowsEmergencyAppealEVTEPIEWLabel}
            >
              <RadioInput
                error={error?.fields?.emergency_appeal_status}
                name="emergency_appeal_status"
                onChange={onValueChange}
                options={appealOptions}
                radioKeySelector={optionKeySelector}
                radioLabelSelector={optionLabelSelector}
                value={value.emergency_appeal_status}
              />
              <NumberInput
                label={strings.fieldsStep4PlannedResponseRowsEmergencyAppealValueFieldLabel}
                name="emergency_appeal_value"
                value={value.emergency_appeal_value}
                onChange={onValueChange}
                error={error?.fields?.emergency_appeal_value}
              />
            </InputSection>
            <InputSection
              title={strings.fieldsStep4PlannedResponseRowsFactEVTEPIEWLabel}
            >
              <RadioInput
                error={error?.fields?.fact_status}
                name="fact_status"
                onChange={onValueChange}
                options={responseOptions}
                radioKeySelector={optionKeySelector}
                radioLabelSelector={optionLabelSelector}
                value={value.fact_status}
              />
              <NumberInput
                label={strings.fieldsStep4PlannedResponseRowsFactValueFieldLabel}
                name="fact_value"
                value={value.fact_value}
                onChange={onValueChange}
                error={error?.fields?.fact_value}
              />
            </InputSection>
            <InputSection
              title={strings.fieldsStep4PlannedResponseRowsIFRCStaffEVTEPIEWLabel}
            >
              <RadioInput
                error={error?.fields?.ifrc_staff_status}
                name="ifrc_staff_status"
                onChange={onValueChange}
                options={responseOptions}
                radioKeySelector={optionKeySelector}
                radioLabelSelector={optionLabelSelector}
                value={value.ifrc_staff_status}
              />
              <NumberInput
                label={strings.fieldsStep4PlannedResponseRowsIFRCStaffValueFieldLabel}
                name="ifrc_staff_value"
                value={value.ifrc_staff_value}
                onChange={onValueChange}
                error={error?.fields?.ifrc_staff_value}
              />
            </InputSection>
          </>
        )}
        {reportType === 'EW' && (
          <InputSection
            title={strings.fieldsStep4PlannedResponseRowsForecastBasedActionEWLabel}
          >
            <RadioInput
              error={error?.fields?.forecast_based_action_status}
              name="forecast_based_action_status"
              onChange={onValueChange}
              options={responseOptions}
              radioKeySelector={optionKeySelector}
              radioLabelSelector={optionLabelSelector}
              value={value.forecast_based_action_status}
            />
            <NumberInput
              label={strings.fieldsStep4PlannedResponseRowsForecastBasedActionValueFieldLabel}
              name="forecast_based_action_value"
              value={value.forecast_based_action_value}
              onChange={onValueChange}
              error={error?.fields?.forecast_based_action_value}
            />
          </InputSection>
        )}
      </Container>
      <Container heading={strings.fieldReportFormContactsTitle}>
        <InputSection
          title={strings.fieldsStep4ContactRowsOriginatorLabel}
          description={strings.fieldsStep4ContactRowsOriginatorEVTEPIEWDesc}
        >
          <TextInput
            name="contact_originator_name"
            value={value.contact_originator_name}
            onChange={onValueChange}
            error={error?.fields?.contact_originator_name}
            label={strings.cmpContactName}
          />
          <TextInput
            name="contact_originator_title"
            value={value.contact_originator_title}
            onChange={onValueChange}
            error={error?.fields?.contact_originator_title}
            label={strings.cmpContactTitle}
          />
          <TextInput
            name="contact_originator_email"
            value={value.contact_originator_email}
            onChange={onValueChange}
            error={error?.fields?.contact_originator_email}
            label={strings.cmpContactEmail}
          />
          <TextInput
            name="contact_originator_phone"
            value={value.contact_originator_phone}
            onChange={onValueChange}
            error={error?.fields?.contact_originator_phone}
            label={strings.cmpContactPhone}
          />
        </InputSection>
        <InputSection
          title={strings.fieldsStep4ContactRowsNSContactLabel}
          description={strings.fieldsStep4ContactRowsNSContactEVTEPIDesc}
        >
          <TextInput
            name="contact_nat_soc_name"
            value={value.contact_nat_soc_name}
            onChange={onValueChange}
            error={error?.fields?.contact_nat_soc_name}
            label={strings.cmpContactName}
          />
          <TextInput
            name="contact_nat_soc_title"
            value={value.contact_nat_soc_title}
            onChange={onValueChange}
            error={error?.fields?.contact_nat_soc_title}
            label={strings.cmpContactTitle}
          />
          <TextInput
            name="contact_nat_soc_email"
            value={value.contact_nat_soc_email}
            onChange={onValueChange}
            error={error?.fields?.contact_nat_soc_email}
            label={strings.cmpContactEmail}
          />
          <TextInput
            name="contact_nat_soc_phone"
            value={value.contact_nat_soc_phone}
            onChange={onValueChange}
            error={error?.fields?.contact_nat_soc_phone}
            label={strings.cmpContactPhone}
          />
        </InputSection>
        <InputSection
          title={strings.fieldsStep4ContactRowsFederationContactLabel}
          description={strings.fieldsStep4ContactRowsFederationContactEVTEPIDesc}
        >
          <TextInput
            name="contact_federation_name"
            value={value.contact_federation_name}
            onChange={onValueChange}
            error={error?.fields?.contact_federation_name}
            label={strings.cmpContactName}
          />
          <TextInput
            name="contact_federation_title"
            value={value.contact_federation_title}
            onChange={onValueChange}
            error={error?.fields?.contact_federation_title}
            label={strings.cmpContactTitle}
          />
          <TextInput
            name="contact_federation_email"
            value={value.contact_federation_email}
            onChange={onValueChange}
            error={error?.fields?.contact_federation_email}
            label={strings.cmpContactEmail}
          />
          <TextInput
            name="contact_federation_phone"
            value={value.contact_federation_phone}
            onChange={onValueChange}
            error={error?.fields?.contact_federation_phone}
            label={strings.cmpContactPhone}
          />
        </InputSection>
        <InputSection
          title={strings.fieldsStep4ContactRowsMediaContactLabel}
          description={strings.fieldsStep4ContactRowsMediaContactEVTEPIEWDesc}
        >
          <TextInput
            name="contact_media_name"
            value={value.contact_media_name}
            onChange={onValueChange}
            error={error?.fields?.contact_media_name}
            label={strings.cmpContactName}
          />
          <TextInput
            name="contact_media_title"
            value={value.contact_media_title}
            onChange={onValueChange}
            error={error?.fields?.contact_media_title}
            label={strings.cmpContactTitle}
          />
          <TextInput
            name="contact_media_email"
            value={value.contact_media_email}
            onChange={onValueChange}
            error={error?.fields?.contact_media_email}
            label={strings.cmpContactEmail}
          />
          <TextInput
            name="contact_media_phone"
            value={value.contact_media_phone}
            onChange={onValueChange}
            error={error?.fields?.contact_media_phone}
            label={strings.cmpContactPhone}
          />
        </InputSection>


        <InputSection
          title={strings.fieldReportFormVisibilityLabel}
          description={(
            <>
              <p>
                {strings.fieldReportConstantVisibilityPublicLabel} - {strings.fieldReportConstantVisibilityPublicTooltipTitle}<br/>
              </p>
              <p>
                {strings.fieldReportConstantVisibilityRCRCMovementLabel} - {strings.fieldReportConstantVisibilityRCRCMovementTooltipTitle}<br/>
              </p>
              <p>
                {strings.fieldReportConstantVisibilityIFRCSecretariatLabel} - {strings.fieldReportConstantVisibilityIFRCSecretariatTooltipTitle}
              </p>
            </>
          )}
        >
          <RadioInput
            error={error?.fields?.visibility}
            name="visibility"
            onChange={onValueChange}
            options={visibilityOptions}
            radioKeySelector={optionKeySelector}
            radioLabelSelector={optionLabelSelector}
            value={value.visibility}
          />
        </InputSection>
      </Container>
    </>
  );
}

export default ResponseFields;

import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';

import Header from '#components/Header';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import NumberInput from '#components/NumberInput';
import TextInput from '#components/TextInput';
import RadioInput from '#components/RadioInput';
import LanguageContext from '#root/languageContext';

import {
  FormType,
  optionLabelSelector,
  ReportType,
  NumericValueOption,
  numericOptionKeySelector,
  VISIBILITY_IFRC_SECRETARIAT,
  VISIBILITY_PUBLIC,
  VISIBILITY_RCRC_MOVEMENT,
} from '../common';

import styles from './styles.module.scss';

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
      { label: 'Planned', value: 2 },
      { label: 'Requested', value: 1 },
      { label: 'Allocated', value: 3 },
    ] as NumericValueOption[],
    [
      { label: 'Planned', value: 2 },
      { label: 'Requested', value: 1 },
      { label: 'Launched', value: 3 },
    ] as NumericValueOption[],
    [
      { label: 'Planned', value: 2 },
      { label: 'Requested', value: 1 },
      { label: 'Deployed', value: 3 },
    ] as NumericValueOption[],
    [
      { label: strings.fieldReportConstantVisibilityPublicLabel, value: VISIBILITY_PUBLIC },
      { label: strings.fieldReportConstantVisibilityRCRCMovementLabel, value: VISIBILITY_RCRC_MOVEMENT },
      { label: strings.fieldReportConstantVisibilityIFRCSecretariatLabel, value: VISIBILITY_IFRC_SECRETARIAT },
    ] as NumericValueOption[],
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
                error={error?.fields?.dref}
                name="dref"
                onChange={onValueChange}
                options={drefOptions}
                radioKeySelector={numericOptionKeySelector}
                radioLabelSelector={optionLabelSelector}
                value={value.dref}
                clearable
              />
              <NumberInput
                label={strings.fieldsStep4PlannedResponseRowsDREFValueFieldLabel}
                name="dref_amount"
                value={value.dref_amount}
                onChange={onValueChange}
                error={error?.fields?.dref_amount}
              />
            </InputSection>
            <InputSection
              title={strings.fieldsStep4PlannedResponseRowsEmergencyAppealEVTEPIEWLabel}
            >
              <RadioInput
                error={error?.fields?.appeal}
                name="appeal"
                onChange={onValueChange}
                options={appealOptions}
                radioKeySelector={numericOptionKeySelector}
                radioLabelSelector={optionLabelSelector}
                value={value.appeal}
                clearable
              />
              <NumberInput
                label={strings.fieldsStep4PlannedResponseRowsEmergencyAppealValueFieldLabel}
                name="appeal_amount"
                value={value.appeal_amount}
                onChange={onValueChange}
                error={error?.fields?.appeal_amount}
              />
            </InputSection>
            <InputSection
              title={strings.fieldsStep4PlannedResponseRowsFactEVTEPIEWLabel}
            >
              <RadioInput
                error={error?.fields?.fact}
                name="fact"
                onChange={onValueChange}
                options={responseOptions}
                radioKeySelector={numericOptionKeySelector}
                radioLabelSelector={optionLabelSelector}
                value={value.fact}
                clearable
              />
              <NumberInput
                label={strings.fieldsStep4PlannedResponseRowsFactValueFieldLabel}
                name="num_fact"
                value={value.num_fact}
                onChange={onValueChange}
                error={error?.fields?.num_fact}
              />
            </InputSection>
            <InputSection
              title={strings.fieldsStep4PlannedResponseRowsIFRCStaffEVTEPIEWLabel}
            >
              <RadioInput
                error={error?.fields?.ifrc_staff}
                name="ifrc_staff"
                onChange={onValueChange}
                options={responseOptions}
                radioKeySelector={numericOptionKeySelector}
                radioLabelSelector={optionLabelSelector}
                value={value.ifrc_staff}
                clearable
              />
              <NumberInput
                label={strings.fieldsStep4PlannedResponseRowsIFRCStaffValueFieldLabel}
                name="num_ifrc_staff"
                value={value.num_ifrc_staff}
                onChange={onValueChange}
                error={error?.fields?.num_ifrc_staff}
              />
            </InputSection>
          </>
        )}
        {reportType === 'EW' && (
          <InputSection
            title={strings.fieldsStep4PlannedResponseRowsForecastBasedActionEWLabel}
          >
            <RadioInput
              error={error?.fields?.forecast_based_action}
              name="forecast_based_action"
              onChange={onValueChange}
              options={responseOptions}
              radioKeySelector={numericOptionKeySelector}
              radioLabelSelector={optionLabelSelector}
              value={value.forecast_based_action}
              clearable
            />
            <NumberInput
              label={strings.fieldsStep4PlannedResponseRowsForecastBasedActionValueFieldLabel}
              name="forecast_based_action_amount"
              value={value.forecast_based_action_amount}
              onChange={onValueChange}
              error={error?.fields?.forecast_based_action_amount}
            />
          </InputSection>
        )}
      </Container>
      <Container
        heading={strings.fieldReportFormContactsTitle}
        className={styles.contactsSection}
      >
        <InputSection
          title={strings.fieldsStep4ContactRowsOriginatorLabel}
          description={strings.fieldsStep4ContactRowsOriginatorEVTEPIEWDesc}
          multiRow
          twoColumn
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
          multiRow
          twoColumn
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
          multiRow
          twoColumn
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
          multiRow
          twoColumn
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
            radioKeySelector={numericOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            value={value.visibility}
          />
        </InputSection>
      </Container>
    </>
  );
}

export default ResponseFields;

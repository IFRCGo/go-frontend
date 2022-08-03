import React, {
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
  getErrorObject,
  useFormArray,
} from '@togglecorp/toggle-form';
import {
  isNotDefined,
  listToMap,
  randomString,
} from '@togglecorp/fujs';

import Container from '#components/Container';
import languageContext from '#root/languageContext';
import InputSection from '#components/InputSection';
import TextArea from '#components/TextArea';
import NeedInput from '#views/DrefApplicationForm/ActionsFields/NeedInput';
import Button from '#components/Button';
import SelectInput from '#components/SelectInput';
import RadioInput from '#components/RadioInput';

import {
  booleanOptionKeySelector,
  BooleanValueOption,
  DrefFinalReportFields,
  Need,
  optionLabelSelector,
  StringValueOption,
} from '../common';

import styles from './styles.module.scss';

type Value = PartialForm<DrefFinalReportFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  yesNoOptions: BooleanValueOption[];
  needOptions: StringValueOption[];
}

function Needs(props: Props) {
  const { strings } = useContext(languageContext);

  const {
    error: formError,
    onValueChange,
    value,
    yesNoOptions,
    needOptions,
  } = props;

  const error = useMemo(() => getErrorObject(formError), [formError]);

  const [need, setNeed] = useState<string | undefined>();
  const {
    setValue: onNeedChange,
    removeValue: onNeedRemove,
  } = useFormArray<'needs_identified', PartialForm<Need>>(
    'needs_identified',
    onValueChange,
  );

  type Needs = typeof value.needs_identified;
  const handleNeedAddButtonClick = useCallback(() => {
    const clientId = randomString();
    const newNeedItem: PartialForm<Need> = {
      clientId,
    };

    onValueChange(
      (oldValue: PartialForm<Needs>) => (
        [...(oldValue ?? []), newNeedItem]
      ),
      'needs_identified' as const,
    );
    setNeed(undefined);
  }, [onValueChange, setNeed]);

  const needsIdentifiedMap = useMemo(() => (
    listToMap(
      value?.needs_identified,
      need => need.title ?? '',
      need => true
    )
  ), [value.needs_identified]);

  const filteredNeedOptions = useMemo(() => (
    needsIdentifiedMap ? needOptions.filter(n => !needsIdentifiedMap[n.value]) : []
  ), [needsIdentifiedMap, needOptions]);

  const wantToReport = value.want_to_report;

  return (
    <>
      <Container
        heading={strings.finalReportFederationWideAndPartners}
      >
        <InputSection
          title={strings.finalReportWantToReport}
        >
          <RadioInput
            name={"want_to_report" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.want_to_report}
            onChange={onValueChange}
            error={error?.want_to_report}
          />
        </InputSection>
        {wantToReport &&
          <InputSection
            title={strings.finalReportAdditionalNationalSocietyAction}
          >
            <TextArea
              label={strings.cmpActionDescriptionLabel}
              name="additional_national_society_actions"
              onChange={onValueChange}
              value={value.additional_national_society_actions}
              error={error?.additional_national_society_actions}
            />
          </InputSection>
        }
      </Container>
      <Container
        heading={strings.finalReportMovementPartners}
      >
        <InputSection
          title={strings.finalReportIfrc}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="ifrc"
            onChange={onValueChange}
            value={value.ifrc}
            error={error?.ifrc}
          />
        </InputSection>
        <InputSection
          title={strings.finalReportIcrc}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="icrc"
            onChange={onValueChange}
            value={value.icrc}
            error={error?.icrc}
          />
        </InputSection>
        <InputSection
          title={strings.finalReportPartnerNationalSociety}
        >
          <TextArea
            name="partner_national_society"
            onChange={onValueChange}
            value={value.partner_national_society}
            error={error?.partner_national_society}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.finalReportNationalOtherActors}
        className={styles.otherActors}
      >
        <InputSection
          title={strings.finalReportInternationalAssistance}
        >
          <RadioInput
            name={"government_requested_assistance" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.government_requested_assistance}
            onChange={onValueChange}
            error={error?.government_requested_assistance}
          />
        </InputSection>
        <InputSection
          title={strings.finalReportNationalAuthorities}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="national_authorities"
            onChange={onValueChange}
            value={value.national_authorities}
            error={error?.national_authorities}
          />
        </InputSection>
        <InputSection
          title={strings.finalReportUNorOtherActors}
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="un_or_other_actor"
            onChange={onValueChange}
            value={value.un_or_other_actor}
            error={error?.un_or_other_actor}
          />
        </InputSection>
        <InputSection
          title={strings.finalReportCoordinationMechanism}
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="major_coordination_mechanism"
            onChange={onValueChange}
            value={value.major_coordination_mechanism}
            error={error?.major_coordination_mechanism}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.finalReportNeedsIdentified}
        className={styles.needsIdentified}
        visibleOverflow
      >
        <InputSection>
          <SelectInput
            label={strings.finalReportActionFieldsLabel}
            name={undefined}
            onChange={setNeed}
            options={filteredNeedOptions}
            value={need}
          />
          <div className={styles.actions}>
            <Button
              variant="secondary"
              name={need}
              onClick={handleNeedAddButtonClick}
              disabled={isNotDefined(need)}
            >
              Add
            </Button>
          </div>
        </InputSection>
        {value?.needs_identified?.map((n, i) => (
          <NeedInput
            key={n.clientId}
            index={i}
            value={n}
            onChange={onNeedChange}
            onRemove={onNeedRemove}
            error={getErrorObject(error?.needs_identified)}
            needOptions={needOptions}
          />
        ))}
      </Container>
    </>
  );
}

export default Needs;

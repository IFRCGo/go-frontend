import React from 'react';
import {
  randomString,
  isNotDefined,
  listToMap,
} from '@togglecorp/fujs';
import {
  PartialForm,
  Error,
  EntriesAsList,
  useFormArray,
} from '@togglecorp/toggle-form';

import Button from '#components/Button';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import SelectInput from '#components/SelectInput';
import RadioInput from '#components/RadioInput';
import TextArea from '#components/TextArea';
import LanguageContext from '#root/languageContext';

import {
  optionLabelSelector,
  DrefFields,
  BooleanValueOption,
  booleanOptionKeySelector,
  Need,
  NsAction,
  StringValueOption,
} from '../common';

import NeedInput from './NeedInput';
import NsActionInput from './NSActionInput';

import styles from './styles.module.scss';
import { string } from 'prop-types';

type Value = PartialForm<DrefFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  yesNoOptions: BooleanValueOption[];
  needOptions: StringValueOption[];
  nsActionOptions: StringValueOption[];
}

function ActionsFields(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    error,
    onValueChange,
    value,
    yesNoOptions,
    needOptions,
    nsActionOptions,
  } = props;

  const [need, setNeed] = React.useState<string | undefined>();
  const [nsAction, setNsAction] = React.useState<string | undefined>();
  const {
    onValueChange: onNeedChange,
    onValueRemove: onNeedRemove,
  } = useFormArray<'needs_identified', PartialForm<Need>>(
    'needs_identified',
    onValueChange,
  );
  const {
    onValueChange: onNsActionChange,
    onValueRemove: onNsActionRemove,
  } = useFormArray<'national_society_actions', PartialForm<NsAction>>(
    'national_society_actions',
    onValueChange,
  );

  type Needs = typeof value.needs_identified;
  const handleNeedAddButtonClick = React.useCallback((title) => {
    const clientId = randomString();
    const newList: PartialForm<Need> = {
      clientId,
      title,
    };

    onValueChange(
      (oldValue: PartialForm<Needs>) => (
        [...(oldValue ?? []), newList]
      ),
      'needs_identified' as const,
    );
    setNeed(undefined);
  }, [onValueChange, setNeed]);

  type NsActions = typeof value.needs_identified;
  const handleNsActionAddButtonClick = React.useCallback((title) => {
    const clientId = randomString();
    const newList: PartialForm<NsAction> = {
      clientId,
      title,
    };

    onValueChange(
      (oldValue: PartialForm<NsActions>) => (
        [...(oldValue ?? []), newList]
      ),
      'national_society_actions' as const,
    );
    setNsAction(undefined);
  }, [onValueChange, setNsAction]);

  const needsIdentifiedMap = React.useMemo(() => (
    listToMap(
      value.needs_identified,
      d => d.title ?? '',
      d => true
    )
  ), [value.needs_identified]);

  const filteredNeedOptions = needOptions.filter(n => !needsIdentifiedMap[n.value]);

  const nsActionsMap = React.useMemo(() => (
    listToMap(
      value.national_society_actions,
      d => d.title ?? '',
      d => true
    )
  ), [value.national_society_actions]);
  const filteredNsActionOptions = nsActionOptions.filter(n => !nsActionsMap[n.value]);

  return (
    <>
      <Container
        heading={strings.nationalSocietiesActions}
        className={styles.nationalSocietyActions}
      >
        <InputSection>
          <SelectInput
            label={strings.nationalSocietiesActionsLabel}
            name={undefined}
            options={filteredNsActionOptions}
            value={nsAction}
            onChange={setNsAction}
          />
          <div className={styles.actions}>
            <Button
              variant="secondary"
              name={nsAction}
              onClick={handleNsActionAddButtonClick}
              disabled={isNotDefined(nsAction)}
            >
              Add
            </Button>
          </div>
        </InputSection>
        {value?.national_society_actions?.map((n, i) => (
          <NsActionInput
            key={n.clientId}
            index={i}
            value={n}
            onChange={onNsActionChange}
            onRemove={onNsActionRemove}
            error={error?.fields?.national_society_actions}
            nsActionOptions={nsActionOptions}
          />
        ))}
      </Container>
      <Container
        heading={strings.nationalOtherActors}
        className={styles.otherActions}
      >
        <InputSection
          title={strings.internationalAssistance}
        >
          <RadioInput
            name="government_requested_assistance"
            options={yesNoOptions}
            radioKeySelector={booleanOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            value={value.government_requested_assistance}
            onChange={onValueChange}
            error={error?.fields?.government_requested_assistance}
          />
        </InputSection>
        <InputSection
          title={strings.nationalAuthorities}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            onChange={onValueChange}
            value={value.national_authorities}
            error={error?.fields?.national_authorities}
            placeholder="If selected, max 300 characters"
          />
        </InputSection>
        <InputSection
          title={strings.rCRCPartnerNss}
        >
          <TextArea
            name="rcrc_partners"
            onChange={onValueChange}
            value={value.rcrc_partners}
            error={error?.fields?.rcrc_partners}
            placeholder="If selected, max 300 characters"
          />
        </InputSection>
        <InputSection
          title={strings.iCRC}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="icrc"
            onChange={onValueChange}
            value={value.icrc}
            error={error?.fields?.icrc}
            placeholder="If selected, max 300 characters"
          />
        </InputSection>
        <InputSection
          title={strings.uNorOtherActors}
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="un_or_other"
            onChange={onValueChange}
            value={value.un_or_other}
            error={error?.fields?.un_or_other}
            placeholder="If selected, max 300 characters"
          />
        </InputSection>
        <InputSection
          title={strings.coordinationMechanism}
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="major_coordination_mechanism"
            onChange={onValueChange}
            value={value.major_coordination_mechanism}
            error={error?.fields?.major_coordination_mechanism}
            placeholder="If selected, max 300 characters"
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.needsIdentified}
        className={styles.needsIdentified}
      >
        <InputSection>
          <SelectInput
            label={strings.actionFieldsLabel}
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
            error={error?.fields?.needs_identified}
            needOptions={needOptions}
          />
        ))}
        <InputSection
          title={strings.gapsInAssessment}
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="identified_gaps"
            onChange={onValueChange}
            value={value.identified_gaps}
            error={error?.fields?.identified_gaps}
            placeholder="Max 300 characters"
          />
        </InputSection>
      </Container>
    </>
  );
}

export default ActionsFields;

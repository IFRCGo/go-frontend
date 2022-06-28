import React from 'react';
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
import NsActionInput from '#views/DrefApplicationForm/ActionsFields/NSActionInput';

import {
  booleanOptionKeySelector,
  BooleanValueOption,
  DrefFinalReportFields,
  Need,
  NsAction,
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
  nsActionOptions: StringValueOption[];
  fileIdToUrlMap: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

function Needs(props: Props) {
  const { strings } = React.useContext(languageContext);

  const {
    error: formError,
    onValueChange,
    value,
    yesNoOptions,
    needOptions,
    nsActionOptions,
    fileIdToUrlMap,
    setFileIdToUrlMap
  } = props;

  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError]
  );

  const [need, setNeed] = React.useState<string | undefined>();
  const [nsAction, setNsAction] = React.useState<string | undefined>();
  const {
    setValue: onNeedChange,
    removeValue: onNeedRemove,
  } = useFormArray<'needs_identified', PartialForm<Need>>(
    'needs_identified',
    onValueChange,
  );

  type Needs = typeof value.needs_identified;
  const handleNeedAddButtonClick = React.useCallback((title?: string) => {
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

  const needsIdentifiedMap = React.useMemo(() => (
    listToMap(
      value.needs_identified,
      d => d.title ?? '',
      d => true,
    )
  ), [value.needs_identified]);

  const filteredNeedOptions = needsIdentifiedMap ? needOptions.filter(n => !needsIdentifiedMap[n.value]) : [];

  return (
    <>
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

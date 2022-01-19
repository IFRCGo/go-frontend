import React, { useContext } from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
  SetBaseValueArg,
  getErrorObject,
} from '@togglecorp/toggle-form';

import Checklist from '#components/Checklist';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import TextArea from '#components/TextArea';
import languageContext from '#root/languageContext';
import { listErrorToString } from '#utils/form';

import {
  ActionsByOrganization,
  BooleanValueOption,
  InformalUpdateFields,
  numericOptionKeySelector,
  optionLabelSelector
} from '../common';

// import styles from './styles.module.scss';

type Value = PartialForm<InformalUpdateFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  yesNoOptions: BooleanValueOption[];
  value: Value;
  onValueSet: (value: SetBaseValueArg<Value>) => void;
  actionOptions: ActionsByOrganization;
}

function ActionsOverview(props: Props) {
  const { strings } = useContext(languageContext);
  const {
    error: formError,
    onValueChange,
    value,
    actionOptions,
  } = props;

  const error = getErrorObject(formError);

  return (
    <>
      <Container
        heading={strings.informalUpdateFormActionTakenTitle}
      >
        <InputSection
          title={strings.informalUpdateFormActionTakenByNationalSocietyLabel}
          description={strings.informalUpdateFormActionTakenByNationalSocietyDescription}
        >
          <TextArea
            name="actions_ntls_desc"
            value={value.actions_ntls_desc}
            onChange={onValueChange}
            error={error?.actions_ntls_desc}
            placeholder={strings.informalUpdateFormActionTakenByNationalSocietyPlaceholder}
          />
        </InputSection>
        <InputSection>
          <Checklist
            name="actions_ntls"
            onChange={onValueChange}
            options={actionOptions.NTLS}
            labelSelector={optionLabelSelector}
            keySelector={numericOptionKeySelector}
            tooltipSelector={d => d.description}
            value={value.actions_ntls}
            error={listErrorToString(error?.actions_ntls)}
          />
        </InputSection>
      </Container>
      <Container>
        <InputSection
          title={strings.informalUpdateFormActionTakenByIfrcLabel}
          description={strings.informalUpdateFormActionTakenByRcrcDescription}
        >
          <TextArea
            name="actions_ifrc_desc"
            value={value.actions_ifrc_desc}
            onChange={onValueChange}
            error={error?.actions_ifrc_desc}
            placeholder={strings.informalUpdateFormActionTakenByRcrcPlaceholder}
          />
        </InputSection>
        <InputSection>
          <Checklist
            name="actions_ifrc"
            onChange={onValueChange}
            options={actionOptions.FDRN}
            labelSelector={optionLabelSelector}
            keySelector={numericOptionKeySelector}
            tooltipSelector={d => d.description}
            value={value.actions_ifrc}
            error={listErrorToString(error?.actions_ifrc)}
          />
        </InputSection>
      </Container>
      <Container>
        <InputSection
          title={strings.informalUpdateFormActionTakenByRcrcLabel}
          description={strings.informalUpdateFormActionTakenByRcrcDescription}
        >
          <TextArea
            name="actions_rcrc_desc"
            value={value.actions_rcrc_desc}
            onChange={onValueChange}
            error={error?.actions_rcrc_desc}
            placeholder={strings.informalUpdateFormActionTakenByRcrcPlaceholder}
          />
        </InputSection>
        <InputSection>
          <Checklist
            name="actions_rcrc"
            onChange={onValueChange}
            options={actionOptions.PNS}
            labelSelector={optionLabelSelector}
            keySelector={numericOptionKeySelector}
            tooltipSelector={d => d.description}
            value={value.actions_rcrc}
            error={listErrorToString(error?.actions_rcrc)}
          />
        </InputSection>
      </Container>

      <Container>
        <InputSection
          title={strings.informalUpdateFormActionTakenByGovernmentLabel}
          description={strings.informalUpdateFormActionTakenByGovernmentDescription}
        >
          <TextArea
            name="actions_government_desc"
            value={value.actions_government_desc}
            onChange={onValueChange}
            error={error?.actions_government_desc}
            placeholder={strings.informalUpdateFormActionTakenByGovernmentPlaceholder}
          />
        </InputSection>
        <InputSection>
          <Checklist
            name="actions_government"
            onChange={onValueChange}
            options={actionOptions.GOV}
            labelSelector={optionLabelSelector}
            keySelector={numericOptionKeySelector}
            tooltipSelector={d => d.description}
            value={value.actions_government}
            error={listErrorToString(error?.actions_government)}
          />
        </InputSection>

      </Container>
    </>
  );
}

export default ActionsOverview;

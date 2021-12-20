import Checklist from '#components/Checklist';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import NumberInput from '#components/NumberInput';
import TextArea from '#components/TextArea';
import TextInput from '#components/TextInput';
import languageContext from '#root/languageContext';
import { PartialForm, Error, EntriesAsList, StateArg } from '@togglecorp/toggle-form';
import React, { useContext } from 'react';
import { ActionsByOrganization, BooleanValueOption, InformalUpdateFields, numericOptionKeySelector, NumericValueOption, optionLabelSelector } from '../common';
import styles from './styles.module.scss';

type Value = PartialForm<InformalUpdateFields>;
interface Props {
    error: Error<Value> | undefined;
    onValueChange: (...entries: EntriesAsList<Value>) => void;
    yesNoOptions: BooleanValueOption[];
    value: Value;
    onValueSet: (value: StateArg<Value>) => void;
    actionOptions: ActionsByOrganization;
}

function ActionsOverview(props: Props) {
    const { strings } = useContext(languageContext);
    const {
        error,
        onValueChange,
        value,
        actionOptions,
    } = props;
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
                        name="actions_taken_by_national_society"
                        value={value.actions_taken_by_national_society}
                        onChange={onValueChange}
                        error={error?.fields?.actions_taken_by_national_society}
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
                        error={error?.fields?.actions_ntls?.$internal}
                    /></InputSection>
            </Container>
            <Container>
                <InputSection
                    title={strings.informalUpdateFormActionTakenByIfrcLabel}
                    description={strings.informalUpdateFormActionTakenByRcrcDescription}
                >
                    <TextArea
                        name="actions_taken_by_national_society"
                        value={value.actions_taken_by_national_society}
                        onChange={onValueChange}
                        error={error?.fields?.actions_taken_by_national_society}
                        placeholder={strings.informalUpdateFormActionTakenByRcrcPlaceholder}
                    />
                </InputSection>
                <InputSection>
                    <Checklist
                        name="actions_fdrn"
                        onChange={onValueChange}
                        options={actionOptions.FDRN}
                        labelSelector={optionLabelSelector}
                        keySelector={numericOptionKeySelector}
                        tooltipSelector={d => d.description}
                        value={value.actions_fdrn}
                        error={error?.fields?.actions_fdrn?.$internal}
                    /></InputSection>
            </Container>
            <Container>
                <InputSection
                    title={strings.informalUpdateFormActionTakenByRcrcLabel}
                    description={strings.informalUpdateFormActionTakenByRcrcDescription}
                >
                    <TextArea
                        name="actions_taken_by_national_society"
                        value={value.actions_taken_by_national_society}
                        onChange={onValueChange}
                        error={error?.fields?.actions_taken_by_national_society}
                        placeholder={strings.informalUpdateFormActionTakenByRcrcPlaceholder}
                    />
                </InputSection>
                <InputSection>
                    <Checklist
                        name="actions_pns"
                        onChange={onValueChange}
                        options={actionOptions.PNS}
                        labelSelector={optionLabelSelector}
                        keySelector={numericOptionKeySelector}
                        tooltipSelector={d => d.description}
                        value={value.actions_pns}
                        error={error?.fields?.actions_pns?.$internal}
                    /></InputSection>
            </Container>

            <Container>
                <InputSection
                    title={strings.informalUpdateFormActionTakenByGovernmentLabel}
                    description={strings.informalUpdateFormActionTakenByGovernmentDescription}
                >
                    <TextArea
                        name="actions_taken_by_national_society"
                        value={value.actions_taken_by_national_society}
                        onChange={onValueChange}
                        error={error?.fields?.actions_taken_by_national_society}
                        placeholder={strings.informalUpdateFormActionTakenByGovernmentPlaceholder}
                    />
                </InputSection>

            </Container>
        </>
    );
}

export default ActionsOverview;

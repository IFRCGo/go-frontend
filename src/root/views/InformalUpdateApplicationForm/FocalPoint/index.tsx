import Container from '#components/Container';
import InputSection from '#components/InputSection';
import RadioInput from '#components/RadioInput';
import TextInput from '#components/TextInput';
import languageContext from '#root/languageContext';
import { optionDescriptionSelector } from '#views/FieldReportForm/common';
import {
    EntriesAsList,
    PartialForm,
    Error,
    StateArg,
} from '@togglecorp/toggle-form';
import React, { useContext } from 'react';
import { BooleanValueOption, InformalUpdateFields, numericOptionKeySelector, NumericValueOption, optionLabelSelector } from '../common';

import styles from './styles.module.scss';

type Value = PartialForm<InformalUpdateFields>;

interface Props {
    error: Error<Value> | undefined;
    onValueChange: (...entries: EntriesAsList<Value>) => void;
    yesNoOptions: BooleanValueOption[];
    value: Value;
    shareWithOptions: NumericValueOption[];
    onValueSet: (value: StateArg<Value>) => void;
}

function FocalPoints(props: Props) {
    const { strings } = useContext(languageContext);
    const {
        error,
        onValueChange,
        value,
        shareWithOptions,
    } = props;

    return (
        <>
            <Container>
                <InputSection
                    title={strings.informalUpdateFormFocalOriginatorTitle}
                    description={strings.informalUpdateFormFocalOriginatorDescription}
                >
                    <TextInput
                        name="originator_name"
                        value={value.originator_name}
                        onChange={onValueChange}
                        error={error?.fields?.originator_name}
                        label={strings.informalUpdateFormFocalOriginatorNameLabel}
                    />
                    <TextInput
                        name="originator_title"
                        value={value.originator_title}
                        onChange={onValueChange}
                        error={error?.fields?.originator_title}
                        label={strings.informalUpdateFormFocalOriginatorTitleLabel}
                    />
                </InputSection>
                <InputSection>
                    <TextInput
                        name="originator_email"
                        value={value.originator_email}
                        onChange={onValueChange}
                        error={error?.fields?.originator_email}
                        label={strings.informalUpdateFormFocalOriginatorEmailLabel}
                    />
                    <TextInput
                        name="originator_phone_number"
                        value={value.originator_phone_number}
                        onChange={onValueChange}
                        error={error?.fields?.originator_phone_number}
                        label={strings.informalUpdateFormFocalOriginatorPhoneLabel}
                    />

                </InputSection>

                <InputSection
                    title={strings.informalUpdateFormFocalIfrcTitle}
                    description={strings.informalUpdateFormFocalIfrcDescription}
                >
                    <TextInput
                        name="ifrc_appeal_manager_name"
                        value={value.ifrc_appeal_manager_name}
                        onChange={onValueChange}
                        error={error?.fields?.ifrc_appeal_manager_name}
                        label={strings.informalUpdateFormFocalIfrcNameLabel}
                    />
                    <TextInput
                        name="ifrc_appeal_manager_title"
                        value={value.ifrc_appeal_manager_title}
                        onChange={onValueChange}
                        error={error?.fields?.ifrc_appeal_manager_title}
                        label={strings.informalUpdateFormFocalIfrcTitleLabel}
                    />
                </InputSection>
                <InputSection>
                    <TextInput
                        name="ifrc_appeal_manager_email"
                        value={value.ifrc_appeal_manager_email}
                        onChange={onValueChange}
                        error={error?.fields?.ifrc_appeal_manager_email}
                        label={strings.informalUpdateFormFocalIfrcEmailLabel}
                    />
                    <TextInput
                        name="ifrc_appeal_manager_phone_number"
                        value={value.ifrc_appeal_manager_phone_number}
                        onChange={onValueChange}
                        error={error?.fields?.ifrc_appeal_manager_phone_number}
                        label={strings.informalUpdateFormFocalIfrcPhoneLabel}
                    />
                </InputSection>
            </Container>
            <Container>
                <InputSection
                    title={strings.informalUpdateFormFocalIfrcShareWithTitle}
                    description={strings.informalUpdateFormFocalIfrcShareWithDescription}
                >
                    <RadioInput
                        name="ifrc_share_with"
                        options={shareWithOptions}
                        radioKeySelector={numericOptionKeySelector}
                        radioLabelSelector={optionLabelSelector}
                        radioDescriptionSelector={optionDescriptionSelector}
                        value={value.ifrc_share_with}
                        error={error?.fields?.ifrc_share_with}
                        onChange={onValueChange}
                    />

                </InputSection>
            </Container>
        </>
    );
}

export default FocalPoints;

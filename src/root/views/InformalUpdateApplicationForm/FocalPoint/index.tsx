import React, { useContext } from 'react';
import {
  EntriesAsList,
  PartialForm,
  Error,
  getErrorObject,
} from '@togglecorp/toggle-form';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import RadioInput from '#components/RadioInput';
import TextInput from '#components/TextInput';
import languageContext from '#root/languageContext';
import { optionDescriptionSelector } from '#views/FieldReportForm/common';
import {
  StringValueOption
} from '#types';
import {
  InformalUpdateFields,
  optionLabelSelector,
  stringOptionKeySelector,
} from '../common';

type Value = PartialForm<InformalUpdateFields>;

interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  shareWithOptions: StringValueOption[];
}

function FocalPoints(props: Props) {
  const { strings } = useContext(languageContext);
  const {
    error: formError,
    onValueChange,
    value,
    shareWithOptions,
  } = props;

  const error = getErrorObject(formError);

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
            error={error?.originator_name}
            label={strings.informalUpdateFormFocalOriginatorNameLabel}
          />
          <TextInput
            name="originator_title"
            value={value.originator_title}
            onChange={onValueChange}
            error={error?.originator_title}
            label={strings.informalUpdateFormFocalOriginatorTitleLabel}
          />
        </InputSection>
        <InputSection>
          <TextInput
            name="originator_email"
            value={value.originator_email}
            onChange={onValueChange}
            error={error?.originator_email}
            label={strings.informalUpdateFormFocalOriginatorEmailLabel}
          />
          <TextInput
            name="originator_phone"
            value={value.originator_phone}
            onChange={onValueChange}
            error={error?.originator_phone}
            label={strings.informalUpdateFormFocalOriginatorPhoneLabel}
          />
        </InputSection>

        <InputSection
          title={strings.informalUpdateFormFocalIfrcTitle}
          description={strings.informalUpdateFormFocalIfrcDescription}
        >
          <TextInput
            name="ifrc_name"
            value={value.ifrc_name}
            onChange={onValueChange}
            error={error?.ifrc_name}
            label={strings.informalUpdateFormFocalIfrcNameLabel}
          />
          <TextInput
            name="ifrc_title"
            value={value.ifrc_title}
            onChange={onValueChange}
            error={error?.ifrc_title}
            label={strings.informalUpdateFormFocalIfrcTitleLabel}
          />
        </InputSection>
        <InputSection>
          <TextInput
            name="ifrc_email"
            value={value.ifrc_email}
            onChange={onValueChange}
            error={error?.ifrc_email}
            label={strings.informalUpdateFormFocalIfrcEmailLabel}
          />
          <TextInput
            name="ifrc_phone"
            value={value.ifrc_phone}
            onChange={onValueChange}
            error={error?.ifrc_phone}
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
            name="share_with"
            options={shareWithOptions}
            radioKeySelector={stringOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            radioDescriptionSelector={optionDescriptionSelector}
            value={value.share_with}
            error={error?.share_with}
            onChange={onValueChange}
          />

        </InputSection>
      </Container>
    </>
  );
}

export default FocalPoints;

import React, { useContext } from 'react';
import {
  EntriesAsList,
  PartialForm,
  Error,
  getErrorObject,
} from '@togglecorp/toggle-form';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import TextInput from '#components/TextInput';
import languageContext from '#root/languageContext';
import {
  StringValueOption
} from '#types';
import {
  FlashUpdateFields,
} from '../common';

type Value = PartialForm<FlashUpdateFields>;

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
  } = props;

  const error = getErrorObject(formError);

  return (
    <>
      <Container>
        <InputSection
          title={strings.flashUpdateFormFocalOriginatorTitle}
          description={strings.flashUpdateFormFocalOriginatorDescription}
        >
          <TextInput
            name="originator_name"
            value={value.originator_name}
            onChange={onValueChange}
            error={error?.originator_name}
            label={strings.flashUpdateFormFocalOriginatorNameLabel}
          />
          <TextInput
            name="originator_title"
            value={value.originator_title}
            onChange={onValueChange}
            error={error?.originator_title}
            label={strings.flashUpdateFormFocalOriginatorTitleLabel}
          />
        </InputSection>
        <InputSection>
          <TextInput
            name="originator_email"
            value={value.originator_email}
            onChange={onValueChange}
            error={error?.originator_email}
            label={strings.flashUpdateFormFocalOriginatorEmailLabel}
          />
          <TextInput
            name="originator_phone"
            value={value.originator_phone}
            onChange={onValueChange}
            error={error?.originator_phone}
            label={strings.flashUpdateFormFocalOriginatorPhoneLabel}
          />
        </InputSection>

        <InputSection
          title={strings.flashUpdateFormFocalIfrcTitle}
          description={strings.flashUpdateFormFocalIfrcDescription}
        >
          <TextInput
            name="ifrc_name"
            value={value.ifrc_name}
            onChange={onValueChange}
            error={error?.ifrc_name}
            label={strings.flashUpdateFormFocalIfrcNameLabel}
          />
          <TextInput
            name="ifrc_title"
            value={value.ifrc_title}
            onChange={onValueChange}
            error={error?.ifrc_title}
            label={strings.flashUpdateFormFocalIfrcTitleLabel}
          />
        </InputSection>
        <InputSection>
          <TextInput
            name="ifrc_email"
            value={value.ifrc_email}
            onChange={onValueChange}
            error={error?.ifrc_email}
            label={strings.flashUpdateFormFocalIfrcEmailLabel}
          />
          <TextInput
            name="ifrc_phone"
            value={value.ifrc_phone}
            onChange={onValueChange}
            error={error?.ifrc_phone}
            label={strings.flashUpdateFormFocalIfrcPhoneLabel}
          />
        </InputSection>
      </Container>
      <Container>
        <InputSection
          title={strings.flashUpdateFormVisibilityTitle}
        >
          <div>
            {strings.flashUpdateFormVisibilityDescription}
          </div>
        </InputSection>
      </Container>
    </>
  );
}

export default FocalPoints;

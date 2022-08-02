import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
  getErrorObject,
} from '@togglecorp/toggle-form';

import Container from '#components/Container';
import LanguageContext from '#root/languageContext';
import InputSection from '#components/InputSection';
import TextInput from '#components/TextInput';

import { EapFormFields } from '../common';

import styles from './styles.module.scss';

type Value = PartialForm<EapFormFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
}

function Contacts(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    error: formError,
    onValueChange,
    value,
  } = props;

  const error = getErrorObject(formError);

  return (
    <Container
      className={styles.contacts}
      heading={strings.eapsFormContacts}
    >
      <InputSection
        title={strings.eapsFormOriginator}
        description={strings.eapsFormOriginatorDescription}
        multiRow
        twoColumn
      >
        <TextInput
          label="Name"
          name="originator_name"
          value={value?.originator_name}
          onChange={onValueChange}
          error={error?.originator_name}
        />
        <TextInput
          label="Title"
          name="originator_title"
          value={value?.originator_title}
          onChange={onValueChange}
          error={error?.originator_title}
        />
        <TextInput
          label="Email"
          name="originator_email"
          value={value?.originator_email}
          onChange={onValueChange}
          error={error?.originator_email}
        />
        <TextInput
          label="Phone Number"
          name="originator_email"
          value={value?.originator_phone}
          onChange={undefined}
          error={undefined}
        />
      </InputSection>
      <InputSection
        title={strings.eapsFormNationalSocietyContact}
        description={strings.eapsFormNationalSocietyContactDescription}
        multiRow
        twoColumn
      >
        <TextInput
          label="Name"
          name="nsc_name"
          value={value?.nsc_name}
          onChange={onValueChange}
          error={error?.nsc_name}
        />
        <TextInput
          label="Title"
          name="nsc_title"
          value={value?.nsc_title}
          onChange={onValueChange}
          error={error?.nsc_title}
        />
        <TextInput
          label="Email"
          name="nsc_email"
          value={value?.nsc_email}
          onChange={onValueChange}
          error={error?.nsc_email}
        />
        <TextInput
          label="Phone Number"
          name="nsc_phone"
          value={value?.nsc_phone}
          onChange={onValueChange}
          error={error?.nsc_phone}
        />
      </InputSection>
      <InputSection
        title={strings.eapsFormIFRCFocalPoint}
        description={strings.eapsFormIFRCFocalPointDescription}
        multiRow
        twoColumn
      >
        <TextInput
          label="Name"
          name="ifrc_focal_name"
          value={value?.ifrc_focal_name}
          onChange={onValueChange}
          error={error?.ifrc_focal_name}
        />
        <TextInput
          label="Title"
          name="ifrc_focal_title"
          value={value?.ifrc_focal_title}
          onChange={onValueChange}
          error={error?.ifrc_focal_title}
        />
        <TextInput
          label="Email"
          name="ifrc_focal_email"
          value={value?.ifrc_focal_email}
          onChange={onValueChange}
          error={error?.ifrc_focal_email}
        />
        <TextInput
          label="Phone Number"
          name="ifrc_focal_phone"
          value={value?.ifrc_focal_phone}
          onChange={onValueChange}
          error={error?.ifrc_focal_phone}
        />
      </InputSection>
    </Container>
  );
}
export default Contacts;

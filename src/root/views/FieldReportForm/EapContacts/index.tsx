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
import {
  EapActivation,
} from '../common';

import styles from './styles.module.scss';

type EarlyActionContactValue = PartialForm<EapActivation>;

export interface Props {
  error: Error<EarlyActionContactValue> | undefined;
  onValueChange: (...entries: EntriesAsList<EarlyActionContactValue>) => void;
  value: EarlyActionContactValue;
}

function EapContact(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    error: formError,
    onValueChange,
    value,
  } = props;

  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError],
  );

  return (
    <Container
      visibleOverflow
      className={styles.contacts}
      heading={strings.eapsFieldReportFormContacts}
    >
      <InputSection
        title={strings.eapsFieldReportFormOriginator}
        description={strings.eapsFormFieldReportOriginatorDescription}
        multiRow
        twoColumn
      >
        <TextInput
          label="Name"
          name="originator_name"
          value={value.originator_name}
          onChange={onValueChange}
          error={error?.originator_name}
        />
        <TextInput
          label="Title"
          name="originator_title"
          value={value.originator_title}
          onChange={onValueChange}
          error={error?.originator_title}
        />
        <TextInput
          label="Email"
          name="originator_email"
          value={value.originator_email}
          onChange={onValueChange}
          error={error?.originator_email}
        />
      </InputSection>
      <InputSection
        title={strings.eapsFormFieldReportNationalSocietyContact}
        description={strings.eapsFormFieldReportNationalSocietyContactDescription}
        multiRow
        twoColumn
      >
        <TextInput
          label="Name"
          name="nsc_name_operational"
          value={value.nsc_name_operational}
          onChange={onValueChange}
          error={error?.nsc_name_operational}
        />
        <TextInput
          label="Title"
          name="nsc_title_operational"
          value={value.nsc_title_operational}
          onChange={onValueChange}
          error={error?.nsc_title_operational}
        />
        <TextInput
          label="Email"
          name="nsc_email_operational"
          value={value.nsc_email_operational}
          onChange={onValueChange}
          error={error?.nsc_email_operational}
        />
      </InputSection>
      <InputSection
        title="National Society Contact"
        description="Secretary General (or equivalent)"
        multiRow
        twoColumn
      >
        <TextInput
          label="Name"
          name="nsc_name_secretary"
          value={value.nsc_name_secretary}
          onChange={onValueChange}
          error={error?.nsc_name_secretary}
        />
        <TextInput
          label="Title"
          name="nsc_title_secretary"
          value={value.nsc_title_secretary}
          onChange={onValueChange}
          error={error?.nsc_title_secretary}
        />
        <TextInput
          label="Email"
          name="nsc_email_secretary"
          value={value.nsc_email_secretary}
          onChange={onValueChange}
          error={error?.nsc_email_secretary}
        />
      </InputSection>
      <InputSection
        title={strings.eapsFormFieldReportIFRCFocalPoint}
        description={strings.eapsFormFieldReportIFRCFocalPointDescription}
        multiRow
        twoColumn
      >
        <TextInput
          label="Name"
          name="ifrc_focal_name"
          value={value.ifrc_focal_name}
          onChange={onValueChange}
          error={error?.ifrc_focal_name}
        />
        <TextInput
          label="Title"
          name="ifrc_focal_title"
          value={value.ifrc_focal_title}
          onChange={onValueChange}
          error={error?.ifrc_focal_title}
        />
        <TextInput
          label="Email"
          name="ifrc_focal_email"
          value={value.ifrc_focal_email}
          onChange={onValueChange}
          error={error?.ifrc_focal_email}
        />
      </InputSection>
    </Container>
  );
}
export default EapContact;

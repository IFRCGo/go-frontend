import React from 'react';
import Container from '#components/Container';
import LanguageContext from '#root/languageContext';

import InputSection from '#components/InputSection';
import TextInput from '#components/TextInput';
import styles from './styles.module.scss';

function Contacts() {
  const { strings } = React.useContext(LanguageContext);

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
          name="ifrc_appeal_manager_name"
          value={undefined}
          onChange={undefined}
          error={undefined}
        />
        <TextInput
          label="Title"
          name="ifrc_appeal_manager_title"
          value={undefined}
          onChange={undefined}
          error={undefined}
        />
        <TextInput
          label="Email"
          name="ifrc_appeal_manager_email"
          value={undefined}
          onChange={undefined}
          error={undefined}
        />
        <TextInput
          label="Phone Number"
          name="ifrc_appeal_manager_phone_number"
          value={undefined}
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
          name="ifrc_appeal_manager_name"
          value={undefined}
          onChange={undefined}
          error={undefined}
        />
        <TextInput
          label="Title"
          name="ifrc_appeal_manager_title"
          value={undefined}
          onChange={undefined}
          error={undefined}
        />
        <TextInput
          label="Email"
          name="ifrc_appeal_manager_email"
          value={undefined}
          onChange={undefined}
          error={undefined}
        />
        <TextInput
          label="Phone Number"
          name="ifrc_appeal_manager_phone_number"
          value={undefined}
          onChange={undefined}
          error={undefined}
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
          name="ifrc_appeal_manager_name"
          value={undefined}
          onChange={undefined}
          error={undefined}
        />
        <TextInput
          label="Title"
          name="ifrc_appeal_manager_title"
          value={undefined}
          onChange={undefined}
          error={undefined}
        />
        <TextInput
          label="Email"
          name="ifrc_appeal_manager_email"
          value={undefined}
          onChange={undefined}
          error={undefined}
        />
        <TextInput
          label="Phone Number"
          name="ifrc_appeal_manager_phone_number"
          value={undefined}
          onChange={undefined}
          error={undefined}
        />
      </InputSection>
    </Container>
  );
}
export default Contacts;

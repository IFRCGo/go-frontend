import React from 'react';
import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import SelectInput from '#components/SelectInput';

import styles from './styles.module.scss';
import DateInput from '#components/DateInput';

function PerOverview() {
  const { strings } = React.useContext(LanguageContext);

  return (
    <>
      <Container
        className={styles.sharing}
        visibleOverflow
      >
        <InputSection
          title={strings.drefFormNationalSociety}
          multiRow
          oneColumn
        >
          <SelectInput
            error={undefined}
            name="national society"
            onChange={undefined}
            options={undefined}
            pending={undefined}
            value={undefined}
          />
        </InputSection>
      </Container>
      <Container
        heading="Orientation"
        className={styles.sharing}
        visibleOverflow
      >
        <InputSection
          title={strings.drefFormNationalSociety}
          multiRow
          oneColumn
        >
          <DateInput
            error={undefined}
            name="date of orientation"
            onChange={undefined}
            value={undefined}
          />
        </InputSection>
      </Container>
    </>
  );
}

export default PerOverview;

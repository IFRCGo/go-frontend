import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';
import Container from '#components/Container';
import InputSection from '#components/InputSection';

import languageContext from '#root/languageContext';

import {
  EapsFields,
  BooleanValueOption,
} from '../common';
import styles from './styles.module.scss';
import SearchSelectInput from '#components/SearchSelectInput';

type Value = PartialForm<EapsFields>;

interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  yesNoOptions: BooleanValueOption[];
  isImminentOnset: boolean;
  fileIdToUrlMap?: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;

}

function EapOverview() {
  const { strings } = React.useContext(languageContext);

  return (
    <Container
      className={styles.eapOverview}
      contentClassName={styles.content}
      heading={strings.eapsFormEapOverviewHeading}
    >
      <InputSection
        title={strings.eapsFormEapCountry}>
        <SearchSelectInput
          name="eap_country"
          value={undefined}
          onChange={undefined}
          error={undefined}
        >
        </SearchSelectInput>
        <SearchSelectInput
          label="Province/Region"
          name="region"
          value={undefined}
          onChange={undefined}
          error={undefined}
        >
        </SearchSelectInput>
      </InputSection>
      <InputSection
        title={strings.eapsFormEapCountry}>
      </InputSection>
    </Container>
  );
}

export default EapOverview;
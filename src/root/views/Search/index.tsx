import React from 'react';
import AsyncSelect from 'react-select/async';
import { _cs } from '@togglecorp/fujs';
import LanguageContext from '#root/languageContext';
import Page from '#components/Page';
import Container from '#components/Container';

import styles from './styles.module.scss';

interface Props {
  className?: string;
}

function Search(props: Props) {
  const {
    className,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  return (
    <Page
      className={_cs(styles.searchDetails, className)}
      title={strings.threeWPageTitle}
      heading="Search for keyword"
      withMainContentBackground
      description={(
        <AsyncSelect
          placeholder={strings.headerSearchPlaceholder}
          select={false}
        />
      )}
    >
      <Container
        heading="Country"
        description="Philippines"
      >
      </Container>
      <Container
        heading="Emergencies"
      >
      </Container>
    </Page>
  );
}

export default Search;
import React from 'react';

import Page from '#goui/components/Page';
import HighlightedOperations from './HighlightedOperations';

import strings from './strings';
import styles from './styles.module.scss';

function Home() {
  return (
    <Page
      title={strings.pageTitle}
      className={styles.home}
      heading={strings.pageHeading}
      description={strings.pageDescription}
    >
      <HighlightedOperations />
    </Page>
  );
}

export default Home;

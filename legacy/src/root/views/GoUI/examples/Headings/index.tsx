import React from 'react';
import Header from '#views/GoUI/components/Header';
import Heading from '#views/GoUI/components/Heading';

import styles from './styles.module.scss';

function Headings() {
  return (
    <div className={styles.headings}>
      <Header>
        <Heading>
          Headings
        </Heading>
      </Header>
      <div>
        <Heading level={1}>
          This is Heading 1 (h1)
        </Heading>
        <Heading level={2}>
          This is Heading 2 (h2)
        </Heading>
        <Heading level={3}>
          This is Heading 3 (h3)
        </Heading>
        <Heading level={4}>
          This is Heading 4 (h4)
        </Heading>
        <Heading level={5}>
          This is Heading 5 (h5)
        </Heading>
        <Heading level={6}>
          This is Heading 6 (h6)
        </Heading>
      </div>
    </div>
  );
}

export default Headings;
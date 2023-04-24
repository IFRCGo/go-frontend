import React from 'react';
import Header from '#components/Header';
import Card from '#views/GoUI/components/Card';

import styles from './styles.module.scss';

function Cards() {
  return (
    <div className={styles.cardsCollection}>
      <Header
        heading="CARD COLLECTION"
        headingSize="medium"
      />
      <Header
        heading="INFO BOX"
        headingSize="small"
      />
      <Card
        value={1000000}
        progressTotalValue={2000000}
        normalize
        progressBar
        description='50% received'
        title='This is test card templete'
      />
      <Header
        heading="INFO BOX 2"
        headingSize="small"
      />
      <Card
        value={8}
        description='This is UI Card'
      />
    </div>
  );
}

export default Cards;

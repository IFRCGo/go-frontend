import React from 'react';
import Header from '#goui/components/Header';
import Card from '#views/GoUI/components/Card';

import styles from './styles.module.scss';

function Cards() {
  return (
    <div className={styles.cardsCollection}>
      <Header>
        INFO BOX
      </Header>
      <Card
        value={1000000}
        progressTotalValue={2000000}
        normalize
        progressBar
        description='50% received'
        title='This is test card templete'
      />
      <Header>
        INFO BOX 2
      </Header>
      <Card
        value={8}
        description='This is UI Card'
      />
    </div>
  );
}

export default Cards;

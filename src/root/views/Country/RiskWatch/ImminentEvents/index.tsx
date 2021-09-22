import React from 'react';
import Container from '#components/Container';

import Map from './Map';
import styles from './styles.module.scss';

interface Props {
  className?: string;
  countryId: number;
}

function ImminentEvents(props: Props) {
  const {
    countryId
  } = props;

  return (
    <Container className={styles.imminentEvents}>
      <Map
        countryId={countryId}
        className={styles.map}
      />
      <div>
        <button
          className='button button--primary-filled button--xsmall tc-ok-button text-uppercase'
        >
          <span>Resilience Dashboard Report #1</span>
        </button>
        <button
          className='button button--primary-filled button--xsmall tc-ok-button text-uppercase'
        >
          <span>Resilience Dashboard Report #2</span>
        </button>
        <button
          className='button button--primary-filled button--xsmall tc-ok-button text-uppercase'
        >
          <span>Resilience Dashboard Report #3</span>
        </button>
        <button
          className='button button--primary-filled button--xsmall tc-ok-button text-uppercase'
        >
          <span>EVCA repository</span>
        </button>
      </div>
    </Container>
  );
}

export default ImminentEvents;

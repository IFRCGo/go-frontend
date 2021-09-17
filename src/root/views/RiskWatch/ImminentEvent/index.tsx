import React from 'react';
import Container from '#components/Container';

function ImminnetEvent() {

  return (
    <Container className="button-space">
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
    </Container>
  );
}

export default ImminnetEvent;
import React, { useContext, useMemo } from 'react';
import RiskMap from './Map';
import { ImpactChart, RiskBarChart } from './Charts';
import { ReturnPeriodTable } from './Table';
import Container from '#components/Container';
import styles from './styles.module.scss';


function SeasonalRisk() {

  return (
    <>
      <RiskMap />
      <RiskBarChart />
      <ReturnPeriodTable />
      <ImpactChart />
      <Container>
      <div className={styles.dashboard}>
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
    </>
  );
}

export default SeasonalRisk;
import React  from 'react';
import Container from '#components/Container';

import RiskMap from './Map';
import { RiskTable } from './Table';
import { ImpactChart, RiskBarChart } from './Charts';
import { ReturnPeriodTable } from './Table';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  countryId: number;
}

function SeasonalRisk(props: Props) {
  const {
    countryId,
  } = props;

  return (
    <>
      <RiskMap countryId={countryId} />
      <RiskTable />
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

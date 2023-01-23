import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Container from '#components/Container';

import ImminentEvents from './ImminentEvents';
import SeasonalRisk from './SeasonalRisk';

import styles from './styles.module.scss';

interface Props {
  countryId: number;
  className?: string;
}

function RiskWatch(props: Props) {
  const {
    className,
    countryId,
  } = props;

  return (
    <Container
      className={_cs(styles.riskWatch, className)}
      contentClassName={styles.content}
    >
      <ImminentEvents
        countryId={countryId}
      />
      {/* <SeasonalRisk
        countryId={countryId}
      /> */}
    </Container>
  );
}

export default RiskWatch;

import React from 'react';
import { IoDownload } from 'react-icons/io5';

import ButtonLikeLink from '#components/ButtonLikeLink';
import Card from '#components/Card';
import KeyFigure from '#components/KeyFigure';
import Container from '#components/Container';
import Header from '#components/Header';
import FieldReportsTable from '#components/connected/field-reports-table';

import styles from './styles.module.scss';
import CountryPlanTable from './CountryPlanTable';

interface Props {
  className?: string;
}

function CountryPlan(props: Props) {
  const {
    className,
  } = props;

  return (
    <Container
      className={styles.countryPlan}
    >
      <div className={styles.countryPlanContent}>
        <div className={styles.downloadLinks}>
          <ButtonLikeLink
            external
            variant="secondary"
            to="undefined"
            className={styles.downloadLink}
            icons={<IoDownload />}
          >
            Philippines Country Plan
          </ButtonLikeLink>
          <ButtonLikeLink
            external
            variant="secondary"
            to="undefined"
            className={styles.downloadLink}
            icons={<IoDownload />}
          >
            Philippines Country Plan
          </ButtonLikeLink>
        </div>
        <div className={styles.countryPlanSection}>
          <Header
            className={styles.header}
            heading="Philippines Country Plan"
            actions={undefined}
            headingSize="extraLarge"
          />
          <Card multiColumn>
            <KeyFigure
              value={208367}
              description="Federation-wide request amount (CHF)"
            />
            <KeyFigure
              value={1.0}
              description="People Targeted"
            />
          </Card>
        </div>
      </div>
      <div className={styles.countryPlanReport}>
        <CountryPlanTable />
        <CountryPlanTable />
      </div>
    </Container>
  );
}

export default CountryPlan;
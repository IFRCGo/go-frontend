import React from 'react';
import { IoDownload } from 'react-icons/io5';

import LanguageContext from '#root/languageContext';

import ButtonLikeLink from '#components/ButtonLikeLink';
import Card from '#components/Card';
import KeyFigure from '#components/KeyFigure';
import Container from '#components/Container';
import Header from '#components/Header';
import CountryPlanTable from './CountryPlanTable';
import CountryMembershipTable from './CountryMembershipTable';

import styles from './styles.module.scss';

interface Props {
  className?: string;
}

function CountryPlan(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    className,
  } = props;

  return (
    <>
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
              Philippines Internal Plan
            </ButtonLikeLink>
          </div>
          <div className={styles.countryPlanSection}>
            <Header
              className={styles.header}
              heading="Philippines Country Plan"
              actions={undefined}
              headingSize="extraLarge"
            />
          </div>
        </div>
        <div className={styles.keyFigure}>
          <Card multiColumn>
            <KeyFigure
              value={208367}
              description="Federation-wide request amount (CHF)"
            />
            <KeyFigure
              value={1000000}
              description="People Targeted"
            />
          </Card>
        </div>
      </Container>
      <div className={styles.countryPlanReport}>
        <CountryPlanTable />
        <CountryMembershipTable />
      </div>
    </>
  );
}

export default CountryPlan;
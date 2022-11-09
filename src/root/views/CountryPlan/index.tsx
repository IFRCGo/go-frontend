import React from 'react';
import { IoDownload } from 'react-icons/io5';
import { _cs } from '@togglecorp/fujs';

import ButtonLikeLink from '#components/ButtonLikeLink';
import Card from '#components/Card';
import Header from '#components/Header';
import FieldReportsTable from '#components/connected/field-reports-table';

import styles from './styles.modules.scss';
import KeyFigure from '#components/KeyFigure';
import StatsPie from '#views/Emergency/Activities/StatsPie';

interface Props {
  className?: string;
}

function CountryPlan(props: Props) {
  const {
    className,
  } = props;

  return (
    <div className={_cs(styles.countryPlan, className)}>
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
      <Header
        className={_cs(styles.header)}
        heading="Philippines Country Plan"
        actions={undefined}
        headingSize="extraLarge"
        elementRef={undefined}
      />
      <div className='inner inner--field-reports-emergencies'>
        <FieldReportsTable
          title="Strategic Priority"
          viewAll={'/reports/all'}
          showRecent={true}
        />
        <FieldReportsTable
          title="Membership Coordination"
          viewAll={'/reports/all'}
          showRecent={true}
        />
      </div>
    </div>
  );
}

export default CountryPlan;
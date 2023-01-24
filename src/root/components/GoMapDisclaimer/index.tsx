import React from 'react';
import { _cs } from '@togglecorp/fujs';

import InfoPopup from '#components/InfoPopup';

import styles from './styles.module.scss';

interface Props {
  className?: string;
}

function GoMapDisclaimer(props: Props) {
  const {
    className,
  } = props;

  return (
    <InfoPopup
      infoLabel="Map Sources: ICRC, UN"
      className={_cs(styles.goMapDisclaimer, className)}
      description="The maps used do not imply the expression of any opinion on the part of the International Federation of Red Cross and Red Crescent Societies or National Society concerning the legal status of a territory or of its authorities."
    />
  );
}

export default GoMapDisclaimer;

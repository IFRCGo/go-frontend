import React from 'react';
import Button from '#components/Button';

import styles from './styles.module.scss';

function PreparednessCard() {
  return (
    <div className={styles.eapTab}>
      <div>EAP-TYPHOONS</div>
      <Button
        onClick={undefined}
        name={undefined}
      >
        View EAp Details
      </Button>
    </div>
  );
}

export default PreparednessCard;

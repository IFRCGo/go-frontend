import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

interface Props {
    className?: string;
}
function Spinner (props: Props) {
    const { className} = props;
  return (
    <div className={_cs(styles.spinner, className)}>
      <div className={styles.spinnerBounce}></div>
      <div className={styles.spinnerBounce}></div>
      <div className={styles.spinnerBounce}></div>
    </div>
  );
}

export default Spinner;

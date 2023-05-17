import React from 'react';
import styles from './styles.module.scss';

function InitialLoading() {
  return (
    <div className={styles.initialLoading}>
      <img
        src="/assets/graphics/layout/logo-icon.svg"
        width="66"
      />
      <img
        className={styles.logo}
        src="/assets/graphics/layout/ifrc_logo_2020.svg"
        alt="IFRC GO"
        width="260"
      />
      <div className={styles.content}>
        <div className={styles.loadingGlobal}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default InitialLoading;

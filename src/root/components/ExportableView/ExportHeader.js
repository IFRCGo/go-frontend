import React from 'react';
import _cs from 'classnames';

import { formatDate } from '#utils/format';

import styles from './styles.module.scss';

function ExportHeader (p) {
  const {
    className,
    heading,
  } = p;

  return (
    <div className={_cs(styles.exportHeader, className)}>
      <div className={styles.header}>
        <h1 className={styles.heading}>
          { heading }
        </h1>
        <time className={styles.date}>
          { formatDate(new Date()) }
        </time>
      </div>
      <div className={styles.content}>
        <img src="/assets/graphics/layout/go-logo-2020.svg" alt="IFRC GO" />
      </div>
    </div>
  );
}

export default ExportHeader;

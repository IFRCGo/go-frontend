import React from 'react';
import _cs from 'classnames';

import { formatDate } from '#utils/format';

import ExportOnlyContent from './ExportOnlyContent';
import styles from './styles.module.scss';

function ExportHeader (p) {
  const {
    className,
    heading,
    mode,
  } = p;

  return (
    <ExportOnlyContent
      className={_cs(styles.exportHeader, className)}
      mode={mode}
    >
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
    </ExportOnlyContent>
  );
}

export default ExportHeader;

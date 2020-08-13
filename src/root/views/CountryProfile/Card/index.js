import React from 'react';
import _cs from 'classnames';

import styles from './styles.module.scss';

function Card(p) {
  const {
    className,
    contentClassName,
    heading,
    children,
    hideSource,
  } = p;

  return (
    <div className={_cs(className, styles.card)}>
      <header className={styles.header}>
        <h3 className={styles.heading}>
          { heading }
        </h3>
      </header>
      <div className={_cs(contentClassName, styles.content)}>
        { children }
      </div>
      {!hideSource && (
        <footer className={styles.footer}>
          <div className={styles.source}>
            <div className={styles.label}>
              Source
            </div>
            <a
              className={styles.link}
              target="_blank"
            >
              FDRS
            </a>
          </div>
          <div className={styles.reportingYear}>
            <div className={styles.label}>
              Latest reporting year:
            </div>
            <time className={styles.year}>
              2019
            </time>
          </div>
        </footer>
      )}
    </div>
  );
}

export default Card;

import React from 'react';
import _cs from 'classnames';

import styles from './styles.module.scss';

function Container(p) {
  const {
    className,
    contentClassName,
    heading,
    headerContentClassName,
    headerContent,
    children,
  } = p;

  return (
    <div className={_cs(className, styles.container)}>
      <header className={styles.header}>
        <h3 className={styles.heading}>
          { heading }
        </h3>
        { headerContent && (
          <div className={_cs(headerContentClassName, styles.headerContent)}>
            { headerContent }
          </div>
        )}
      </header>
      <div className={_cs(contentClassName, styles.content)}>
        { children }
      </div>
    </div>
  );
}

export default Container;

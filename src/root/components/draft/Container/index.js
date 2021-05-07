import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

function Container(props) {
  const {
    className,
    heading,
    actions,
    children,
    contentClassName,
  } = props;

  return (
    <div
      className={_cs(
        'go-container',
        styles.container,
        className,
      )}
    >
      <div className={styles.header}>
        { heading && (
          <h2 className={styles.heading}>
            { heading }
          </h2>
        )}
        { actions && (
          { actions }
        )}
      </div>
      <div className={_cs(styles.content, contentClassName)}>
        { children }
      </div>
    </div>
  );
}

export default Container;

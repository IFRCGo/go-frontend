import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  children?: React.ReactNode;
  title?: React.ReactNode;
  multiColumn?: boolean;
}

function Card(props: Props) {
  const {
    className,
    children,
    title,
    multiColumn,
  } = props;

  return (
    <div
      className={_cs(
        styles.card,
        multiColumn && styles.multiColumn,
        className,
      )}
    >
      {title && (
        <div className={styles.title}>
          {title}
        </div>
      )}
      <div className={styles.content}>
        { children }
      </div>
    </div>
  );
}

export default Card;

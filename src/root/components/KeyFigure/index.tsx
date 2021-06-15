import React from 'react';
import { _cs } from '@togglecorp/fujs';

import NumberOutput from '#components/NumberOutput';
import styles from './styles.module.scss';

interface Props {
  className?: string;
  value?: number;
  description?: React.ReactNode;
  headerIcon?: React.ReactNode;
  footerIcon?: React.ReactNode;
  source?: React.ReactNode;
  inline?: boolean;
}

function KeyFigure(props: Props) {
  const {
    className,
    value,
    description,
    headerIcon,
    footerIcon,
    inline,
  } = props;

  return (
    <div
      className={_cs(
        styles.keyFigure,
        inline && styles.inlineMainContent,
        className,
      )}
    >
      {headerIcon && (
        <div className={styles.headerIcon}>
          {headerIcon}
        </div>
      )}
      <div className={styles.mainContent}>
        <NumberOutput
          className={styles.value}
          value={value}
          precision="auto"
          normal
        />
        {description && (
          <div className={styles.description}>
            {description}
          </div>
        )}
      </div>
      {footerIcon && (
        <div className={styles.footerIcon}>
          {footerIcon}
        </div>
      )}
    </div>
  );
}

export default KeyFigure;

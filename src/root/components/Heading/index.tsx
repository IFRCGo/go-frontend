import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

export interface Props {
  className?: string;
  children?: React.ReactNode;
  size?: 'superSmall' | 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge';
}

function Heading(props: Props) {
  const {
    className,
    children,
    size = 'medium',
  } = props;

  return (
    <>
      {size === 'superSmall' && (
        <h6 className={_cs(styles.heading, styles.superSmall, className)}>
          { children }
        </h6>
      )}
      {size === 'extraSmall' && (
        <h5 className={_cs(styles.heading, styles.extraSmall, className)}>
          { children }
        </h5>
      )}
      {size === 'small' && (
        <h4 className={_cs(styles.heading, styles.small, className)}>
          { children }
        </h4>
      )}
      {size === 'medium' && (
        <h3 className={_cs(styles.heading, styles.medium, className)}>
          { children }
        </h3>
      )}
      {size === 'large' && (
        <h2 className={_cs(styles.heading, styles.large, className)}>
          { children }
        </h2>
      )}
      {size === 'extraLarge' && (
        <h1 className={_cs(styles.heading, styles.extraLarge, className)}>
          { children }
        </h1>
      )}
    </>
  );
}

export default Heading;

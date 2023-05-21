import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

export interface Props {
    className?: string;
    children?: React.ReactNode;
}

function Description(props: Props) {
  const {
    className,
    children,
  } = props;

  return (
    <div className={_cs(styles.description, className)}>
      { children }
    </div>
  );
}

export default Description;

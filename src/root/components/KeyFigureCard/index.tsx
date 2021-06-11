import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

function KeyFigureCard(props: Props) {
  const {
    className,
    children,
  } = props;

  return (
    <div className={_cs(styles.keyFigureCard, className)}>
      { children }
    </div>
  );
}

export default KeyFigureCard;

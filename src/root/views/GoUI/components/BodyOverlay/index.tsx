import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Portal from '#goui/Portal';
import Overlay from '#goui/Overlay';

import styles from './styles.module.scss';

interface Props {
  children: React.ReactNode;
  className?: string;
}

function BodyOverlay(props: Props) {
  const {
    className,
    children,
  } = props;

  return (
    <Portal>
      <Overlay className={_cs(className, styles.bodyOverlay)}>
        {children}
      </Overlay>
    </Portal>
  );
}

export default BodyOverlay;

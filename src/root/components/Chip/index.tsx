import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { IoClose } from 'react-icons/io5';

import Button from '#components/Button';

import styles from './styles.module.scss';

interface Props<N> {
  className?: string;
  children?: React.ReactNode;
  name: N;
  onDismiss: (name: N) => void;
}

function Chip<N>(props: Props<N>) {
  const {
    className,
    children,
    onDismiss,
    name,
  } = props;

  return (
    <div className={_cs(styles.chip, className)}>
      {children}
      <Button
        name={name}
        onClick={onDismiss}
        variant="transparent"
      >
        <IoClose />
      </Button>
    </div>
  );
}

export default Chip;

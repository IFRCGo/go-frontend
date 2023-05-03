import React from 'react';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.module.scss';

interface Props {
  className?: string;
  children: React.ReactNode;
}

function Header(props: Props) {
  const {
    className,
    children,
  } = props;
  return (
    <header className={_cs(styles.header, className)}>
      {children}
    </header>
  );
}

export default Header;

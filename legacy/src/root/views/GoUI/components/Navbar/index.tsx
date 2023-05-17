import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Button from '#goui/components/Button';
import PageContainer from '#goui/components/PageContainer';
import Link from '#goui/components/Link';

import styles from './styles.module.scss';

interface Props {
  className?: string;
}

function Navbar(props: Props) {
  const {
    className,
  } = props;

  return (
    <nav className={_cs(styles.navbar, className)}>
      <PageContainer
        className={styles.top}
        contentClassName={styles.topContent}
      >
        <Link
          to='/'
          className={styles.brand}
        >
          <img
            className={styles.goIcon}
            src='/assets/graphics/layout/go-logo-2020.svg'
            alt='GO | IFRC'
          />
        </Link>
        <div className={styles.actions}>
          <div className={styles.actionItem}>
            Resources
          </div>
          <div className={styles.actionItem}>
            Login
          </div>
          <div className={styles.actionItem}>
            Register
          </div>
          <Button name={undefined}>
            Create a report
          </Button>
        </div>
      </PageContainer>
      <PageContainer>
        <div className={styles.bottom}>
          <div className={styles.menuItems}>
            <div className={styles.menuItem}>
              Home
            </div>
            <div className={styles.menuItem}>
              Emergencies
            </div>
          </div>
          <div className={styles.searchContainer}>
            Search
          </div>
        </div>
      </PageContainer>
    </nav>
  );
}

export default Navbar;

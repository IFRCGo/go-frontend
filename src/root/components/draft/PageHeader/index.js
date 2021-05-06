import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Container from '#components/draft/Container';

import styles from './styles.module.scss';

function PageHeader(props) {
  const {
    className,
    heading,
    description,
    actions,
    breadCrumbs,
    info,
  } = props;

  return (
    <header
      className={_cs(
        'go-page-header',
        styles.pageHeader,
        className,
      )}
    >
      <Container>
        <section className={styles.topSection}>
          <div className={styles.breadCrumbs}>
            { breadCrumbs }
          </div>
          <div className={styles.actions}>
            { actions }
          </div>
        </section>
        <section className={styles.middleSection}>
          <h1 className={styles.heading}>
            { heading }
          </h1>
          { description && (
            <p className={styles.description}>
              { description }
            </p>
          )}
        </section>
        { info && (
          <div className={styles.info}>
            { info }
          </div>
        )}
      </Container>
    </header>
  );
}

export default PageHeader;

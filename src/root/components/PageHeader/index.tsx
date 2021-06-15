import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Container from '#components/Container';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  heading?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  breadCrumbs?: React.ReactNode;
  info?: React.ReactNode;
  infoContainerClassName?: string;
}

function PageHeader(props: Props) {
  const {
    className,
    heading,
    description,
    actions,
    breadCrumbs,
    info,
    infoContainerClassName,
  } = props;

  if (!(actions || breadCrumbs || info || description || heading)) {
    return null;
  }

  return (
    <header
      className={_cs(
        'go-page-header',
        styles.pageHeader,
        className,
      )}
    >
      <Container>
        {(actions || breadCrumbs) && (
          <section className={styles.topSection}>
            <div className={styles.breadCrumbs}>
              { breadCrumbs }
            </div>
            <div className={styles.actions}>
              { actions }
            </div>
          </section>
        )}
        {(heading || description) && (
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
        )}
        { info && (
          <div className={_cs(styles.info, infoContainerClassName)}>
            { info }
          </div>
        )}
      </Container>
    </header>
  );
}

export default PageHeader;

import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Container from '#components/Container';
import Heading from '#components/Heading';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  heading?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  breadCrumbs?: React.ReactNode;
  info?: React.ReactNode;
  infoContainerClassName?: string;
  wikiLink?: React.ReactNode;
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
    wikiLink,
  } = props;

  if (!(actions || breadCrumbs || info || description || heading)) {
    return null;
  }

  return (
    <header
      className={_cs(
        styles.pageHeader,
        className,
      )}
    >
      <Container
        className={styles.container}
        icons={breadCrumbs}
        actions={(
          <>
            {actions}
            {wikiLink}
          </>
        )}
        hideHeaderBorder
        footer={info}
        footerContentClassName={infoContainerClassName}
        contentClassName={styles.mainContent}
      >
        <Heading
          size="extraLarge"
          className={styles.heading}
        >
          { heading }
        </Heading>
        {description && (
          <div className={styles.description}>
            { description }
          </div>
        )}
      </Container>
    </header>
  );
}

export default PageHeader;

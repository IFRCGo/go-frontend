import React from 'react';
import _cs from 'classnames';
import { GoLinkExternal } from 'react-icons/go';

import Translate from '#components/Translate';

import Container from './Container';
import styles from './styles.module.scss';

function SourceDetails(p) {
  const {
    title,
    url,
    className,
  } = p;

  return (
    <a
      className={_cs(styles.sourceDetails, className)}
      href={url}
      target="_blank"
    >
      <div className={styles.title}>
        { title }
      </div>
      <div className={styles.icon}>
        <GoLinkExternal />
      </div>
    </a>
  );
}

function ExternalSources(p) {
  const {
    className,
    data,
  } = p;

  return (
    <Container
      className={_cs(className, styles.externalSources)}
      heading={<Translate stringId='countryProfileExternalSourcesTitle'/>}
      contentClassName={styles.content}
    >
      { data.map(d => (
        <SourceDetails
          key={d.id}
          title={d.title}
          url={d.url}
        />
      ))}
    </Container>
  );
}

export default ExternalSources;

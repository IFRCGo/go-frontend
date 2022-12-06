import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

export interface Props {
  className?: string;
  language?: string;
  linkEnding?: string;
}

function WikiLink(props: Props) {
  const {
    className,
    language,
    linkEnding,
  } = props;

  const lang = language ?? 'en';

  return (
      <a
        className={_cs(styles.WikiLink, className)}
        href={'https://go-wiki.ifrc.org/' + lang + '/' + linkEnding} title='GO Wiki' target='_blank' >
        <img className='' src='/assets/graphics/content/wiki-help-section.svg' alt='IFRC GO Wiki' />
      </a>
  );
}

export default WikiLink;

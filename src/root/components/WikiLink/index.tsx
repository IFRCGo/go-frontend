import React from 'react';

import useReduxState from '#hooks/useReduxState';

export interface Props {
  className?: string;
  pathName?: string;
}

function WikiLink(props: Props) {
  const {
    className,
    pathName,
  } = props;

  const lang = useReduxState('lang');
  const href = `https://go-wiki.ifrc.org/${lang.current}/${pathName}`;

  return (
    <a
      className={className}
      href={href}
      title='GO Wiki'
      target='_blank'
    >
      <img
        src='/assets/graphics/content/wiki-help-section.png'
        alt='IFRC GO Wiki'
      />
    </a>
  );
}

export default WikiLink;

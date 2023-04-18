import React from 'react';
import {
  _cs,
  isValidUrl,
} from '@togglecorp/fujs';
import { Link as InternalLink } from 'react-router-dom';

import styles from './styles.module.scss';

export interface Props extends Omit<React.HTMLProps<HTMLAnchorElement>, 'children' | 'href' | 'className'> {
  className?: string;
  href: string;
  hash?: string;
  state?: unknown;
  children?: React.ReactNode;
  icons?: React.ReactNode;
  variant?: 'regular' | 'secondary' | 'table' | 'highlighted' | 'popup' | 'textLink' | 'specialEmail';
}

function Link(props: Props) {
  const {
    className: classNameFromProps,
    href,
    hash,
    state,
    children,
    variant = 'regular',
    ...otherProps
  } = props;

  const isExternalLink = React.useMemo(() => (
    href
    && typeof href === 'string'
    && (isValidUrl(href)
      || href.startsWith('mailto:'))
  ), [href]);

  const className = _cs(
    styles.link,
    variant === 'regular' && styles.regularLink,
    variant === 'highlighted' && styles.highlightedLink,
    variant === 'popup' && styles.popup,
    variant === 'table' && styles.table,
    variant === 'textLink' && styles.textLink,
    variant === 'specialEmail' && styles.specialEmail,
    classNameFromProps,
  );

  if (isExternalLink) {
    return (
      <a
        {...otherProps}
        className={className}
        href={href}
        target="_blank"
        rel="noopener nofollow"
      >
        {children}
      </a>
    );
  }

  const {
    ref,
    ...otherPropsExceptRef
  } = otherProps;

  return (
    <InternalLink
      className={className}
      to={{
        pathname: href,
        state: state,
        hash: hash,
      }}
      {...otherPropsExceptRef}
    >
      {children}
    </InternalLink>
  );
}

export default Link;

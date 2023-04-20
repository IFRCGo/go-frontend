import React from 'react';
import {
  _cs,
  isValidUrl,
} from '@togglecorp/fujs';
import { Link as InternalLink } from 'react-router-dom';
import {
  IoChevronForward,
  IoOpenOutline,
} from 'react-icons/io5';
import { IconType } from 'react-icons';

import useBasicLayout from '#hooks/useBasicLayout';

import styles from './styles.module.scss';

type LinkVariant = 'regular' | 'secondary' | 'titleLink' | 'textLink' | 'externalLink' | 'specialEmail';

const variantToIconMap: Record<LinkVariant, IconType | null> = {
  regular: IoChevronForward,
  secondary: IoChevronForward,
  titleLink: IoChevronForward,
  externalLink: IoOpenOutline,
  textLink: null,
  specialEmail: null,
};

export interface Props extends Omit<React.HTMLProps<HTMLAnchorElement>, 'children' | 'href' | 'className' | 'ref'> {
  className?: string;
  href: string;
  hash?: string;
  state?: unknown;
  children?: React.ReactNode;
  icons?: React.ReactNode;
  variant?: LinkVariant;
}

function Link(props: Props) {
  const {
    className: classNameFromProps,
    href,
    hash,
    state,
    children: childrenFromProps,
    variant = 'regular',
    icons,
    ...otherProps
  } = props;

  const CurrentIcon = variantToIconMap[variant];

  const isExternalLink = React.useMemo(() => (
    href
    && typeof href === 'string'
    && (isValidUrl(href)
      || href.startsWith('mailto:'))
  ), [href]);

  const className = _cs(
    styles.link,
    variant === 'regular' && styles.regularLink,
    variant === 'titleLink' && styles.titleLink,
    variant === 'textLink' && styles.textLink,
    variant === 'externalLink' && styles.externalLink,
    variant === 'specialEmail' && styles.specialEmail,
    classNameFromProps,
  );

  const {
    content,
    containerClassName,
  } = useBasicLayout({
    children: childrenFromProps,
    actions: CurrentIcon && <CurrentIcon />,
    className,
  });

  if (isExternalLink) {
    return (
      <a
        {...otherProps}
        className={containerClassName}
        href={href}
        target="_blank"
        rel="noopener nofollow"
      >
        {content}
      </a>
    );
  }

  return (
    <InternalLink
      className={containerClassName}
      to={{
        pathname: href,
        state: state,
        hash: hash,
      }}
      {...otherProps}
    >
      {content}
    </InternalLink>
  );
}

export default Link;

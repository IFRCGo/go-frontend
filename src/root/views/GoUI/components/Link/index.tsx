import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Link as InternalLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import {
  IoChevronForward,
  IoOpenOutline,
} from 'react-icons/io5';
import ButtonLikeLink from '#components/ButtonLikeLink';

import styles from './styles.module.scss';

type LinkVariant = 'regular' | 'title' | 'text' | 'external' | 'secondary';

const variantToIconMap: Record<LinkVariant, React.ReactElement | undefined> = {
  regular: <IoChevronForward />,
  title: <IoChevronForward />,
  external: <IoOpenOutline />,
  secondary: undefined,
  text: undefined,
};

const variantStyleMap: Record<LinkVariant, string | undefined> = {
  regular: undefined,
  title: styles.title,
  text: styles.text,
  external: undefined,
  secondary: undefined,
};

export interface Props extends RouterLinkProps {
  actionsContainerClassName?: string;
  iconsContainerClassName?: string;
  linkElementClassName?: string;
  actions?: React.ReactNode;
  icons?: React.ReactNode;
  variant?: LinkVariant;
}

function Link(props: Props) {
  const {
    className,
    to,
    variant = 'regular',
    icons,
    actions,
    actionsContainerClassName,
    iconsContainerClassName,
    linkElementClassName,
    children,
    ...otherProps
  } = props;

  const icon = variantToIconMap[variant];

  const specialLink = (variant === 'external') ||  (variant === 'secondary');

  return (
    <div className={_cs(className, styles.linkContainer, variantStyleMap[variant])}>
      {icons && (
        <div className={_cs(iconsContainerClassName, styles.icons)}>
          {icons}
        </div>
      )}
      {variant === 'external' && (
        <a
          className={_cs(linkElementClassName, styles.link)}
          href={to as string}
          target="_blank"
          rel="noopener noreferrer external"
          {...otherProps}
        >
          {children}
        </a>
      )}

      {variant === 'secondary' && (
        <ButtonLikeLink
          className={_cs(linkElementClassName, styles.buttonLikeLink)}
          to={to}
          external
          icons={icons}
        >
          {children}
        </ButtonLikeLink>
      )}

      {!specialLink && (
        <InternalLink
          className={_cs(linkElementClassName, styles.link)}
          to={to}
          {...otherProps}
        >
          {children}
        </InternalLink>
      )}

      {(actions || icon) && (
        <div
          className={_cs(actionsContainerClassName, styles.actions)}
        >
          {actions}
          {icon && icon}
        </div>
      )}
    </div>
  );
}
export default Link;

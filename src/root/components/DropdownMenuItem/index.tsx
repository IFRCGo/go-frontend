import React from 'react';
import {
  _cs,
  isValidUrl,
} from '@togglecorp/fujs';
import { Link } from 'react-router-dom';

import RawButton, {
  Props as RawButtonProps,
} from '#components/RawButton';

import styles from './styles.module.scss';

interface BaseProps {
  className?: string;
  icon?: React.ReactNode;
  label?: React.ReactNode;
}

type Props<N extends string | number> = BaseProps & ({
  name?: N;
  onClick: RawButtonProps<N>['onClick'];
  href?: never;
} | {
  href: string;
  onClick?: never;
  name?: never;
})

function DropdownMenuItem<N extends string | number>(props: Props<N>) {
  const {
    className: classNameFromProps,
    icon,
    label,
  } = props;

  const isExternalLink = React.useMemo(() => (
    props.href
    && typeof props.href === 'string'
    && (isValidUrl(props.href)
        || props.href.startsWith('mailto:'))
  ), [props.href]);

  const className = _cs(styles.dropdownMenuItem, classNameFromProps);

  const children = (
    <>
      <div className={styles.iconContainer}>
        {icon}
      </div>
      <div className={styles.label}>
        {label}
      </div>
    </>
  );

  if (props.href) {
    if (isExternalLink) {
      return (
        <a
          className={className}
          href={props.href}
          target="_blank"
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        className={className}
        to={props.href}
      >
        {children}
      </Link>
    );
  }


  return (
    <RawButton
      className={className}
      name={props.name}
      onClick={props.onClick}
    >
      {children}
    </RawButton>
  );
}

export default DropdownMenuItem;

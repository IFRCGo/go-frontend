import React from 'react';
import { _cs } from '@togglecorp/fujs';

import RawButton, { Props as RawButtonProps } from '#components/RawButton';
import { ButtonVariant } from '#components/Button';

import styles from './styles.module.css';

interface Props<N> extends RawButtonProps<N> {
  ariaLabel: string;
  disabled?: boolean;
  round?: boolean;
  variant: ButtonVariant;
}

function IconButton<N>(props: Props<N>) {
  const {
    ariaLabel,
    children,
    className,
    variant,
    round = true,
    ...otherProps
  } = props;

  const buttonClassName = _cs(
    styles.button,
    styles[variant],
    round && styles.round,
    className,
  );

  return (
    <RawButton
      className={buttonClassName}
      aria-label={ariaLabel}
      {...otherProps}
    >
      {children}
    </RawButton>
  );
}

export default IconButton;

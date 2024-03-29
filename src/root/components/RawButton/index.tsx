import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { genericMemo } from '#utils/common';

import styles from './styles.module.scss';

export interface Props<N> extends Omit<React.HTMLProps<HTMLButtonElement>, 'ref' | 'onClick' | 'name'>{
  className?: string;
  onClick?: (name: N, e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  name: N;
  elementRef?: React.Ref<HTMLButtonElement>;
  focused?: boolean;
}

/**
 * The most basic button component (without styles)
 * This component is meant to be a builder component
 * and comes only with the functionality of button but no
 * styling. Since, `button` element in html has browser and OS dependent styling,
 * we use raw button as a base component for other types of buttons or
 * clickable elements
 */
function RawButton<N>(props: Props<N>) {
  const {
    className,
    onClick,
    children,
    disabled,
    elementRef,
    name,
    focused,
    ...otherProps
  } = props;

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(name, e);
      }
    },
    [onClick, name],
  );

  return (
    <button
      ref={elementRef}
      name={typeof name === 'string' ? name : undefined}
      type="button"
      className={_cs(
        styles.rawButton,
        focused && styles.focused,
        className,
      )}
      disabled={disabled}
      onClick={onClick ? handleClick : undefined}
      {...otherProps}
    >
      { children }
    </button>
  );
}

export default genericMemo(RawButton);

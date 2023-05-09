import React, { useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';

import RawButton, { Props as RawButtonProps } from '#goui/RawButton';
import styles from './styles.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

const buttonVariantToStyleMap: Record<ButtonVariant, string>= {
  primary: styles.primary,
  secondary: styles.secondary,
  tertiary: styles.tertiary,
};

export interface Props<N> extends RawButtonProps<N> {
  variant?: ButtonVariant;
  actions?: React.ReactNode;
  actionsClassName?: string;
  childrenClassName?: string;
  disabled?: boolean;
  icons?: React.ReactNode;
  iconsClassName?: string;
  name: N;
  onClick?: (name: N, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export type ButtonFeatureProps<N> = Omit<Props<N>, 'name' | 'onClick'>;
export function useButtonFeatures<N>(
  props: ButtonFeatureProps<N>,
) {
  const {
    actions,
    actionsClassName,
    children,
    childrenClassName,
    className,
    disabled,
    icons,
    iconsClassName,
    variant = 'primary',
  } = props;

  const buttonClassName = _cs(
    styles.button,
    buttonVariantToStyleMap[variant],
    disabled && styles.disabled,
    className,
  );

  const buttonChildren = (
    <>
      {icons && (
        <div className={_cs(iconsClassName, styles.icon)}>
          {icons}
        </div>
      )}
      {children && (
        <div className={_cs(childrenClassName, styles.children)}>
          {children}
        </div>
      )}
      {actions && (
        <div className={_cs(actionsClassName, styles.actions)}>
          {actions}
        </div>
      )}
    </>
  );

  return {
    className: buttonClassName,
    children: buttonChildren,
    disabled,
  };
}

function Button<N>(props: Props<N>) {
  const {
    actions,
    actionsClassName,
    children,
    childrenClassName,
    className,
    disabled,
    icons,
    iconsClassName,
    name,
    onClick,
    variant,
    ...otherProps
  } = props;

  const handleButtonClick= useCallback(
    (n, e) => {
      if (onClick) {
        onClick(n, e);
      }
    }, [onClick]);

  const buttonProps = useButtonFeatures({
    variant,
    className,
    actionsClassName,
    iconsClassName,
    childrenClassName,
    children,
    icons,
    actions,
    disabled,
  });

  return (
    <RawButton
      name={name}
      type="button"
      onClick={handleButtonClick}
      {...otherProps}
      {...buttonProps}
    />
  );
}

export default Button;

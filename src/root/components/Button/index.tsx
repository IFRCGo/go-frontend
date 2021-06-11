import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

export type ButtonVariant = (
  'primary'
  | 'secondary'
  | 'tertiary'
  | 'action'
);

const buttonVariantToStyleMap: { [key in ButtonVariant]: string; } = {
  primary: styles.primary,
  secondary: styles.secondary,
  tertiary: styles.tertiary,
  action: styles.action,
};

export interface Props<N> extends Omit<
React.HTMLProps<HTMLButtonElement>,
'ref' | 'onClick' | 'name' | 'type'
> {
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  children?: React.ReactNode;
  className?: string;
  icons?: React.ReactNode;
  actions?: React.ReactNode;
  iconsClassName?: string;
  childrenClassName?: string;
  actionsClassName?: string;
  disabled?: boolean;
  big?: boolean;
  name: N;
  onClick?: (name: N, e: React.MouseEvent<HTMLButtonElement>) => void;
  readOnly?: boolean;
}

type ButtonFeatureKeys = 'variant' | 'className' | 'actionsClassName' | 'iconsClassName' | 'childrenClassName' | 'children' | 'icons' | 'actions' | 'disabled' | 'big' | 'readOnly';
export function useButtonFeatures(
  props: Pick<Props<void>, ButtonFeatureKeys>,
) {
  const {
    variant = 'primary',
    className,
    actionsClassName,
    iconsClassName,
    childrenClassName,
    disabled,
    children,
    icons,
    actions,
    big,
    readOnly,
  } = props;

  const buttonClassName = _cs(
    styles.button,
    variant,
    buttonVariantToStyleMap[variant] ?? styles.primary,
    readOnly && styles.readOnly,
    big && styles.big,
    className,
  );

  const buttonChildren = (
    <>
      {icons && (
        <div className={_cs(iconsClassName, styles.icons)}>
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
    variant,
    className,
    actionsClassName,
    iconsClassName,
    childrenClassName,
    children,
    icons,
    actions,
    disabled,
    big,
    name,
    onClick,
    readOnly,
    ...otherProps
  } = props;

  const handleButtonClick = React.useCallback((e) => {
    if (onClick && !readOnly) {
      onClick(name, e);
    }
  }, [name, onClick, readOnly]);

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
    big,
    readOnly,
  });

  // FIXME: Use raw button
  return (
    <button
      type="button"
      onClick={handleButtonClick}
      {...otherProps}
      {...buttonProps}
    />
  );
}

export default Button;

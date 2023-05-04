import React from 'react';
import { _cs } from '@togglecorp/fujs';

import RawButton, { Props as RawButtonProps } from '#components/RawButton';
import styles from './styles.module.scss';

export type ButtonVariant = (
    'primary'
    | 'secondary'
    | 'tertiary'
    | 'action'
    | 'transparent'
    | 'download'
    | 'navigationPrimary'
    | 'navigationSecondary'
    | 'buttonWithDescription'
    | 'dialogConfirmOk'
    | 'dialogConfirmCancel'
    | 'navigateTop'
    | 'dropdown'
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const buttonVariantToStyleMap: { [key in ButtonVariant]: string; } = {
    primary: styles.primary,
    secondary: styles.secondary,
    tertiary: styles.tertiary,
    action: styles.action,
    transparent: styles.transparent,
    download: styles.tertiary,
    navigationPrimary: styles.navigationPrimary,
    navigationSecondary: styles.navigationSecondary,
    buttonWithDescription: styles.buttonWithDescription,
    dialogConfirmOk: styles.dialogConfirmOk,
    dialogConfirmCancel: styles.dialogConfirmCancel,
    navigateTop: styles.navigateTop,
    dropdown: styles.dropdownButton,
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
    buttonWithDescription?: String;
    name: N;
    onClick?: (name: N, e: React.MouseEvent<HTMLButtonElement>) => void;
}

type ButtonFeatureKeys =
    'variant'
    | 'className'
    | 'actionsClassName'
    | 'iconsClassName'
    | 'childrenClassName'
    | 'children'
    | 'icons'
    | 'actions'
    | 'disabled'
    | 'buttonWithDescription'

export type ButtonFeatureProps<N> = Pick<Props<N>, ButtonFeatureKeys>;
export function useButtonFeatures<N>(
    props: ButtonFeatureProps<N>,
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
        buttonWithDescription,
    } = props;

    const buttonClassName = _cs(
        styles.button,
        variant,
        buttonVariantToStyleMap[variant] ?? styles.primary,
        disabled && styles.disabled,
        className,
    );

    const buttonChildren = (
        <>
            {icons && (
                <div className={_cs(iconsClassName,
                    (variant === 'navigateTop' ? styles.navigateTopIcon : styles.icons),
                )}>
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
        buttonWithDescription,
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
        buttonWithDescription,
        name,
        onClick,
        readOnly,
        ...otherProps
    } = props;

    const handleButtonClick: RawButtonProps<N>['onClick'] = React.useCallback(
        (n, e) => {
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
        buttonWithDescription,
    });

    return (
        <>
            {buttonWithDescription ? (
                <div className={styles.buttonDescriptionWrapper}>
                    <RawButton
                        name={name}
                        type="button"
                        onClick={handleButtonClick}
                        {...otherProps}
                        {...buttonProps}
                    />
                    {buttonWithDescription}
                </div>
            ) : (
                <RawButton
                    name={name}
                    type="button"
                    onClick={handleButtonClick}
                    {...otherProps}
                    {...buttonProps}
                />
            )}
        </>
    );
}

export default Button;

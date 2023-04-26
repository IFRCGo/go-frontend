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
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const buttonVariantToStyleMap: { [key in ButtonVariant]: string; } = {
    primary: styles.primary,
    secondary: styles.secondary,
    tertiary: styles.tertiary,
    action: styles.action,
    transparent: styles.transparent,
    download: styles.tertiary,
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
    | 'disabled';
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
            {props.variant === ('download' || 'tertiary') && (
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
                </>
            )}
            {props.variant !== 'download' && (
                <>
                    {children && (
                        <div className={_cs(childrenClassName, styles.children)}>
                            {children}
                        </div>
                    )}
                    {icons && (
                        <div className={_cs(iconsClassName, styles.icons)}>
                            {icons}
                        </div>
                    )}
                    {actions && (
                        <div className={_cs(actionsClassName, styles.actions)}>
                            {actions}
                        </div>
                    )}
                </>

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

import React from 'react';
import { _cs } from '@togglecorp/fujs';
import RawButton, { Props as RawButtonProps } from '#components/draft/RawButton';
import { TabKey, TabContext, TabVariant } from '#components/draft/Tabs/TabContext';
import { setHashToBrowser } from '#utils/common';

import styles from './styles.module.scss';

const tabVariantToStyleMap: {
    [key in TabVariant]: string;
} = {
    primary: styles.primary,
    secondary: styles.secondary,
    step: styles.step,
};

export interface Props<T extends TabKey> extends Omit<RawButtonProps<T>, 'onClick' | 'variant'>{
    name: T;
    activeClassName?: string;
    borderWrapperClassName?: string;
}

export default function Tab<T extends TabKey>(props: Props<T>) {
    const context = React.useContext(TabContext);

    const {
        variant,
        disabled: disabledFromContext,
    } = context;

    const {
        activeClassName,
        className,
        name,
        disabled: disabledFromProps,
        borderWrapperClassName,
        ...otherProps
    } = props;

    let isActive = false;

    if (context.useHash) {
        isActive = context.hash === name;
    } else {
        isActive = context.activeTab === name;
    }

    const disabled = disabledFromContext || disabledFromProps;
    const button = (
        <RawButton
            className={_cs(
                className,
                styles.tab,
                isActive && styles.active,
                isActive && activeClassName,
                disabled && styles.disabled,
                variant && tabVariantToStyleMap[variant],
            )}
            onClick={context.useHash ? setHashToBrowser : context.setActiveTab}
            name={name}
            disabled={disabled}
            role="tab"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...otherProps}
        />
    );

    // The clip path used for step tab does not support border
    // So we wrap it into a container and set its background as border
    if (variant === 'step') {
        return (
            <div
                className={_cs(
                    styles.borderWrapper,
                    disabled && styles.disabled,
                    borderWrapperClassName,
                )}
            >
                { button }
            </div>
        );
    }

    return button;
}

export interface TabListProps extends React.HTMLProps<HTMLDivElement> {
    children: React.ReactNode;
}

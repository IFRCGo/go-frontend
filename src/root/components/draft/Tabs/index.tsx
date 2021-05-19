import React from 'react';

import {
    TabKey,
    TabVariant,
    TabContext,
} from '#components/draft/Tabs/TabContext';

import useHash from '#hooks/useHash';

export interface BaseProps {
    children: React.ReactNode;
    variant?: TabVariant;
    disabled?: boolean;
}

export type Props<T extends TabKey> = BaseProps & (
    {
        useHash?: false;
        value: T;
        onChange: (key: T) => void;
    } | {
        useHash: true;
        initialHash?: string;
        value?: never;
        onChange?: never;
    }
);

export function Tabs<T extends TabKey>(props: Props<T>) {
    const {
        children,
        variant = 'primary',
        disabled,
    } = props;

    // eslint-disable-next-line react/destructuring-assignment
    const hash = useHash(props.useHash ? props.initialHash : undefined);

    const contextValue = React.useMemo(() => {
        if (props.useHash) {
            return {
                variant,
                disabled,
                hash,
                useHash: props.useHash,
            };
        }

        // Note: following cast is required since we do not have any other method
        // to provide template in the context type
        return {
            variant,
            disabled,
            activeTab: props.value,
            setActiveTab: props.onChange as (key: TabKey) => void,
        };
        // eslint-disable-next-line react/destructuring-assignment
    }, [props.value, props.onChange, variant, disabled, props.useHash, hash]);

    return (
        <TabContext.Provider value={contextValue}>
            { children }
        </TabContext.Provider>
    );
}

export default Tabs;

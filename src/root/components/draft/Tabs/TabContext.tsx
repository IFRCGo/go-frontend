import React from 'react';

export type TabKey = string;
export type TabVariant = 'primary' | 'secondary' | 'step';

interface BaseTabContextProps {
    variant?: TabVariant;
    disabled?: boolean;
}

export type TabContextProps = BaseTabContextProps & (
    {
        useHash?: false;
        activeTab: TabKey;
        setActiveTab: (key: TabKey) => void;
    } | {
        useHash: true;
        hash: string | undefined;
    }
);

export const TabContext = React.createContext<TabContextProps>({
    disabled: false,
    activeTab: '',
    variant: 'primary',
    setActiveTab: () => { console.warn('setActiveTab called before it was initialized'); },
});

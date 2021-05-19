import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

export interface Props extends React.HTMLProps<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export default function TabList(props: Props) {
    const {
        children,
        className,
        ...otherProps
    } = props;

    return (
        <div
            {...otherProps}
            className={_cs(className, styles.tabList)}
            role="tablist"
        >
            { children }
        </div>
    );
}

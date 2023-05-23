import type { Ref } from 'react';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.module.css';

interface Props {
    children?: React.ReactNode;
    className?: string;
    elementRef: Ref<HTMLDivElement>;
}

function Overlay(props: Props) {
    const {
        children,
        className,
        elementRef,
    } = props;

    return (
        <div
            ref={elementRef}
            className={_cs(className, styles.overlay)}
        >
            {children}
        </div>
    );
}
export default Overlay;

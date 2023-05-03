import React, {
    useState,
    useCallback,
    useRef,
} from 'react';
import { _cs } from '@togglecorp/fujs';

import {
    useBlurEffect,
    useFloatPlacement,
} from '#hooks';

import Portal from '../Portal';
import styles from './styles.module.scss';

interface DropdownProps {
    className?: string;
    elementRef?: React.MutableRefObject<null>;
    parentRef?: React.MutableRefObject<null>;
    children?: React.ReactNode;
}

function Dropdown(props: DropdownProps) {
    const {
        parentRef,
        elementRef,
        children,
        className,
    } = props;

    const placement = useFloatPlacement(parentRef);

    return (
        <div
            ref={elementRef}
            style={placement}
            className={_cs('tc-dropdown-container', className)}
        >
            {children}
        </div>
    );
}

interface DropdownMenuProps {
    className?: string;
    dropdownContainerClassName?: string;
    children?: React.ReactNode;
    label?: React.ReactNode;
    activeClassName?: string;
    persistent?: boolean;
}

function DropdownMenu(props: DropdownMenuProps) {
    const {
        className,
        dropdownContainerClassName,
        children,
        label,
        activeClassName,
        persistent,
    } = props;

    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const handleMenuClick = useCallback(() => {
        setShowDropdown(true);
    }, [setShowDropdown]);

    const handleBlurCallback = useCallback((insideClick) => {
        if (persistent && insideClick) {
            return;
        }
        setShowDropdown(false);
    }, [setShowDropdown, persistent]);

    useBlurEffect(showDropdown, handleBlurCallback, dropdownRef, buttonRef);

    return (
        <>
            <button
                className={_cs(styles.dropdown, className, 'tc-dropdown-menu', showDropdown && activeClassName)}
                ref={buttonRef}
                onClick={handleMenuClick}
            >
                {label}
            </button>
            {showDropdown && (
                <Portal>
                    <Dropdown
                        elementRef={dropdownRef}
                        className={dropdownContainerClassName}
                        parentRef={buttonRef}
                    >
                        {children}
                    </Dropdown>
                </Portal>
            )}
        </>
    );
}

export default DropdownMenu;

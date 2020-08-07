import React from 'react';
import { _cs } from '@togglecorp/fujs';

import {
  useBlurEffect,
  useFloatPlacement,
} from '#hooks';

import Portal from './portal';

// import styles from './styles.css';

function Dropdown (props) {
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
      { children }
    </div>
  );
}

function DropdownMenu (props) {
  const {
    className,
    dropdownContainerClassName,
    children,
    label,
  } = props;

  const buttonRef = React.useRef(null);
  const dropdownRef = React.useRef(null);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const handleMenuClick = React.useCallback(() => {
    setShowDropdown(true);
  }, [setShowDropdown]);

  const handleBlurCallback = React.useCallback(() => {
    setShowDropdown(false);
  }, [setShowDropdown]);

  useBlurEffect(showDropdown, handleBlurCallback, dropdownRef, buttonRef);

  return (
    <React.Fragment>
      <button
        className={_cs(className, 'tc-dropdown-menu')}
        ref={buttonRef}
        onClick={handleMenuClick}
      >
        { label }
      </button>
      { showDropdown && (
        <Portal>
          <Dropdown
            elementRef={dropdownRef}
            className={dropdownContainerClassName}
            parentRef={buttonRef}
          >
            { children }
          </Dropdown>
        </Portal>
      )}
    </React.Fragment>
  );
}

export default DropdownMenu;

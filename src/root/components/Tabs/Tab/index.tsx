import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { ImCheckmark } from 'react-icons/im';

import RawButton, { Props as RawButtonProps } from '#components/RawButton';
import { TabKey, TabContext, TabVariant } from '#components/Tabs/TabContext';
import { setHashToBrowser } from '#utils/common';

import styles from './styles.module.scss';

const tabVariantToStyleMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  step?: number;
}

export default function Tab<T extends TabKey>(props: Props<T>) {
  const context = React.useContext(TabContext);

  const {
    variant,
    disabled: disabledFromContext,
    registerTab,
    unregisterTab,
    setStep,
    step: stepFromContext,
  } = context;

  const {
    activeClassName,
    className,
    name,
    step = 0,
    disabled: disabledFromProps,
    borderWrapperClassName,
    ...otherProps
  } = props;

  React.useEffect(() => {
    registerTab(name);

    return () => { unregisterTab(name); };
  }, [registerTab, unregisterTab, name]);

  let isActive = false;
  if (context.useHash) {
    isActive = context.hash === name;
  } else {
    isActive = context.activeTab === name;
  }

  React.useEffect(() => {
    if (isActive && setStep) {
      setStep(step);
    }
  }, [isActive, setStep, step]);

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
    const completed = stepFromContext > step;
    return (
      <div
        className={_cs(
          styles.tabWrapper,
          disabled && styles.disabled,
          isActive && styles.active,
          borderWrapperClassName,
          completed && styles.completed
        )}
      >
        <div className={styles.stepCircle}>
          <div className={styles.innerCircle}>
            { completed && <ImCheckmark className={styles.icon} /> }
          </div>
        </div>
        { button }
      </div>
    );
  }

  return button;
}

export interface TabListProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

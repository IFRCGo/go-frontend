import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Header, { Props as HeaderProps } from '#components/Header';
import Description from '#components/Description';

import styles from './styles.module.scss';

export interface Props {
  className?: string;
  innerContainerClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  descriptionClassName?: string;
  heading?: React.ReactNode;
  headingSize?: HeaderProps['headingSize'];
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  sub?: boolean;
  hideHeaderBorder?: boolean;
  headerElementRef?: HeaderProps['elementRef'];
  visibleOverflow?: boolean;
  footer?: React.ReactNode;
  footerActions?: React.ReactNode;
  footerClassName?: string,
  actionsContainerClassName?: string;
}

function Container(props: Props) {
  const {
    className,
    heading,
    description,
    actions,
    children,
    contentClassName,
    headerClassName,
    innerContainerClassName,
    descriptionClassName,
    sub,
    headingSize,
    hideHeaderBorder = false,
    headerElementRef,
    visibleOverflow,
    footer,
    footerClassName,
    footerActions,
    actionsContainerClassName
  } = props;

  return (
    <div
      className={_cs(
        'go-container',
        styles.container,
        sub && styles.sub,
        className,
        visibleOverflow && styles.visibleOverflow,
      )}
    >
      <div
        className={_cs(
          styles.innerContainer,
          innerContainerClassName,
          !hideHeaderBorder && styles.withHeaderBorder,
        )}
      >
        {(heading || actions) && (
          <Header
            className={_cs(styles.header, headerClassName)}
            heading={heading}
            actions={actions}
            headingSize={headingSize}
            elementRef={headerElementRef}
            actionsContainerClassName={actionsContainerClassName}
          />
        )}
        {description && (
          <Description className={descriptionClassName}>
            { description }
          </Description>
        )}
        {children && (
          <div className={_cs(styles.content, contentClassName)}>
            { children }
          </div>
        )}
        {(footer || footerActions) && (
          <div className={_cs(styles.footer, footerClassName)}>
            <div className={styles.footerContent}>
              {footer}
            </div>
            <div className={styles.footerActions}>
              {footerActions}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Container;

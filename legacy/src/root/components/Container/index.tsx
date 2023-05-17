import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Header, { Props as HeaderProps } from '#components/Header';
import Footer from '#components/Footer';
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
  icons?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  sub?: boolean;
  hideHeaderBorder?: boolean;
  headerElementRef?: HeaderProps['elementRef'];
  footer?: React.ReactNode;
  footerIcons?: React.ReactNode;
  footerActions?: React.ReactNode;
  footerClassName?: string,
  footerContentClassName?: string;
}

function Container(props: Props) {
  const {
    className,
    heading,
    description,
    icons,
    actions,
    children,
    contentClassName,
    headerClassName,
    innerContainerClassName,
    descriptionClassName,
    sub,
    headingSize = 'extraSmall',
    hideHeaderBorder = false,
    headerElementRef,
    footer,
    footerClassName,
    footerContentClassName,
    footerActions,
    footerIcons,
  } = props;

  const showHeader = icons || heading || actions;
  const showHeaderBorder = !hideHeaderBorder && showHeader;
  const showFooter = footerIcons || footer || footerActions;

  return (
    <div
      className={_cs(
        styles.container,
        sub && styles.sub,
        className,
      )}
    >
      <div className={_cs(styles.innerContainer, innerContainerClassName)}>
        {showHeader && (
          <Header
            className={_cs(styles.header, headerClassName)}
            heading={heading}
            icons={icons}
            actions={actions}
            headingSize={headingSize}
            elementRef={headerElementRef}
          />
        )}
        {showHeaderBorder && (
          <hr className={styles.headerBorder} />
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
        {showFooter && (
          <Footer
            className={_cs(styles.footer, footerClassName)}
            childrenContainerClassName={footerContentClassName}
            icons={footerIcons}
            actions={footerActions}
          >
            {footer}
          </Footer>
        )}
      </div>
    </div>
  );
}

export default Container;

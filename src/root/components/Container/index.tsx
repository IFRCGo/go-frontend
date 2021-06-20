import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Header, { Props as HeaderProps } from '#components/Header';
import Description from '#components/Description';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  innerContainerClassName?: string;
  contentClassName?: string;
  descriptionClassName?: string;
  heading?: React.ReactNode;
  headingSize?: HeaderProps['headingSize'];
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  sub?: boolean;
  hideHeaderBorder?: boolean;
}

function Container(props: Props) {
  const {
    className,
    heading,
    description,
    actions,
    children,
    contentClassName,
    innerContainerClassName,
    descriptionClassName,
    sub,
    headingSize,
    hideHeaderBorder,
  } = props;

  return (
    <div
      className={_cs(
        'go-container',
        styles.container,
        sub && styles.sub,
        className,
        hideHeaderBorder && styles.withoutHeaderBorder,
      )}
    >
      <div className={_cs(styles.innerContainer, innerContainerClassName)}>
        {(heading || actions) && (
          <Header
            className={styles.header}
            heading={heading}
            actions={actions}
            headingSize={headingSize}
          />
        )}
        {description && (
          <Description className={descriptionClassName}>
            { description }
          </Description>
        )}
        <div className={_cs(styles.content, contentClassName)}>
          { children }
        </div>
      </div>
    </div>
  );
}

export default Container;

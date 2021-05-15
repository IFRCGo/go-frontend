import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Header from '#components/draft/Header';
import Description from '#components/draft/Description';

import styles from './styles.module.scss';

interface Props {
    className?: string;
    innerContainerClassName?: string;
    contentClassName?: string;
    descriptionClassName?: string;
    heading?: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    children?: React.ReactNode;
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
  } = props;

  return (
    <div
      className={_cs(
        'go-container',
        styles.container,
        className,
      )}
    >
      <div className={_cs(styles.innerContainer, innerContainerClassName)}>
        {(heading || actions) && (
          <Header
            className={styles.header}
            heading={heading}
            actions={actions}
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

import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Heading, { Props as HeadingProps } from '#components/Heading';
import Description from '#components/Description';

import useBasicLayout from '#hooks/useBasicLayout';
import styles from './styles.module.scss';

export interface Props {
  className?: string;
  headingClassName?: string;
  descriptionClassName?: string;
  headingContainerClassName?: string;
  iconsContainerClassName?: string;
  actionsContainerClassName?: string;
  heading?: React.ReactNode;
  description?: React.ReactNode;
  icons?: React.ReactNode;
  actions?: React.ReactNode;
  headingSize?: HeadingProps['size'];
  elementRef?: React.Ref<HTMLDivElement>;
}

function Header(props: Props) {
  const {
    className,
    headingClassName,
    descriptionClassName,
    iconsContainerClassName,
    headingContainerClassName,
    actionsContainerClassName,
    heading,
    description,
    actions,
    icons,
    headingSize,
    elementRef,
  } = props;

  const {
    content,
    containerClassName,
  } = useBasicLayout({
    className,
    icons,
    children: (
      <>
        <Heading
          size={headingSize}
          className={headingClassName}
        >
          { heading }
        </Heading>
        {description && (
          <Description className={descriptionClassName}>
            {description}
          </Description>
        )}
      </>
    ),
    actions,
    iconsContainerClassName,
    actionsContainerClassName,
    childrenContainerClassName: headingContainerClassName,
  });

  return (
    <header
      ref={elementRef}
      className={_cs(styles.header, containerClassName)}
    >
      {content}
    </header>
  );
}

export default Header;

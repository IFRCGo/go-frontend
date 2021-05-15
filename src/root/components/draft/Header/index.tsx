import React from 'react';
import { _cs } from '@togglecorp/fujs';

import ElementFragments from '#components/draft/ElementFragments';
import Heading, { Props as HeadingProps } from '#components/draft/Heading';
import Description from '#components/draft/Description';

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
  } = props;

  return (
    <header className={_cs(className, styles.header)}>
      <ElementFragments
        icons={icons}
        iconsContainerClassName={iconsContainerClassName}
        actions={actions}
        actionsContainerClassName={actionsContainerClassName}
        childrenContainerClassName={_cs(styles.headingContainer, headingContainerClassName)}
      >
        <Heading
          size={headingSize}
          className={_cs(styles.heading, headingClassName)}
        >
          { heading }
        </Heading>
        {description && (
          <Description
            className={_cs(
              styles.description,
              descriptionClassName,
              headingSize === 'extraSmall' && styles.small,
            )}
          >
            {description}
          </Description>
        )}
      </ElementFragments>
    </header>
  );
}

export default Header;

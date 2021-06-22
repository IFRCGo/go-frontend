import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
  IoCaretDown,
  IoCaretUp,
} from 'react-icons/io5';

import useBooleanState from '#hooks/useBooleanState';

import styles from './styles.module.scss';

import Container, {
  Props as ContainerProps,
} from '#components/Container';

export type Props = Omit<ContainerProps, 'headerElementRef'> & {
  initiallyExpanded?: boolean;
};

function ExpandibleContainer(props: Props) {
  const {
    className,
    children,
    actions,
    initiallyExpanded,
    headerClassName,
    ...otherProps
  } = props;

  const headerRef = React.useRef<HTMLDivElement>(null);
  const [showChildren,,,,toggleShowChildren] = useBooleanState(!!initiallyExpanded);

  React.useEffect(() => {
    const { current: headerElement } = headerRef;
    if (headerElement) {
      headerElement.addEventListener('click', toggleShowChildren);
    }

    return () => {
      if (headerElement) {
        headerElement.removeEventListener('click', toggleShowChildren);
      }
    };
  }, [toggleShowChildren]);

  return (
    <Container
      className={_cs(styles.expandableContainer, className)}
      headerElementRef={headerRef}
      headerClassName={_cs(styles.header, headerClassName)}
      actions={(
        <>
          {actions}
          {showChildren ? (
            <IoCaretUp />
          ) : (
            <IoCaretDown />
          )}
        </>
      )}
      {...otherProps}
    >
      {showChildren && children }
    </Container>
  );
}

export default ExpandibleContainer;

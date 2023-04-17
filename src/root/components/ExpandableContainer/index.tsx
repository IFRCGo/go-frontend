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
  componentRef?: React.MutableRefObject<{
      setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  } | null>;
};

function ExpandableContainer(props: Props) {
  const {
    className,
    children,
    actions,
    initiallyExpanded = false,
    headerClassName,
    componentRef,
    actionsContainerClassName,
    ...otherProps
  } = props;

  const headerRef = React.useRef<HTMLDivElement>(null);
  const [
    showChildren,
    ,
    ,
    setShowChildren,
    toggleShowChildren,
  ] = useBooleanState(!!initiallyExpanded);

  React.useEffect(() => {
    if (componentRef) {
      componentRef.current = {
        setIsExpanded: setShowChildren,
      };
    }
  }, [componentRef, setShowChildren]);

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
      actionsContainerClassName={actionsContainerClassName}
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

export default ExpandableContainer;

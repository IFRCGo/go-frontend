import React from 'react';

import useBasicLayout from '#hooks/useBasicLayout';


export interface Props {
  className?: string;
  iconsContainerClassName?: string;
  actionsContainerClassName?: string;
  children: React.ReactNode;
  childrenContainerClassName?: string;
  icons?: React.ReactNode;
  actions?: React.ReactNode;
}

function Header(props: Props) {
  const {
    className,
    iconsContainerClassName,
    childrenContainerClassName,
    actionsContainerClassName,
    actions,
    icons,
    children,
  } = props;

  const {
    content,
    containerClassName,
  } = useBasicLayout({
    className,
    icons,
    children,
    actions,
    iconsContainerClassName,
    actionsContainerClassName,
    childrenContainerClassName,
  });

  return (
    <footer
      className={containerClassName}
    >
      {content}
    </footer>
  );
}

export default Header;

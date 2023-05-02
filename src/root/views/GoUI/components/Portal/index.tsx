import React from 'react';
import { createPortal } from 'react-dom';

export interface Props {
  children: React.ReactNode;
  className?: string;
  containerRef?: React.MutableRefObject<HTMLDivElement>;
}

function Portal(props: Props) {
  const { className, children, containerRef } = props;

  return (
    <div className={className} ref={containerRef}>
      {createPortal(
        children,
        document.body,
      )}
    </div>
  );
}

export default Portal;

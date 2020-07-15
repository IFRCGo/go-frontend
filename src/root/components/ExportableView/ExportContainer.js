import React from 'react';

import exportContext from './exportContext';

function ExportContainer(p) {
  const { setContainerRef } = React.useContext(exportContext);
  const containerRef = React.useRef();

  React.useEffect(() => {
    setContainerRef(containerRef);
  }, [setContainerRef, containerRef]);

  const {
    className,
    children,
  } = p;

  return (
    <div
      className={className}
      ref={containerRef}
    >
      { children }
    </div>
  );
}

export default ExportContainer;

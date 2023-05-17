import React from 'react';
import _cs from 'classnames';

import exportContext from './exportContext';

function ExportContainer(p) {
  const {
    setContainerRef,
    isExporting,
  } = React.useContext(exportContext);
  const containerRef = React.useRef();

  React.useEffect(() => {
    setContainerRef(containerRef);
  }, [setContainerRef, containerRef]);

  const {
    className,
    exportClassName,
    children,
  } = p;

  return (
    <div
      className={_cs(
        className,
        isExporting && exportClassName,
      )}
      ref={containerRef}
    >
      { children }
    </div>
  );
}

export default ExportContainer;

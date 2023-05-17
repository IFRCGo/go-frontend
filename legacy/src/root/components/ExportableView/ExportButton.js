import React from 'react';

import exportContext from './exportContext';

function ExportButton(p) {
  const { startExport } = React.useContext(exportContext);

  const handleExportButtonClick = React.useCallback(() => {
    startExport();
  }, [startExport]);

  const {
    className,
    children = 'Export',
  } = p;

  return (
    <button
      className={className}
      onClick={handleExportButtonClick}
    >
      { children }
    </button>
  );
}

export default ExportButton;

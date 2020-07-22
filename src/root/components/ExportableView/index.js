import React from 'react';
import html2canvas from 'html2canvas';
import { startDownload } from '#utils/download-starter';

import exportContext from './exportContext';

function ExportableView(p) {
  const [containerRef, setContainerRef] = React.useState({ current: null });
  const [isExporting, setIsExporting] = React.useState(false);

  const {
    preview,
    children,
    exportFileLabel = 'export',
  } = p;

  const startExport = React.useCallback(() => {
    setIsExporting(true);

    if (containerRef.current) {
      html2canvas(containerRef.current, {useCORS: true}).then((renderedCanvas) => {
        setIsExporting(false);
        startDownload(
          renderedCanvas,
          `${exportFileLabel}-${new Date().getTime()}.png`,
        );
      });
    } else {
      setIsExporting(false);
    }
  }, [setIsExporting, containerRef, exportFileLabel]);

  const contextValue = React.useMemo(() => ({
    isPreviewMode: preview,
    setContainerRef,
    startExport,
    isExporting,
  }), [preview, setContainerRef, startExport, isExporting]);

  return (
    <exportContext.Provider value={contextValue}>
      { children }
    </exportContext.Provider>
  );
}

export default ExportableView;

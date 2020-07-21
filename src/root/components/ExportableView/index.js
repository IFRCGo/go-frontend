import React from 'react';
import html2canvas from 'html2canvas';
import { startDownload } from '#utils/download-starter';

import exportContext from './exportContext';

function ExportableView(p) {
  const [eventListeners, setEventListeners] = React.useState({});
  const [containerRef, setContainerRef] = React.useState({ current: null });
  const {
    preview,
    children,
  } = p;

  const startExport = React.useCallback(() => {
    Object.values(eventListeners).forEach(listener => {
      listener(true);
    });

    if (containerRef.current) {
      // this is to skip current js event loop
      html2canvas(containerRef.current, {useCORS: true}).then((renderedCanvas) => {
        Object.values(eventListeners).forEach(listener => {
          listener(false);
        });

        startDownload(
          renderedCanvas,
          `export-${new Date().getTime()}.png`,
        );
      });
    }
  }, [eventListeners, containerRef]);

  const addExportEventListener = React.useCallback((key, eventListener) => {
    setEventListeners((prevListeners) => ({
      ...prevListeners,
      [key]: eventListener,
    }));
  }, [setEventListeners]);

  const removeExportEventListener = React.useCallback((key) => {
    setEventListeners((prevListeners) => {
      let newListeners = { ...prevListeners };
      delete newListeners[key];

      return newListeners;
    });
  }, [setEventListeners]);

  const contextValue = React.useMemo(() => ({
    addExportEventListener,
    removeExportEventListener,
    isPreviewMode: preview,
    setContainerRef,
    startExport,
  }), [addExportEventListener, removeExportEventListener, preview, setContainerRef, startExport]);

  return (
    <exportContext.Provider value={contextValue}>
      { children }
    </exportContext.Provider>
  );
}

export default ExportableView;

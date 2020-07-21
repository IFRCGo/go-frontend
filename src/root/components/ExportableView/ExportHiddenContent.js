import React from 'react';
import _cs from 'classnames';

import exportContext from './exportContext';
import styles from './styles.module.scss';

const stylesToModeMap = {
  display: styles.display,
  visibility: styles.visibility,
};


function ExportHiddenContent(p) {
  const {
    className, 
    children,
    mode='display', // display or visibility
  } = p;

  const [isExporting, setIsExporting] = React.useState(false);

  const {
    addExportEventListener,
    removeExportEventListener,
    isPreviewMode,
  } = React.useContext(exportContext);

  const handleExportEvent = React.useCallback((isExporting) => {
    setIsExporting(isExporting);
  }, [setIsExporting]);

  React.useEffect(() => {
    addExportEventListener('export-hidden-content', handleExportEvent);

    return () => removeExportEventListener('export-hidden-content');
  }, [addExportEventListener, removeExportEventListener, handleExportEvent]);

  return (
    <div className={_cs(
        className,
        stylesToModeMap[mode],
        styles.exportHidden,
        isExporting && styles.exporting,
        isPreviewMode && styles.preview,
      )}
    >
      { children }
    </div>
  );
}

export default ExportHiddenContent;

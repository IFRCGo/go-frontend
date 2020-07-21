import React from 'react';
import _cs from 'classnames';
import { randomString } from '@togglecorp/fujs';

import exportContext from './exportContext';
import styles from './styles.module.scss';

const stylesToModeMap = {
  display: styles.display,
  visibility: styles.visibility,
};

function ExportOnlyContent(p) {
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
    const randomKey = randomString();
    const exportEventKey = `export-only-content-${randomKey}`;
    addExportEventListener(exportEventKey, handleExportEvent);

    return () => removeExportEventListener(exportEventKey);
  }, [addExportEventListener, removeExportEventListener, handleExportEvent]);

  return (
    <div className={_cs(
        className,
        stylesToModeMap[mode],
        styles.exportOnly,
        isExporting && styles.exporting,
        isPreviewMode && styles.preview,
      )}
    >
      { children }
    </div>
  );
}

export default ExportOnlyContent;

import React from 'react';

const exportContext = React.createContext({
  isPreviewMode: false,
  isExporting: false,
});

export default exportContext;

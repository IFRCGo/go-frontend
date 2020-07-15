import React from 'react';

const noOp = () => {};

const exportContext = React.createContext({
  addExportEventListener: noOp,
  removeExportEventListener: noOp,
  isPreviewMode: false,
});

export default exportContext;

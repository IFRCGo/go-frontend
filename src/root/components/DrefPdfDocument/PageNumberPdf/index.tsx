import React from 'react';
import { Text } from '@react-pdf/renderer';

import pdfStyles from '#utils/pdf/pdfStyles';

function PageNumberPdf() {
  return (
    <Text
      style={pdfStyles.pageNumber}
      render={({ pageNumber, totalPages }) => (
        `Page ${pageNumber} / ${totalPages}`
      )}
      fixed
    />
  );
}

export default PageNumberPdf;

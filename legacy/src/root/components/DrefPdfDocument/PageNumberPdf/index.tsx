import React from 'react';
import { Image, Text, View } from '@react-pdf/renderer';

import pdfStyles from '#utils/pdf/pdfStyles';

const logoUrl = '/assets/graphics/layout/go-pdf-footer.png';
function PageNumberPdf() {
  return (
    <View
      fixed
      style={pdfStyles.footer}
    >
      <Text
        style={pdfStyles.pageNumber}
        render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} / ${totalPages}`
        )}
      />
      <Image
        style={pdfStyles.footerLogo}
        src={logoUrl}
      />
    </View>
  );
}

export default PageNumberPdf;

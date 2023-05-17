import React from 'react';
import {
  Image,
  Text,
  View,
} from '@react-pdf/renderer';

import { Strings } from '#types';
import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  documentTitle: string;
  strings: Strings;
}

const logoUrl = '/assets/graphics/layout/ifrc-square.png';

function HeadingOutput(props: Props) {
  const {
    documentTitle,
    strings,
  } = props;
  return (
    <View style={pdfStyles.titleSection}>
      <View style={pdfStyles.logoAndTitle}>
        <Image
          style={pdfStyles.titleIfrcLogo}
          src={logoUrl}
        />
        <View>
          <Text style={pdfStyles.pageTitle}>
            {strings.operationalUpdateExportTitle}
          </Text>
          <Text style={pdfStyles.subTitle}>
            {documentTitle}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default HeadingOutput;

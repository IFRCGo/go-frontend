import React from 'react';
import {
  Image,
  View,
  Text,
} from '@react-pdf/renderer';

import { DrefFinalReportApiFields } from '#views/FinalReportForm/common';

import pdfStyles from 'src/styles/pdf/pdfStyles';

interface Props {
  data: DrefFinalReportApiFields['needs_identified'][number];
  niMap?: Record<string, string>;
}

function NeedIdentified(props: Props) {
  const {
    data,
    niMap,
  } = props;

  return (
    <View
      wrap={false}
      style={pdfStyles.niContainer}
    >
      <View style={pdfStyles.niContentIconCell}>
        {data.image_url && (
          <Image
            style={pdfStyles.niIcon}
            src={data.image_url}
          />
        )}
        <Text style={pdfStyles.niSubSectionHeading}>
          {niMap?.[data.title]}
        </Text>
      </View>

      <View style={pdfStyles.niContentTextCell}>
        <Text>
          {data.description}
        </Text>
      </View>
    </View >
  );
}

export default NeedIdentified;

import React from 'react';
import { isNotDefined } from '@togglecorp/fujs';

import { Strings } from '#types';
import {
  Text,
  View,
} from '@react-pdf/renderer';
import { DrefOperationalUpdateApiFields } from '#views/DrefOperationalUpdateForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  data: DrefOperationalUpdateApiFields;
  strings: Strings;
}

function IcrcActionsOutput(props: Props) {
  const {
    data,
    strings,
  } = props;

  if (isNotDefined(data.icrc)) {
    return null;
  }

  return (
    <View style={pdfStyles.section}>
      <Text
        style={pdfStyles.sectionHeading}
        minPresenceAhead={20}
      >
        {strings.drefFormIcrcActionsHeading}
      </Text>
      <View style={pdfStyles.row}>
        <View style={pdfStyles.niFullWidthContentCell}>
          <Text>{data.icrc}</Text>
        </View>
      </View>
    </View>
  );
}

export default IcrcActionsOutput;

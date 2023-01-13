import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';
import { isNotDefined } from '@togglecorp/fujs';

import pdfStyles from '#utils/pdf/pdfStyles';
import { Strings } from '#types';
import { DrefFinalReportApiFields } from '#views/FinalReportForm/common';
import { formatBoolean } from '#utils/common';

interface BaseProps {
  data: DrefFinalReportApiFields;
  strings: Strings;
}

function NationalSocietyOutput(props: BaseProps) {
  const {
    data,
    strings,
  } = props;

  if (isNotDefined(data.has_national_society_conducted) || isNotDefined(data.national_society_conducted_description)) {
    return null;
  }

  return (
    <View
      style={pdfStyles.section}
    >
      <Text
        style={pdfStyles.sectionHeading}
        minPresenceAhead={20}
      >
        {strings.finalReportNationalSocietiesActions}
      </Text>
      <View style={pdfStyles.row}>
        <View style={pdfStyles.niHeaderCell}>
          <Text>{strings.finalReportHaveNationalSocietyConducted}</Text>
        </View>
        <View style={pdfStyles.niContentCell}>
          <Text>{formatBoolean(data.has_national_society_conducted)}</Text>
        </View>
      </View>
      <View style={pdfStyles.row}>
        <View style={pdfStyles.niHeaderCell}>
          <Text>{strings.finalReportDescriptionOfAdditionalActivities}</Text>
        </View>
        <View style={pdfStyles.niContentCell}>
          <Text>{data.national_society_conducted_description}</Text>
        </View>
      </View>
    </View >
  );
}

export default NationalSocietyOutput;

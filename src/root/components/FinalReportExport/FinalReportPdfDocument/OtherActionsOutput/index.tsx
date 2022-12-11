import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';
import { isNotDefined } from '@togglecorp/fujs';

import { Strings } from '#types';
import { formatBoolean } from '#utils/common';
import pdfStyles from '#utils/pdf/pdfStyles';
import { DrefFinalReportApiFields } from '#views/FinalReportForm/common';

interface Props {
  data: DrefFinalReportApiFields;
  strings: Strings;
}

function OtherActionsOutput(props: Props) {
  const {
    data,
    strings,
  } = props;

  if (isNotDefined(data.government_requested_assistance)
    && isNotDefined(data.national_authorities)
    && isNotDefined(data.un_or_other_actor)
    && isNotDefined(data.major_coordination_mechanism)
  ) {
    return null;
  }

  return (
    <View style={pdfStyles.section}>
      <Text
        style={pdfStyles.sectionHeading}
        minPresenceAhead={20}
      >
        {strings.drefFormNationalOtherActors}
      </Text>
      <View>
        <View style={pdfStyles.row}>
          <View style={pdfStyles.niHeaderCell}>
            <Text>{strings.drefFormInternationalAssistance}</Text>
          </View>
          <View style={pdfStyles.niContentCell}>
            <Text>{formatBoolean(data.government_requested_assistance)}</Text>
          </View>
        </View>
        <View style={pdfStyles.row}>
          <View style={pdfStyles.niHeaderCell}>
            <Text>{strings.drefFormNationalAuthorities}</Text>
          </View>
          <View style={pdfStyles.niContentCell}>
            <Text>{data?.national_authorities}</Text>
          </View>
        </View>
        <View style={pdfStyles.row}>
          <View style={pdfStyles.niHeaderCell}>
            <Text>{strings.drefFormUNorOtherActors}</Text>
          </View>
          <View style={pdfStyles.niContentCell}>
            <Text>{data?.un_or_other_actor}</Text>
          </View>
        </View>

        <View style={pdfStyles.row}>
          <View style={[
            pdfStyles.cellTitle,
            pdfStyles.fullWidth
          ]}>
            <Text style={pdfStyles.fontWeightBold}>
              {strings.drefFormCoordinationMechanism}
            </Text>
          </View>
        </View>
        <View style={pdfStyles.row}>
          <View style={[
            pdfStyles.cellTitle,
            pdfStyles.fullWidth
          ]}>
            <Text>{data?.major_coordination_mechanism}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default OtherActionsOutput;

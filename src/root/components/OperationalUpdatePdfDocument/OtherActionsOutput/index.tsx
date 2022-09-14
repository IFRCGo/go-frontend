import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';
import { isDefined } from '@togglecorp/fujs';

import { Strings } from '#types';
import { formatBoolean } from '#utils/common';
import { DrefOperationalUpdateApiFields } from '#views/DrefOperationalUpdateForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  data: DrefOperationalUpdateApiFields;
  strings: Strings;
}

function OtherActionsOutput(props: Props) {
  const {
    data,
    strings,
  } = props;

  return (
    <>
      {(isDefined(data.government_requested_assistance)
        || isDefined(data.national_authorities)
        || isDefined(data.un_or_other_actor)
        || isDefined(data.major_coordination_mechanism)
      ) && (
          <View
            style={pdfStyles.section}
            wrap={false}
          >
            <Text style={pdfStyles.sectionHeading}>
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
        )}
    </>
  );
}

export default OtherActionsOutput;

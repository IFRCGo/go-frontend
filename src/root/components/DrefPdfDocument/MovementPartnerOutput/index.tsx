import React from 'react';
import { DrefApiFields } from '#views/DrefApplicationForm/common';
import { Strings } from '#types';
import {
  Text,
  View,
} from '@react-pdf/renderer';
import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  data: DrefApiFields;
  strings: Strings;
}

function MovementPartnerOutput(props: Props) {
  const {
    data,
    strings,
  } = props;

  return (
    <>
      {(data.ifrc
        || data.icrc
        || data.partner_national_society
      ) && (
          <View
            style={pdfStyles.section}
            wrap={false}
          >
            <Text style={pdfStyles.sectionHeading}>
              {strings.drefFormMovementPartners}
            </Text>
            <View>
              <View style={pdfStyles.row}>
                <View style={pdfStyles.niHeaderCell}>
                  <Text>{strings.drefFormIfrc}</Text>
                </View>
                <View style={pdfStyles.niContentCell}>
                  <Text>{data.ifrc}</Text>
                </View>
              </View>
              <View style={pdfStyles.row}>
                <View style={pdfStyles.niHeaderCell}>
                  <Text>{strings.drefFormIcrc}</Text>
                </View>
                <View style={pdfStyles.niContentCell}>
                  <Text>{data.icrc}</Text>
                </View>
              </View>
              <View style={pdfStyles.row}>
                <View style={pdfStyles.niHeaderCell}>
                  <Text>{strings.drefFormPartnerNationalSociety}</Text>
                </View>
                <View style={pdfStyles.niContentCell}>
                  <Text>{data.partner_national_society}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
    </>
  );
}

export default MovementPartnerOutput;
import React from 'react';
import { Text, View } from '@react-pdf/renderer';

import { Strings } from '#types';
import { DrefApiFields } from '#views/DrefApplicationForm/common';
import { PdfTextOutput } from '#components/PdfTextOutput';
import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  data: DrefApiFields;
  strings: Strings;
}

function RiskAndSecurityOutput(props: Props) {
  const {
    data,
    strings,
  } = props;

  return (
    <View style={pdfStyles.section}>
      <Text style={pdfStyles.sectionHeading}>
        {strings.drefFormRiskSecurity}
      </Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.basicInfoTable}>
          <View style={pdfStyles.compactSection}>
            <PdfTextOutput
              label={strings.drefFormRiskSecurityPotentialRisk}
              columns="4/4"
            />
          </View>
          <View style={pdfStyles.compactSection}>
            <PdfTextOutput
              label={strings.drefFormRiskSecurityRiskLabel}
              columns="2/4"
            />
            <PdfTextOutput
              label={strings.drefExportRiskSecurityMitigationLabel}
              columns="2/4"
            />
          </View>
          {data?.risk_security.map((rm, i) => (
            <View
              key={i}
              style={pdfStyles.compactSection}
            >
              <PdfTextOutput
                value={rm.risk}
                columns="2/4"
              />
              <PdfTextOutput
                value={rm.mitigation}
                columns="2/4"
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default RiskAndSecurityOutput;

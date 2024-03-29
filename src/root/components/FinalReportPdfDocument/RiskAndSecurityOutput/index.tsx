import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';
import {
  isDefined,
  isNotDefined,
} from '@togglecorp/fujs';

import { Strings } from '#types';
import { PdfTextOutput } from '#components/PdfTextOutput';
import pdfStyles from '#utils/pdf/pdfStyles';
import { DrefFinalReportApiFields } from '#views/FinalReportForm/common';

interface Props {
  data: DrefFinalReportApiFields;
  strings: Strings;
}

function RiskAndSecurityOutput(props: Props) {
  const {
    data,
    strings,
  } = props;

  if (
    isNotDefined(data.risk_security_concern)
    && data.risk_security.length < 1
  ) {
    return null;
  }

  return (
    <View style={pdfStyles.section}>
      <Text
        style={pdfStyles.sectionHeading}
        minPresenceAhead={20}
      >
        {strings.drefFormRiskSecurity}
      </Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.basicInfoTable}>
          {data.risk_security.length > 0 && (
            <>
              <View style={pdfStyles.compactSection}>
                <PdfTextOutput
                  value={strings.drefFormRiskSecurityPotentialRisk}
                  columns="4/4"
                  color="Red"
                />
              </View>
              <View style={pdfStyles.compactSection}>
                <PdfTextOutput
                  value={strings.drefFormRiskSecurityRiskLabel}
                  columns="2/4"
                />
                <PdfTextOutput
                  value={strings.drefFormRiskSecurityMitigationLabel}
                  columns="2/4"
                />
              </View>
              {data?.risk_security.map((rm, i) => (
                <View
                  key={i}
                  style={pdfStyles.compactSection}
                >
                  <PdfTextOutput
                    label={rm.risk}
                    columns="2/4"
                  />
                  <PdfTextOutput
                    label={rm.mitigation}
                    columns="2/4"
                  />
                </View>
              ))}
            </>
          )}
          {isDefined(data.risk_security_concern) && (
            <View>
              <PdfTextOutput
                value={strings.drefFormRiskSecuritySafetyConcern}
                columns="4/4"
                color="Red"
              />
              <PdfTextOutput
                label={data.risk_security_concern}
                columns="4/4"
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export default RiskAndSecurityOutput;

import React from 'react';
import {
  Image,
  Text,
  View,
} from '@react-pdf/renderer';
import { isDefined, isNotDefined } from '@togglecorp/fujs';

import { DrefFinalReportApiFields } from '#views/FinalReportForm/common';
import { Strings } from '#types';
import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  data: DrefFinalReportApiFields;
  strings: Strings;
}

function FinancialReportFileOutput(props: Props) {
  const {
    data,
    strings,
  } = props;

  if (isNotDefined(data.financial_report_preview) && isNotDefined(data.financial_report_description)) {
    return null;
  }

  return (
    <View break>
      <Text style={pdfStyles.sectionHeading}>
        {strings.finalReportFinancialReport}
      </Text>
        {isDefined(data.financial_report_preview) && (
        <View>
          <Image
            style={pdfStyles.budgetImage}
            src={data.financial_report_preview}
          />
        </View>
      )}
      {isDefined(data.financial_report_details) && (
        <View>
          <Text>
            <a
              style={pdfStyles.financialReportLink}
              href={data.financial_report_details.file}
              target="_blank"
            >
              Click here for the financial report
            </a>
          </Text>
        </View>
      )}
      {isDefined(data.financial_report_description) && (
        <View style={pdfStyles.subSection}>
          <Text style={pdfStyles.subSectionHeading}>
            {strings.finalReportFinancialReportVariances}
          </Text>
          <Text style={pdfStyles.text}>
            {data.financial_report_description}
          </Text>
        </View>
      )}
    </View>
  );
}

export default FinancialReportFileOutput;

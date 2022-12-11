import React from 'react';
import {
  Page as PDFPage,
  Document,
} from '@react-pdf/renderer';

import { ONSET_IMMINENT } from '#views/DrefApplicationForm/common';
import {
  NumericKeyValuePair,
  StringKeyValuePair,
  Strings,
} from '#types';
import pdfStyles from '#utils/pdf/pdfStyles';
import { DrefFinalReportApiFields } from '#views/FinalReportForm/common';
import HeadingOutput from './HeadingOutput';

interface DrefOptions {
  disaster_category: NumericKeyValuePair[];
  needs_identified: StringKeyValuePair[];
  planned_interventions: StringKeyValuePair[];
  status: NumericKeyValuePair[];
  type_of_onset: NumericKeyValuePair[];
  users: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
  }[];
}

interface Props {
  finalReportResponse: DrefFinalReportApiFields;
  drefOptions: DrefOptions;
  strings: Strings;
}

function FinalReportPdfDocument(props: Props) {
  const {
    finalReportResponse,
    drefOptions,
    strings,
  } = props;

  const affectedAreas = finalReportResponse?.district_details?.map(d => d.name).join(', ');
  const isImminentOnset = finalReportResponse?.disaster_type === ONSET_IMMINENT;
  const documentTitle = finalReportResponse.title;

  return (
    <Document
      title={documentTitle}
      author={strings.drefExportIfrcName}
      creator={strings.drefExportIfrcName}
      producer={strings.drefExportIfrcName}
      keywords="finalReportResponse"
    >
      <PDFPage
        style={pdfStyles.portraitPage}
        size="A4"
      >
        <HeadingOutput
          documentTitle={documentTitle}
          strings={strings}
        />
      </PDFPage>
    </Document>
  );
}
export default FinalReportPdfDocument;

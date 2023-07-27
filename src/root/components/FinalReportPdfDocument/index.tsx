import React from 'react';
import {
  Page as PDFPage,
  Document,
} from '@react-pdf/renderer';
import { listToMap } from '@togglecorp/fujs';

import {
  NumericKeyValuePair,
  StringKeyValuePair,
  Strings,
} from '#types';
import pdfStyles from '#utils/pdf/pdfStyles';
import { DrefFinalReportApiFields, TYPE_ASSESSMENT } from '#views/FinalReportForm/common';
import HeadingOutput from './HeadingOutput';
import EssentialInformationOutput from './EssentialInformationOutput';
import EventDescriptionOutput from './EventDescriptionOutput';
import NationalSocietyOutput from './NationalSocietyOutput';
import MovementPartnerOutput from './MovementPartnerOutput';
import OtherActionsOutput from './OtherActionsOutput';
import NeedIdentifiedOutput from './NeedIdentifiedOutput';
import ObjectiveAndStrategy from './ObjectivesAndStrategy';
import RiskAndSecurityOutput from './RiskAndSecurityOutput';
import PlannedInterventionOutput from './PlannedInterventionOutput';
import TargetedPopulationOutput from './TargetedPopulationOutput';
import ContactInformationOutput from './ContactInformationOutput';
import PageNumberPdf from '#components/DrefPdfDocument/PageNumberPdf';
import FinancialReportFileOutput from './FinancialReportFileOutput';

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

  const piMap = listToMap(drefOptions.planned_interventions, d => d.key, d => d.value);
  const niMap = listToMap(drefOptions.needs_identified, d => d.key, d => d.value);
  const affectedAreas = finalReportResponse?.district_details?.map(d => d.name).join(', ');
  const documentTitle = finalReportResponse.title;
  const drefType = finalReportResponse.type_of_dref;

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
        <EssentialInformationOutput
          data={finalReportResponse}
          strings={strings}
          affectedAreas={affectedAreas}
          drefType={drefType}
        />
        <EventDescriptionOutput
          data={finalReportResponse}
          strings={strings}
          drefType={drefType}
        />
        <NationalSocietyOutput
          data={finalReportResponse}
          strings={strings}
        />
        <MovementPartnerOutput
          data={finalReportResponse}
          strings={strings}
        />
        <OtherActionsOutput
          data={finalReportResponse}
          strings={strings}
        />
        {drefType !== TYPE_ASSESSMENT &&
          <NeedIdentifiedOutput
            data={finalReportResponse}
            niMap={niMap}
            drefType={drefType}
            strings={strings}
          />
        }
        <ObjectiveAndStrategy
          data={finalReportResponse}
          strings={strings}
        />
        <TargetedPopulationOutput
          data={finalReportResponse}
          strings={strings}
          drefType={drefType}
        />
        <RiskAndSecurityOutput
          data={finalReportResponse}
          strings={strings}
        />
        <PlannedInterventionOutput
          strings={strings}
          data={finalReportResponse}
          piMap={piMap}
        />
        <FinancialReportFileOutput
          strings={strings}
          data={finalReportResponse}
        />
        <ContactInformationOutput
          data={finalReportResponse}
          strings={strings}
        />
        <PageNumberPdf />
      </PDFPage>
    </Document>
  );
}
export default FinalReportPdfDocument;

import React from 'react';
import {
  Page as PDFPage,
  Document,
} from '@react-pdf/renderer';
import { listToMap } from '@togglecorp/fujs';

import {
    TYPE_ASSESSMENT,
    TYPE_IMMINENT
  } from '#views/DrefApplicationForm/common';
import {
  NumericKeyValuePair,
  StringKeyValuePair,
  Strings,
} from '#types';
import pdfStyles from '#utils/pdf/pdfStyles';
import { DrefFinalReportApiFields } from '#views/FinalReportForm/common';
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
  const isImminentDref = finalReportResponse?.type_of_dref === TYPE_IMMINENT;
  const isAssessmentDref = finalReportResponse?.type_of_dref === TYPE_ASSESSMENT;
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
        <EssentialInformationOutput
          data={finalReportResponse}
          strings={strings}
          affectedAreas={affectedAreas}
          isImminentDref={isImminentDref}
        />
        <EventDescriptionOutput
          data={finalReportResponse}
          strings={strings}
          isImminentDref={isImminentDref}
          isAssessmentDref={isAssessmentDref}
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
        {!isAssessmentDref &&
          <NeedIdentifiedOutput
            data={finalReportResponse}
            niMap={niMap}
            isImminentDref={isImminentDref}
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
          isAssessmentDref={isAssessmentDref}
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

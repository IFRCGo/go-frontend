import React from 'react';
import {
  Page as PDFPage,
  Document,
} from '@react-pdf/renderer';
import { listToMap } from '@togglecorp/fujs';
import { TYPE_ASSESSMENT } from '#views/DrefApplicationForm/common';
import { DrefOperationalUpdateApiFields } from '#views/DrefOperationalUpdateForm/common';
import {
  NumericKeyValuePair,
  StringKeyValuePair,
  Strings,
} from '#types';

import PageNumberPdf from '#components/DrefPdfDocument/PageNumberPdf';
import HeadingOutput from './HeadingOutput';
import EssentialInformationOutput from './EssentialInformationOutput';
import EventDescriptionOutput from './EventDescriptionOutput';
import SummaryOfChangeOutput from './SummaryOfChangeOutput';
import NationalSocietyOutput from './NationalSocietyOutput';
import MovementPartnerOutput from './MovementPartnerOutput';
import OtherActionsOutput from './OtherActionsOutput';
import NeedIdentifiedOutput from './NeedIdentifiedOutput';
import ObjectiveAndStrategy from './ObjectivesAndStrategy';
import TargetedPopulationOutput from './TargetedPopulationOutput';
import RiskAndSecurityOutput from './RiskAndSecurityOutput';
import PlannedInterventionOutput from './PlannedInterventionOutput';
import AboutServicesOutput from './AboutServicesOutput';
import BudgetFileOutput from './BudgetFileOutput';
import ContactInformationOutput from './ContactInformationOutput';

import pdfStyles from '#utils/pdf/pdfStyles';

interface DrefOptions {
  disaster_category: NumericKeyValuePair[];
  national_society_actions: StringKeyValuePair[];
  needs_identified: StringKeyValuePair[];
  planned_interventions: StringKeyValuePair[];
  status: NumericKeyValuePair[];
  users: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
  }[];
}

interface Props {
  operationalUpdateResponse: DrefOperationalUpdateApiFields;
  drefOptions: DrefOptions;
  strings: Strings;
}

function OperationalUpdatePdfDocument(props: Props) {
  const {
    operationalUpdateResponse,
    drefOptions,
    strings,
  } = props;

  const piMap = listToMap(drefOptions.planned_interventions, d => d.key, d => d.value);
  const niMap = listToMap(drefOptions.needs_identified, d => d.key, d => d.value);
  const affectedAreas = operationalUpdateResponse?.district_details?.map(d => d.name).join(', ');
  const documentTitle = operationalUpdateResponse?.title;
  const drefType = operationalUpdateResponse.type_of_dref;

  return (
    <Document
      title={documentTitle}
      author={strings.drefExportIfrcName}
      creator={strings.drefExportIfrcName}
      producer={strings.drefExportIfrcName}
      keywords="operationalUpdateResponse"
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
          data={operationalUpdateResponse}
          strings={strings}
          affectedAreas={affectedAreas}
          drefType={drefType}
        />

        <EventDescriptionOutput
          data={operationalUpdateResponse}
          strings={strings}
          drefType={drefType}
        />

        {drefType !== TYPE_ASSESSMENT &&
          <SummaryOfChangeOutput
            data={operationalUpdateResponse}
            strings={strings}
          />
        }

        <NationalSocietyOutput
          data={operationalUpdateResponse}
          strings={strings}
        />

        <MovementPartnerOutput
          data={operationalUpdateResponse}
          strings={strings}
        />

        <OtherActionsOutput
          data={operationalUpdateResponse}
          strings={strings}
        />

        {drefType !== TYPE_ASSESSMENT &&
          <NeedIdentifiedOutput
            data={operationalUpdateResponse}
            niMap={niMap}
            strings={strings}
          />
        }

        <ObjectiveAndStrategy
          data={operationalUpdateResponse}
          strings={strings}
        />

        <TargetedPopulationOutput
          data={operationalUpdateResponse}
          strings={strings}
          drefType={drefType}
        />

        <RiskAndSecurityOutput
          data={operationalUpdateResponse}
          strings={strings}
        />

        <PlannedInterventionOutput
          strings={strings}
          data={operationalUpdateResponse}
          piMap={piMap}
        />

        <AboutServicesOutput
          strings={strings}
          data={operationalUpdateResponse}
          drefType={drefType}
        />

        <BudgetFileOutput
          strings={strings}
          data={operationalUpdateResponse}
        />

        <ContactInformationOutput
          data={operationalUpdateResponse}
          strings={strings}
        />
        <PageNumberPdf />
      </PDFPage>
    </Document>
  );
}
export default OperationalUpdatePdfDocument;

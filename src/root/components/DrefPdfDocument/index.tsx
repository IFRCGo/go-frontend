import React, { useMemo } from 'react';
import {
  Page as PDFPage,
  Text,
  View,
  Document,
  Image,
} from '@react-pdf/renderer';
import {
  listToMap,
} from '@togglecorp/fujs';

import {
  DrefApiFields,
  ONSET_IMMINENT,
} from '#views/DrefApplicationForm/common';
import {
  NumericKeyValuePair,
  StringKeyValuePair,
  Strings,
} from '#types';

import TargetedPopulationOutput from './TargetedPopulationOutput';
import EssentialInformationOutput from './EssentialInformationOutput';
import EventDescriptionOutput from './EventDescriptionOutput';
import PreviousOperationOutput from './PreviousOperationOutput';
import NationalSocietyOutput from './NationalSocietyOutput';
import MovementPartnerOutput from './MovementPartnerOutput';
import OtherActionsOutput from './OtherActionsOutput';
import NeedIdentifiedOutput from './NeedIdentifiedOutput';
import ObjectiveAndStrategy from './ObjectivesAndStrategy';
import PlannedInterventionOutput from './PlannedInterventionOutput';
import AboutServicesOutput from './AboutServicesOutput';
import ContactInformationOutput from './ContactInformationOutput';
import RiskAndSecurityOutput from './RiskAndSecurityOutput';
import HeadingOutput from './HeadingOutput';

import pdfStyles from '#utils/pdf/pdfStyles';

interface DrefOptions {
  disaster_category: NumericKeyValuePair[];
  national_society_actions: StringKeyValuePair[];
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
  dref: DrefApiFields;
  drefOptions: DrefOptions;
  strings: Strings;
}

function DrefPdfDocument(props: Props) {
  const {
    dref,
    drefOptions,
    strings,
  } = props;

  const piMap = useMemo(() =>
    listToMap(drefOptions.planned_interventions, d => d.key, d => d.value)
    , [drefOptions.planned_interventions]);

  const niMap = useMemo(() =>
    listToMap(drefOptions.needs_identified, d => d.key, d => d.value)
    , [drefOptions.needs_identified]);

  const affectedAreas = useMemo(() => {
    let areas = '';
    const districts = dref.district_details?.map(d => d.name);
    return areas += districts.join(', ');
  }, [dref.district_details]);


  const isImminentOnset = dref?.disaster_type === ONSET_IMMINENT;
  const documentTitle = useMemo(() => (
    `${dref.title_prefix} | ${dref?.title}`
  ), [
    dref.title_prefix,
    dref.title,
  ]);

  return (
    <Document
      title={documentTitle}
      author={strings.drefExportIfrcName}
      creator={strings.drefExportIfrcName}
      producer={strings.drefExportIfrcName}
      keywords="dref"
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
          data={dref}
          affectedAreas={affectedAreas}
          strings={strings}
        />
        <EventDescriptionOutput
          data={dref}
          strings={strings}
          isImminentOnset={isImminentOnset}
        />
        <PreviousOperationOutput
          data={dref}
          strings={strings}
        />
        <NationalSocietyOutput
          data={dref}
          strings={strings}
        />
        <MovementPartnerOutput
          data={dref}
          strings={strings}
        />
        <OtherActionsOutput
          data={dref}
          strings={strings}
        />
        <NeedIdentifiedOutput
          data={dref}
          niMap={niMap}
          isImminentOnset={isImminentOnset}
          strings={strings}
        />
        <ObjectiveAndStrategy
          data={dref}
          strings={strings}
        />
        <TargetedPopulationOutput
          data={dref}
          strings={strings}
        />
        <RiskAndSecurityOutput
          data={dref}
          strings={strings}
        />
        <PlannedInterventionOutput
          strings={strings}
          data={dref}
          piMap={piMap}
        />
        <AboutServicesOutput
          strings={strings}
          data={dref}
        />
        {dref?.budget_file && (
          <View>
            <Text style={pdfStyles.sectionHeading}>
              {strings.drefExportBudgetOverview}
            </Text>
            <Image
              style={pdfStyles.mapImage}
              src={dref.budget_file_preview}
            />
          </View>
        )}

        <ContactInformationOutput
          data={dref}
          strings={strings}
        />
      </PDFPage>
    </Document>
  );
}
export default DrefPdfDocument;

import React, { useMemo, } from 'react';
import {
  Page as PDFPage,
  Text,
  Link,
  View,
  Document,
  Image as PDFImage,
  Font,
} from '@react-pdf/renderer';
import { listToMap } from '@togglecorp/fujs';

import {
  formatBoolean,
  formatNumber,
} from '#utils/common';
import {
  ONSET_IMMINENT,
} from '#views/DrefApplicationForm/common';
import {
  NumericKeyValuePair,
  StringKeyValuePair,
  Strings,
} from '#types';
import { resolveUrl } from '#utils/resolveUrl';
import { DrefFinalReportApiFields } from '#views/FinalReportForm/common';
import { PdfTextOutput } from '#components/PdfTextOutput';

import montserratFont from './resources/montserrat.bold.ttf';
import opensansFont from './resources/open-sans.regular.ttf';
import opensansBoldFont from './resources/open-sans.bold.ttf';
import pdfStyles from 'src/styles/pdf/pdfStyles';

Font.register({
  family: 'Montserrat',
  src: montserratFont,
  fontWeight: 'bold',
});

Font.register({
  family: 'OpenSans',
  src: opensansFont,
  fontWeight: 'medium',
});

Font.register({
  family: 'OpenSans',
  src: opensansBoldFont,
  fontWeight: 'bold',
});

interface ContactionSectionProps {
  title: string;
  contacts: string[];
}

function ContactSection(props: ContactionSectionProps) {
  const {
    title,
    contacts,
  } = props;

  const outputString = contacts.filter(d => !!d).join(', ');

  if (!outputString) {
    return null;
  }

  return (
    <View style={pdfStyles.ciRow} wrap={false}>
      <Text style={pdfStyles.contactType}>
        {'\u2022'} {title}
      </Text>
      <Text style={pdfStyles.contactDetails}>
        {outputString}
      </Text>
    </View>
  );
}

interface NeedIdentifiedProps {
  data: DrefFinalReportApiFields['needs_identified'][number];
  niMap?: Record<string, string>;
}

function NeedIdentified(props: NeedIdentifiedProps) {
  const {
    data,
    niMap,
  } = props;

  return (
    <View style={pdfStyles.niOutput} wrap={false}>
      <View style={pdfStyles.niIconCell}>
        {data.image_url && (
          <PDFImage
            style={pdfStyles.niIcon}
            src={data.image_url}
          />
        )}
      </View>
      <View style={pdfStyles.niHeaderCell}>
        <Text>
          {niMap?.[data.title]}
        </Text>
      </View>
      <View style={pdfStyles.niContentCell}>
        <Text>
          {data.description}
        </Text>
      </View>
    </View>
  );
}

interface PlannedInterventionProps {
  data: DrefFinalReportApiFields['planned_interventions'][number];
  piMap?: Record<string, string>;
  strings: Strings;
}

function PlannedInterventionOutput(props: PlannedInterventionProps) {
  const {
    data,
    piMap,
    strings,
  } = props;

  return (
    <View style={pdfStyles.piOutput} wrap={false}>
      <View style={pdfStyles.piRow}>
        <View style={pdfStyles.piIconCell}>
          {data?.image_url && (
            <PDFImage
              style={pdfStyles.piIcon}
              src={data.image_url}
            />
          )}
        </View>
        <Text style={pdfStyles.piHeaderCell}>
          {piMap?.[data.title]}
        </Text>
        <View style={[pdfStyles.piContentCell, { flexDirection: 'column' }]}>
          <View style={pdfStyles.piSubRow}>
            <Text style={pdfStyles.piSubHeadingCell}>
              {strings.finalReportExportPersonReachedLabel}
            </Text>
            <Text style={pdfStyles.piSubHeadingCell}>
              {strings.finalReportIndicatorMaleLabel}
            </Text>
            <Text style={pdfStyles.piSubContentCell}>
              {data?.male}
            </Text>
          </View>
          <View style={pdfStyles.piSubRow}>
            <Text style={pdfStyles.piSubHeadingCell} />
            <Text style={pdfStyles.piSubHeadingCell}>
              {strings.finalReportIndicatorFemaleLabel}
            </Text>
            <Text style={pdfStyles.piSubContentCell}>
              {data?.female}
            </Text>
          </View>
        </View>
      </View>

      <View style={pdfStyles.piRow}>
        <View style={pdfStyles.piContentCell}>
          <Text style={[pdfStyles.piBorderCell, pdfStyles.fontWeightBoldAndLarge]}>
            {strings.finalReportExportIndicators}
          </Text>
        </View>
        <View style={pdfStyles.piHeaderCell}>
          <Text>
            {strings.finalReportIndicatorTargetLabel}
          </Text>
        </View>
        <View style={pdfStyles.piHeaderCell}>
          <Text>
            {strings.finalReportIndicatorActualLabel}
          </Text>
        </View>
      </View>

      {
        data?.indicators?.map((indicator) => (
          <View
            style={pdfStyles.piRow}
            key={indicator.id}
          >
            <View style={pdfStyles.piContentCell}>
              <Text style={pdfStyles.piBorderCell}>
                {indicator?.title}
              </Text>
            </View>
            <View style={[pdfStyles.piHeaderCell, pdfStyles.fontWeightNormalAndSmall]}>
              <Text style={pdfStyles.fontWeightNormalAndSmall}>
                {indicator?.target}
              </Text>
            </View>
            <View style={[pdfStyles.piHeaderCell, pdfStyles.fontWeightNormalAndSmall]}>
              <Text style={pdfStyles.fontWeightNormalAndSmall}>
                {indicator?.actual}
              </Text>
            </View>
          </View>
        ))
      }
      <View style={pdfStyles.piRow}>
        <Text style={[pdfStyles.piBorderCell, pdfStyles.fontWeightBoldAndLarge]}>
          {strings.finalReportPlannedInterventionNarrativeAchievement}
        </Text>
      </View>
      {data?.challenges && (
        <View style={pdfStyles.piRow}>
          <Text style={pdfStyles.piBorderCell}>
            {data?.narrative_description_of_achievements}
          </Text>
        </View>
      )}
      <View style={pdfStyles.piRow}>
        <Text style={[pdfStyles.piBorderCell, pdfStyles.fontWeightBoldAndLarge]}>
          {strings.finalReportPlannedInterventionChallenges}
        </Text>
      </View>
      {data?.challenges && (
        <View style={pdfStyles.piRow}>
          <Text style={pdfStyles.piBorderCell}>
            {data?.challenges}
          </Text>
        </View>
      )}
      <View style={pdfStyles.piRow}>
        <Text style={[pdfStyles.piBorderCell, pdfStyles.fontWeightBoldAndLarge]}>
          {strings.finalReportPlannedInterventionLessonsLearnt}
        </Text>
      </View>
      {data?.lessons_learnt && (
        <View style={pdfStyles.piRow}>
          <Text style={pdfStyles.piBorderCell}>
            {data?.lessons_learnt}
          </Text>
        </View>
      )}
    </View>
  );
}

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

const logoUrl = '/assets/graphics/layout/go-logo-2020.png';

function FinalReportPdfDocument(props: Props) {
  const {
    finalReportResponse,
    drefOptions,
    strings,
  } = props;

  const niMap = useMemo(() => (
    listToMap(
      drefOptions?.planned_interventions,
      intervention => intervention.key,
      intervention => intervention.value,
    )
  ), [drefOptions]);

  const piMap = useMemo(() => (
    listToMap(
      drefOptions?.needs_identified,
      need => need.key,
      need => need.value,
    )
  ), [drefOptions]);

  const affectedAreas = useMemo(() => {
    const districts = finalReportResponse?.country_district.map(d => d['district_details']);
    const areas = districts.map(districtsList => {
      return districtsList.map((districtItem) => districtItem.name).join(', ');
    }).join(', ');

    return areas;
  }, [finalReportResponse]);

  const isImminentOnset = finalReportResponse?.disaster_type === ONSET_IMMINENT;
  const documentTitle = [
    finalReportResponse?.country_district.map(d => d.country_details?.name).join(', '),
    finalReportResponse?.title
  ].join(' | ');

  return (
    <Document
      title={documentTitle}
      author={strings.operationalUpdateExportIfrcName}
      creator={strings.operationalUpdateExportIfrcName}
      producer={strings.operationalUpdateExportIfrcName}
      keywords="finalReportResponse"
    >
      <PDFPage
        style={pdfStyles.portraitPage}
        size="A4"
      >
        <View style={pdfStyles.titleSection}>
          <View style={pdfStyles.logoAndTitle}>
            <PDFImage
              style={pdfStyles.titleIfrcLogo}
              src={logoUrl}
            />
            <Text style={pdfStyles.pageTitle}>
              {strings.finalReportTitle}
            </Text>
          </View>
          <Text style={pdfStyles.subTitle}>
            {[
              finalReportResponse?.country_district.map(d => d.country_details?.name).join(', '),
              finalReportResponse?.title
            ].filter(Boolean).join(' | ')}
          </Text>
        </View>
        <View style={pdfStyles.section}>
          <View style={pdfStyles.basicInfoTable}>
            <View style={pdfStyles.compactSection} wrap={false}>
              <PdfTextOutput
                label={strings.finalReportExportAppealNum}
                value={finalReportResponse.appeal_code}
              />
              <PdfTextOutput
                label={strings.finalReportExportTotalAllocation}
                value={formatNumber(finalReportResponse.total_dref_allocation, 'CHF ' ?? '-')}
                columns="2/3"
              />
            </View>
            <View style={pdfStyles.compactSection} wrap={false}>
              <PdfTextOutput
                label={strings.finalReportExportGlideNum}
                value={finalReportResponse.glide_code}
              />
              <View style={pdfStyles.twoByThree}>
                <View style={pdfStyles.compactSection}>
                  <View style={pdfStyles.compactSection}>
                    <PdfTextOutput
                      label={strings.finalReportExportPeopleAffected}
                      value={formatNumber(finalReportResponse.number_of_people_affected)}
                      columns="1/2"
                    />
                    <PdfTextOutput
                      label={strings.finalReportExportPeopleTargeted}
                      value={formatNumber(finalReportResponse.number_of_people_targeted)}
                      columns="1/2"
                    />
                  </View>
                </View>
                <View style={pdfStyles.compactSection}>
                  <View style={pdfStyles.compactSection}>
                    <PdfTextOutput
                      label={strings.finalReportExportDateOfPublication}
                      value={finalReportResponse.date_of_publication}
                      columns="1/2"
                    />
                    <View style={[pdfStyles.compactSection, pdfStyles.oneByTwo]}>
                      <PdfTextOutput
                        label={strings.finalReportExportStartOfOperation}
                        value={finalReportResponse.operation_start_date}
                        columns="1/2"
                      />
                      <PdfTextOutput
                        label={strings.finalReportExportTotalOperatingTimeFrame}
                        value={formatNumber(finalReportResponse.total_operation_timeframe)}
                        columns="1/2"
                      />
                    </View>
                  </View>
                </View>
                <View style={pdfStyles.compactSection}>
                  <PdfTextOutput
                    label={strings.finalReportExportAffectedArea}
                    value={affectedAreas}
                    columns="3/3"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefExportDescriptionOfTheEvent}
          </Text>
          {finalReportResponse.event_map_details &&
            <View style={pdfStyles.subSection}>
              <PDFImage
                style={pdfStyles.mapImage}
                src={finalReportResponse.event_map_details.file}
              />
            </View>
          }
          {finalReportResponse?.event_description && (
            <View style={pdfStyles.subSection}>
              <Text style={pdfStyles.subSectionHeading}>
                {isImminentOnset ?
                  strings.finalReportImminentDisaster
                  :
                  strings.finalReportWhatWhereWhen}
              </Text>
              <Text style={pdfStyles.text}>
                {finalReportResponse.event_description}
              </Text>
            </View>
          )}
          {finalReportResponse?.photos_details && (
            <View style={pdfStyles.subSection}>
              <Text style={pdfStyles.subSectionHeading}>
                {strings.finalReportPhotosOfImplementation}
              </Text>
              {finalReportResponse?.photos_details.map((el) => (
                <View style={pdfStyles.subSection}>
                  <PDFImage
                    style={pdfStyles.mapImage}
                    src={el.file}
                  />
                </View>
              ))}
            </View>
          )}
          {finalReportResponse?.event_scope && (
            <View style={pdfStyles.subSection}>
              <Text style={pdfStyles.subSectionHeading}>
                {strings.finalReportScopeAndScaleEvent}
              </Text>
              <Text style={pdfStyles.text}>
                {finalReportResponse.event_scope}
              </Text>
            </View>
          )}
        </View>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.finalReportFederationWideAndPartners}
          </Text>
          <View>
            <View style={pdfStyles.row} wrap={false}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.finalReportWantToReport}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{formatBoolean(finalReportResponse?.want_to_report)}</Text>
              </View>
            </View>
            <View style={pdfStyles.row} wrap={false}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.finalReportAdditionalNationalSocietyAction}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{finalReportResponse?.additional_national_society_actions}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.finalReportMovementPartners}
          </Text>
          <View>
            <View style={pdfStyles.row} wrap={false}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.finalReportIfrc}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{finalReportResponse.ifrc}</Text>
              </View>
            </View>
            <View style={pdfStyles.row} wrap={false}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.finalReportIcrc}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{finalReportResponse.icrc}</Text>
              </View>
            </View>
            <View style={pdfStyles.row} wrap={false}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.finalReportPartnerNationalSociety}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{finalReportResponse.partner_national_society}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.finalReportNationalOtherActors}
          </Text>
          <View>
            <View style={pdfStyles.row} wrap={false}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.finalReportInternationalAssistance}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{formatBoolean(finalReportResponse.government_requested_assistance)}</Text>
              </View>
            </View>
            <View style={pdfStyles.row} wrap={false}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.finalReportNationalAuthorities}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{finalReportResponse.national_authorities}</Text>
              </View>
            </View>
            <View style={pdfStyles.row} wrap={false}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.finalReportUNorOtherActors}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{finalReportResponse.un_or_other_actor}</Text>
              </View>
            </View>
            <View style={pdfStyles.row} wrap={false}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.finalReportCoordinationMechanism}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{finalReportResponse.major_coordination_mechanism}</Text>
              </View>
            </View>
          </View>
        </View>
        {finalReportResponse.needs_identified.length > 0 && (
          <View style={pdfStyles.niSection} wrap={false}>
            <Text style={pdfStyles.sectionHeading}>
              {isImminentOnset
                ? strings.finalReportImminentNeedsGapsIdentified
                : strings.finalReportNeedsIdentified}
            </Text>
            {finalReportResponse.needs_identified.map((ni) => (
              <NeedIdentified
                key={ni.id}
                data={ni}
                niMap={niMap}
              />
            ))}
          </View>
        )}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.finalReportTargetingStrategy}
          </Text>
          {finalReportResponse.people_assisted && (
            <View style={pdfStyles.qna}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.finalReportPeopleAssistedThroughOperation}
              </Text>
              <Text style={pdfStyles.answer}>
                {finalReportResponse.people_assisted}
              </Text>
            </View>
          )}
          {finalReportResponse.selection_criteria && (
            <View style={pdfStyles.qna}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.finalReportSelectionCriteria}
              </Text>
              <Text style={pdfStyles.answer}>
                {finalReportResponse.selection_criteria}
              </Text>
            </View>
          )}
          {finalReportResponse.entity_affected && (
            <View style={pdfStyles.qna}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.finalReportProtectionGenderAndInclusion}
              </Text>
              <Text style={pdfStyles.answer}>
                {finalReportResponse?.entity_affected}
              </Text>
            </View>
          )}
          <View style={pdfStyles.section}>
            <View style={pdfStyles.row} wrap={false}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.finalReportChangeToOperationStrategy}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{formatBoolean(finalReportResponse?.change_in_operational_strategy)}</Text>
              </View>
            </View>
            <View style={pdfStyles.row} wrap={false}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.finalReportChangeToOperationStrategy}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{finalReportResponse?.change_in_operational_strategy_text}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={pdfStyles.tpSection}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.finalReportPeopleAssistedThroughOperation}
          </Text>
          <View style={pdfStyles.row} wrap={false}>
            <View style={pdfStyles.tpHeaderCell}>
              <Text>{strings.finalReportTargetedPopulation}</Text>
            </View>
            <View style={pdfStyles.tpContentCell}>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.drefExportWomen}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(finalReportResponse?.women)}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.finalReportMen}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(finalReportResponse?.men)}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.finalReportGirls}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(finalReportResponse?.girls)}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.finalReportBoys}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(finalReportResponse?.boys)}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.finalReportExportTotalPopulation}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(finalReportResponse?.people_targeted_with_early_actions)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={pdfStyles.row} wrap={false}>
            <View style={pdfStyles.tpHeaderCell}>
              <Text>{strings.finalReportEstimateResponse}</Text>
            </View>
            <View style={pdfStyles.tpContentCell}>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>
                    {strings.finalReportEstimatePeopleDisability}
                  </Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {finalReportResponse?.disability_people_per}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.finalReportEstimatedPercentage}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {[
                      finalReportResponse?.people_per_urban,
                      finalReportResponse?.people_per_local,
                    ].filter(Boolean).join('/')}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.finalReportEstimatedDisplacedPeople}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(finalReportResponse?.displaced_people)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        {finalReportResponse?.operation_objective && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionHeading}>
              {strings.finalReportObjectiveOperation}
            </Text>
            <Text>{finalReportResponse.operation_objective}</Text>
          </View>
        )}
        {finalReportResponse?.response_strategy && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionHeading}>
              {strings.finalReportResponseStrategyImplementation}
            </Text>
            <Text>{finalReportResponse.response_strategy}</Text>
          </View>
        )}
        {finalReportResponse?.planned_interventions.length > 0 && (
          <View style={pdfStyles.piSection}>
            <Text style={pdfStyles.sectionHeading}>
              {strings.finalReportImplementation}
            </Text>
            {finalReportResponse?.planned_interventions.map((pi) => (
              <PlannedInterventionOutput
                strings={strings}
                key={pi.id}
                data={pi}
                piMap={piMap}
              />
            ))}
          </View>
        )}
        {finalReportResponse?.budget_file && (
          <View>
            <Text style={pdfStyles.sectionHeading}>
              {strings.finalReportBudgetOverview}
            </Text>
            <View style={pdfStyles.subSection}>
              <Link src={resolveUrl(window.location.origin, finalReportResponse?.budget_file_details?.file)}>
                {finalReportResponse?.budget_file_details?.file}
              </Link>
            </View>
          </View>
        )}
        <View style={pdfStyles.contactSection}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.FinalReportExportContactInformation}
          </Text>
          <Text style={pdfStyles.description}>
            {strings.finalReportExportContactDescription}
          </Text>
          <View style={pdfStyles.contactList}>
            <ContactSection
              title={strings.finalReportExportNationalSocietyContact}
              contacts={[
                finalReportResponse.national_society_contact_name,
                finalReportResponse.national_society_contact_title,
                finalReportResponse.national_society_contact_email,
                finalReportResponse.national_society_contact_phone_number,
              ]}
            />
            <ContactSection
              title={strings.finalReportExportAppealManager}
              contacts={[
                finalReportResponse.ifrc_appeal_manager_name,
                finalReportResponse.ifrc_appeal_manager_title,
                finalReportResponse.ifrc_appeal_manager_email,
                finalReportResponse.ifrc_appeal_manager_phone_number,
              ]}
            />
            <ContactSection
              title={strings.finalReportExportProjectManager}
              contacts={[
                finalReportResponse.ifrc_project_manager_name,
                finalReportResponse.ifrc_project_manager_title,
                finalReportResponse.ifrc_project_manager_email,
                finalReportResponse.ifrc_project_manager_phone_number,
              ]}
            />
            <ContactSection
              title={strings.finalReportExportIfrcEmergency}
              contacts={[
                finalReportResponse.ifrc_emergency_name,
                finalReportResponse.ifrc_emergency_title,
                finalReportResponse.ifrc_emergency_email,
                finalReportResponse.ifrc_emergency_phone_number,
              ]}
            />
            <ContactSection
              title={strings.finalReportExportMediaContact}
              contacts={[
                finalReportResponse.media_contact_name,
                finalReportResponse.media_contact_title,
                finalReportResponse.media_contact_email,
                finalReportResponse.media_contact_phone_number,
              ]}
            />
          </View>
        </View>
        <View style={pdfStyles.section}>
          <Link src={resolveUrl(window.location.origin, 'emergencies')}>
            {strings.drefExportReference}
          </Link>
        </View>
      </PDFPage>
    </Document>
  );
}
export default FinalReportPdfDocument;

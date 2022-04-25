import React from 'react';
import {
  Page as PDFPage,
  Text,
  Link,
  View,
  Document,
  Image as PDFImage,
  Font,
} from '@react-pdf/renderer';
import {
  addSeparator,
  listToMap,
} from '@togglecorp/fujs';

import { isValidNumber } from '#utils/common';
import {
  ONSET_IMMINENT,
} from '#views/DrefApplicationForm/common';
import { DrefOperationalUpdateApiFields } from '#views/DrefOperationalUpdateForm/common';
import {
  NumericKeyValuePair,
  StringKeyValuePair,
  Strings,
} from '#types';

import montserratFont from './resources/montserrat.bold.ttf';
import opensansFont from './resources/open-sans.regular.ttf';
import opensansBoldFont from './resources/open-sans.bold.ttf';
import pdfStyles from './pdfStyles';
import { resolveUrl } from '#utils/resolveUrl';

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

interface NationalSocietyActionsProps {
  data: DrefOperationalUpdateApiFields['national_society_actions'][number];
  nsaMap?: Record<string, string>;
}

function NationalSocietyActions(props: NationalSocietyActionsProps) {
  const {
    data,
    nsaMap = {},
  } = props;

  return (
    <Text style={pdfStyles.nsaOutput}>
      {'\u2022'} {nsaMap[data.title]}
    </Text>
  );
}

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
    <View style={pdfStyles.ciRow}>
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
  data: DrefOperationalUpdateApiFields['needs_identified'][number];
  niMap?: Record<string, string>;
}

function NeedIdentified(props: NeedIdentifiedProps) {
  const {
    data,
    niMap = {},
  } = props;

  return (
    <View style={pdfStyles.niOutput}>
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
          {niMap[data.title]}
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
  data: DrefOperationalUpdateApiFields['planned_interventions'][number];
  piMap?: Record<string, string>;
  strings: Strings;
}

function PlannedInterventionOutput(props: PlannedInterventionProps) {
  const {
    data,
    piMap = {},
    strings,
  } = props;

  return (
    <View style={pdfStyles.piOutput}>
      <View style={pdfStyles.piRow}>
        <View style={pdfStyles.piIconCell}>
          {data.image_url && (
            <PDFImage
              style={pdfStyles.piIcon}
              src={data.image_url}
            />
          )}
        </View>
        <Text style={pdfStyles.piHeaderCell}>
          {piMap[data.title]}
        </Text>
        <View style={[pdfStyles.piContentCell, { flexDirection: 'column' }]}>
          <View style={pdfStyles.piSubRow}>
            <Text style={pdfStyles.piSubHeadingCell}>
              {strings.drefExportBudget}
            </Text>
            <Text style={pdfStyles.piSubContentCell}>
              {formatNumber(data.budget, 'CHF ')}
            </Text>
          </View>
          <View style={pdfStyles.piSubRow}>
            <Text style={pdfStyles.piSubHeadingCell}>
              {strings.drefExportTargetPersons}
            </Text>
            <Text style={pdfStyles.piSubContentCell}>
              {data.person_targeted}
            </Text>
          </View>
        </View>
      </View>
      <View style={pdfStyles.piRow}>
        <View style={pdfStyles.piIconCell} />
        <View style={pdfStyles.piHeaderCell}>
          <Text>
            {strings.drefExportIndicators}
          </Text>
        </View>
        <View style={pdfStyles.piContentCell}>
          <Text style={pdfStyles.piBorderCell}>
            {data.indicator}
          </Text>
        </View>
      </View>
      <View style={pdfStyles.piRow}>
        <View style={pdfStyles.piIconCell} />
        <View style={pdfStyles.piHeaderCell}>
          <Text>
            {strings.drefExportPriorityActions}
          </Text>
        </View>
        <View style={pdfStyles.piContentCell}>
          <Text style={pdfStyles.piBorderCell}>
            {data.description}
          </Text>
        </View>
      </View>
    </View>
  );
}

function formatBoolean(value: boolean | undefined | null) {
  if (value === true) {
    return 'Yes';
  }

  if (value === false) {
    return 'No';
  }

  return '-';
}

function formatNumber(value: number | undefined | null, prefix?: string): string {
  const defaultValue = '-';

  if (isValidNumber(value)) {
    const formattedNumber = addSeparator(value) ?? defaultValue;

    if (prefix) {
      return `${prefix}${formattedNumber}`;
    }

    return formattedNumber;
  }

  return defaultValue;
}

function TextOutput(props: {
  label: string;
  value?: string;
  columns?: '1/3' | '2/3' | '3/3' | '1/2';
}) {
  const {
    label,
    value,
    columns = '1/3',
  } = props;

  const styleMap = {
    '1/3': pdfStyles.oneByThree,
    '2/3': pdfStyles.twoByThree,
    '3/3': pdfStyles.threeByThree,
    '1/2': pdfStyles.oneByTwo,
  };

  return (
    <View
      style={[
        pdfStyles.textOutput,
        styleMap[columns] ?? pdfStyles.oneByThree,
      ]}
    >
      <Text style={pdfStyles.textOutputLabel}>
        {label}
      </Text>
      <Text style={pdfStyles.textOutputValue}>
        {value}
      </Text>
    </View>
  );
}

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
  operationalUpdateResponse: DrefOperationalUpdateApiFields;
  drefOptions: DrefOptions;
  // onLoad?: (params: { blob?: Blob }) => void;
  strings: Strings;
}

const logoUrl = '/assets/graphics/layout/go-logo-2020.png';

function OperationalUpdatePdfDocument(props: Props) {
  const {
    operationalUpdateResponse,
    drefOptions,
    strings,
  } = props;

  const getMaps = () => {
    if (!drefOptions) {
      return [
        {},
        {},
        {},
      ];
    }

    return [
      listToMap(drefOptions.planned_interventions, d => d.key, d => d.value),
      listToMap(drefOptions.needs_identified, d => d.key, d => d.value),
      listToMap(drefOptions.national_society_actions, d => d.key, d => d.value),
    ];
  };
  const [
    piMap,
    niMap,
    nsaMap,
  ] = getMaps();

  const getAffectedAreas = () => {
    if (operationalUpdateResponse?.country_district) {
      let areas = '';
      const districts = operationalUpdateResponse.country_district.map(d => d.district_details);

      districts.forEach(d => {
        const names = d.map(dd => dd.name);
        areas += names.join(', ');
      });

      return areas;
    }
    return undefined;

  };

  const affectedAreas = getAffectedAreas();

  const isImminentOnset = operationalUpdateResponse?.disaster_type === ONSET_IMMINENT;
  const documentTitle = [
    operationalUpdateResponse?.country_district.map(d => d.country_details?.name).join(', '),
    operationalUpdateResponse?.title
  ].join(' | ');

  return (
    <Document
      title={documentTitle}
      author={strings.operationalUpdateExportIfrcName}
      creator={strings.operationalUpdateExportIfrcName}
      producer={strings.operationalUpdateExportIfrcName}
      keywords="operationalUpdateResponse"
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
              {strings.operationalUpdateExportTitle}
            </Text>
          </View>
          <Text style={pdfStyles.subTitle}>
            {[
              operationalUpdateResponse?.country_district.map(d => d.country_details?.name).join(', '),
              operationalUpdateResponse?.title
            ].filter(Boolean).join(' | ')}
          </Text>
        </View>
        {(operationalUpdateResponse?.images_details?.map((el) => (
          <View
            key={el?.id}
            style={pdfStyles.section}
          >
            <PDFImage
              style={pdfStyles.bannerImage}
              src={el?.file}
            />
          </View>
        )))
        }
        <View style={pdfStyles.section}>
          <View style={pdfStyles.basicInfoTable}>
            <View style={pdfStyles.compactSection}>
              <TextOutput
                label={strings.drefExportAppealNum}
                value={operationalUpdateResponse.appeal_code}
              />
              <TextOutput
                label={strings.drefOperationalUpdateTotalAllocation}
                value={formatNumber(operationalUpdateResponse.total_dref_allocation, 'CHF ' ?? '-')}
                columns="2/3"
              />
            </View>
            <View style={pdfStyles.compactSection}>
              <TextOutput
                label={strings.drefExportGlideNum}
                value={operationalUpdateResponse.glide_code}
              />
              <View style={pdfStyles.twoByThree}>
                <View style={pdfStyles.compactSection}>
                  <View style={pdfStyles.compactSection}>
                    <TextOutput
                      label={strings.operationalUpdateExportPeopleAffected}
                      value={formatNumber(operationalUpdateResponse.number_of_people_affected)}
                      columns="1/2"
                    />
                    <TextOutput
                      label={strings.operationalUpdateExportPeopleTargeted}
                      value={formatNumber(operationalUpdateResponse.number_of_people_targeted)}
                      columns="1/2"
                    />
                  </View>
                </View>
                <View style={pdfStyles.compactSection}>
                  <View style={pdfStyles.compactSection}>
                    <TextOutput
                      label={strings.drefExportDrefLaunched}
                      value={operationalUpdateResponse.date_of_approval}
                      columns="1/2"
                    />
                    <View style={[pdfStyles.compactSection, pdfStyles.oneByTwo]}>
                      <TextOutput
                        label={strings.operationalUpdateExportNewOperationalEndDate}
                        value={operationalUpdateResponse.new_operational_end_date}
                        columns="1/2"
                      />
                      <TextOutput
                        label={strings.drefOperationalUpdateTimeFrameTotalOperatingTimeFrame}
                        value={formatNumber(operationalUpdateResponse.total_operation_timeframe)}
                        columns="1/2"
                      />
                    </View>
                  </View>
                </View>
                <View style={pdfStyles.compactSection}>
                  <TextOutput
                    label={strings.drefExportAffectedAreas}
                    value={affectedAreas}
                    columns="3/3"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        <Text style={pdfStyles.sectionHeading}>
          {strings.drefExportDescriptionOfTheEvent}
        </Text>
        <View style={pdfStyles.subSection}>
          <Text style={pdfStyles.subSectionHeading}>
            {strings.drefOperationalUpdateDescriptionOfEventLabel}
          </Text>
          <Text style={pdfStyles.text}>
            {operationalUpdateResponse.change_since_request}
          </Text>
        </View>
        <View style={pdfStyles.poSection}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefOperationalUpdateSummaryChangeHeading}
          </Text>
          <View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.cellTitle}>
                {strings.drefOperationalUpdateSummaryAreYouChangingTimeFrame}
              </Text>
              <Text style={pdfStyles.strongCell}>
                {formatBoolean(operationalUpdateResponse.changing_timeframe_operation)}
              </Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.cellTitle}>
                {strings.drefOperationalUpdateSummaryAreYouChangingStrategy}
              </Text>
              <Text style={pdfStyles.strongCell}>
                {formatBoolean(operationalUpdateResponse.changing_operation_strategy)}
              </Text>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.cellTitle}>
                <Text>{strings.drefOperationalUpdateSummaryAreYouChangingTargetPopulation}</Text>
              </View>
              <View style={pdfStyles.strongCell}>
                <Text>{formatBoolean(operationalUpdateResponse.changing_target_population_of_operation)}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.cellTitle}>
                <Text>{strings.drefOperationalUpdateSummaryAreYouChangingGeographicalLocation}</Text>
              </View>
              <View style={pdfStyles.strongCell}>
                <Text>{formatBoolean(operationalUpdateResponse.changing_geographic_location)}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.cellTitle}>
                <Text>{strings.drefOperationalUpdateSummaryAreYouChangingBudget}</Text>
              </View>
              <View style={pdfStyles.strongCell}>
                <Text>{formatBoolean(operationalUpdateResponse.changing_budget)}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.cellTitle}>
                <Text> {strings.drefOperationalUpdateSummaryRequestForSecondAllocation}</Text>
              </View>
              <View style={pdfStyles.strongCell}>
                <Text>{formatBoolean(operationalUpdateResponse.request_for_second_allocation)}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.cellTitle}>
                <Text>{strings.drefExportLessonsLearnedTitle}</Text>
                <Text style={pdfStyles.cellDescription}>
                  {strings.drefOperationalUpdateSummaryExplain}
                </Text>
              </View>
              <View style={pdfStyles.cell}>
                <Text>
                  {operationalUpdateResponse.summary_of_change}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {operationalUpdateResponse.national_society_actions.length > 0 && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionHeading}>
              {strings.drefExportCurrentNationalSocietyAction}
            </Text>
            {operationalUpdateResponse.national_society_actions.map((nsa) => (
              <NationalSocietyActions
                key={nsa.id}
                data={nsa}
                nsaMap={nsaMap} />
            ))}
          </View>
        )}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefExportMovementPartnersActions}
          </Text>
          <View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefExportIfrc}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{operationalUpdateResponse.ifrc}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefExportIcrc}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{operationalUpdateResponse.icrc}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefExportPartnerNationalSociety}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{operationalUpdateResponse.partner_national_society}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefExportNationalOtherActors}
          </Text>
          <View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefExportInternationalAssistance}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{formatBoolean(operationalUpdateResponse.government_requested_assistance)}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefExportNationalAuthorities}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{operationalUpdateResponse.national_authorities}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefExportUNorOtherActors}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{operationalUpdateResponse.un_or_other_actor}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefExportCoordinationMechanism}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{operationalUpdateResponse.major_coordination_mechanism}</Text>
              </View>
            </View>
          </View>
        </View>
        {operationalUpdateResponse.needs_identified.length > 0 && (
          <View style={pdfStyles.niSection}>
            <Text style={pdfStyles.sectionHeading}>
              {isImminentOnset
                ? strings.drefExportImminentNeedsGapsIdentified
                : strings.drefExportNeedsGapsIdentified}
            </Text>
            {operationalUpdateResponse.needs_identified.map((ni) => (
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
            {strings.drefExportTargetingStrategy}
          </Text>
          {operationalUpdateResponse.people_assisted && (
            <View style={pdfStyles.qna}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.drefExportPeopleAssistedthroughOperation}
              </Text>
              <Text style={pdfStyles.answer}>
                {operationalUpdateResponse.people_assisted}
              </Text>
            </View>
          )}
          {operationalUpdateResponse.selection_criteria && (
            <View style={pdfStyles.qna}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.drefExportSelectionCriteriaRisk}
              </Text>
              <Text style={pdfStyles.answer}>
                {operationalUpdateResponse.selection_criteria}
              </Text>
            </View>
          )}
          {operationalUpdateResponse.entity_affected && (
            <View style={pdfStyles.qna}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.drefExportProtectionGenderAndInclusion}
              </Text>
              <Text style={pdfStyles.answer}>
                {operationalUpdateResponse?.entity_affected}
              </Text>
            </View>
          )}
        </View>
        <View style={pdfStyles.tpSection}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefExportAssistedPopulation}
          </Text>
          <View style={pdfStyles.row}>
            <View style={pdfStyles.tpHeaderCell}>
              <Text>{strings.drefExportTargetedPopulation}</Text>
            </View>
            <View style={pdfStyles.tpContentCell}>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.drefExportWomen}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(operationalUpdateResponse?.women)}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.drefExportMen}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(operationalUpdateResponse?.men)}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.drefExportGirls}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(operationalUpdateResponse?.girls)}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.drefExportBoys}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(operationalUpdateResponse?.boys)}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.drefExportTotal}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(operationalUpdateResponse?.people_targeted_with_early_actions)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={pdfStyles.row}>
            <View style={pdfStyles.tpHeaderCell}>
              <Text>{strings.drefExportEstimateResponse}</Text>
            </View>
            <View style={pdfStyles.tpContentCell}>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>
                    {strings.drefExportEstimatePeopleDisability}
                  </Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {operationalUpdateResponse?.disability_people_per}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.drefExportEstimatedPercentage}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {[
                      operationalUpdateResponse?.people_per_urban,
                      operationalUpdateResponse?.people_per_local,
                    ].filter(Boolean).join('/')}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.drefExportEstimatedDisplacedPeople}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(operationalUpdateResponse?.displaced_people)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefExportObjectiveOperation}
          </Text>
          <Text>{operationalUpdateResponse.operation_objective}</Text>
        </View>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefExportResponseRationale}
          </Text>
          <Text>{operationalUpdateResponse.response_strategy}</Text>
        </View>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefExportSupportServices}
          </Text>
        </View>
        {operationalUpdateResponse.planned_interventions.length > 0 && (
          <View style={pdfStyles.piSection}>
            <Text style={pdfStyles.sectionHeading}>
              {strings.drefExportPlannedIntervention}
            </Text>
            {operationalUpdateResponse.planned_interventions.map((pi) => (
              <PlannedInterventionOutput
                strings={strings}
                key={pi.id}
                data={pi}
                piMap={piMap}
              />
            ))}
          </View>
        )}
        <View style={pdfStyles.contactSection}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefExportContactInformation}
          </Text>
          <Text style={pdfStyles.description}>
            {strings.drefExportContactDescription}
          </Text>
          <View style={pdfStyles.contactList}>
            <ContactSection
              title={strings.drefExportNationalSocietyContact}
              contacts={[
                operationalUpdateResponse.national_society_contact_name,
                operationalUpdateResponse.national_society_contact_title,
                operationalUpdateResponse.national_society_contact_email,
                operationalUpdateResponse.national_society_contact_phone_number,
              ]}
            />
            <ContactSection
              title={strings.drefExportAppealManager}
              contacts={[
                operationalUpdateResponse.ifrc_appeal_manager_name,
                operationalUpdateResponse.ifrc_appeal_manager_title,
                operationalUpdateResponse.ifrc_appeal_manager_email,
                operationalUpdateResponse.ifrc_appeal_manager_phone_number,
              ]}
            />
            <ContactSection
              title={strings.drefExportProjectManager}
              contacts={[
                operationalUpdateResponse.ifrc_project_manager_name,
                operationalUpdateResponse.ifrc_project_manager_title,
                operationalUpdateResponse.ifrc_project_manager_email,
                operationalUpdateResponse.ifrc_project_manager_phone_number,
              ]}
            />
            <ContactSection
              title={strings.drefExportIfrcEmergency}
              contacts={[
                operationalUpdateResponse.ifrc_emergency_name,
                operationalUpdateResponse.ifrc_emergency_title,
                operationalUpdateResponse.ifrc_emergency_email,
                operationalUpdateResponse.ifrc_emergency_phone_number,
              ]}
            />
            <ContactSection
              title={strings.drefExportMediaContact}
              contacts={[
                operationalUpdateResponse.media_contact_name,
                operationalUpdateResponse.media_contact_title,
                operationalUpdateResponse.media_contact_email,
                operationalUpdateResponse.media_contact_phone_number,
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
    </Document >
  );
}
export default OperationalUpdatePdfDocument;

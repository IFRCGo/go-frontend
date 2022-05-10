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
  isDefined,
  addSeparator,
  listToMap,
} from '@togglecorp/fujs';

import { resolveToString } from '#utils/lang';
import { isValidNumber } from '#utils/common';
import {
  DrefApiFields,
  ONSET_IMMINENT,
} from '#views/DrefApplicationForm/common';

import montserratFont from './resources/montserrat.bold.ttf';
import opensansFont from './resources/open-sans.regular.ttf';
import opensansBoldFont from './resources/open-sans.bold.ttf';

import {
  NumericKeyValuePair,
  StringKeyValuePair,
  Strings,
} from '#types';

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
  data: DrefApiFields['national_society_actions'][number];
}

function NationalSocietyActions(props: NationalSocietyActionsProps) {
  const {
    data,
  } = props;
  return (
    <View>
      <View style={pdfStyles.row}>
        <View style={pdfStyles.niHeaderCell}>
          <Text>{data.title_display}</Text>
        </View>
        <View style={pdfStyles.niContentCell}>
          <Text>{data.description}</Text>
        </View>
      </View>
    </View>
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
  data: DrefApiFields['needs_identified'][number];
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
  data: DrefApiFields['planned_interventions'][number];
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
        {/*<View style={pdfStyles.piContentCell}>
          <Text style={pdfStyles.piBorderCell}>
            {data.indicators}
          </Text>
        </View>*/}
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
  dref: DrefApiFields;
  drefOptions: DrefOptions;
  // onLoad?: (params: { blob?: Blob }) => void;
  strings: Strings;
}

function DrefPdfDocument(props: Props) {
  const {
    dref,
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
  ] = getMaps();

  const getAffectedAreas = () => {
    if (dref?.country_district) {
      let areas = '';
      const districts = dref.country_district.map(d => d.district_details);

      districts.forEach(d => {
        const names = d.map(dd => dd.name);
        areas += names.join(', ');
      });

      return areas;
    }

    return undefined;
  };
  const affectedAreas = getAffectedAreas();

  const logoUrl = '/assets/graphics/layout/go-logo-2020.png';

  const isImminentOnset = dref?.disaster_type === ONSET_IMMINENT;
  const documentTitle = [
    dref?.country_district.map(d => d.country_details?.name).join(', '),
    dref?.title
  ].join(' | ');

  const ifrcName: string = "International Federation of Red Cross and Red Crescent Societies (IFRC)";

  return (
    <Document
      title={documentTitle}
      author={ifrcName}
      creator={ifrcName}
      producer={ifrcName}
      keywords="dref"
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
              {strings.drefExportTitle}
            </Text>
          </View>
          <Text style={pdfStyles.subTitle}>
            {[
              dref?.country_district.map(d => d.country_details?.name).join(', '),
              dref?.title
            ].filter(Boolean).join(' | ')}
          </Text>
        </View>
        {(dref.cover_image_details?.file) && (
          <View style={pdfStyles.section}>
            <PDFImage
              style={pdfStyles.bannerImage}
              src={dref.cover_image_details.file}
            />
          </View>
        )}
        <View style={pdfStyles.section}>
          <View style={pdfStyles.basicInfoTable}>
            <View style={pdfStyles.compactSection}>
              <TextOutput
                label={strings.drefExportAppealNum}
                value={dref.appeal_code}
              />
              <TextOutput
                label={strings.drefExportDrefAllocated}
                value={formatNumber(dref.amount_requested, 'CHF ')}
                columns="2/3"
              />
            </View>
            <View style={pdfStyles.compactSection}>
              <TextOutput
                label={strings.drefExportGlideNum}
                value={dref.glide_code}
              />
              <View style={pdfStyles.twoByThree}>
                <View style={pdfStyles.compactSection}>
                  <View style={pdfStyles.compactSection}>
                    <TextOutput
                      label={strings.drefExportPeopleAffected}
                      value={isDefined(dref.num_affected) ? resolveToString(strings.drefExportNumPeople, { num: formatNumber(dref.num_affected) }) : ''}
                      columns="1/2"
                    />
                    <TextOutput
                      label={strings.drefExportPeopleAssisted}
                      value={isDefined(dref.num_assisted) ? resolveToString(strings.drefExportNumPeople, { num: formatNumber(dref.num_assisted) }) : ''}
                      columns="1/2"
                    />
                  </View>
                </View>
                <View style={pdfStyles.compactSection}>
                  <View style={pdfStyles.compactSection}>
                    <TextOutput
                      label={strings.drefExportDrefLaunched}
                      value={dref.date_of_approval}
                      columns="1/2"
                    />
                    <View style={[pdfStyles.compactSection, pdfStyles.oneByTwo]}>
                      <TextOutput
                        label={strings.drefExportDrefEnds}
                        value={dref.end_date}
                        columns="1/2"
                      />
                      <TextOutput
                        label={strings.drefExportOperationTimeframe}
                        value={isDefined(dref.operation_timeframe) ? resolveToString(strings.drefExportNumMonth, { num: dref.operation_timeframe }) : ''}
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
      </PDFPage>
      <PDFPage style={pdfStyles.portraitPage} >
        <Text style={pdfStyles.sectionHeading}>
          {strings.drefExportDescriptionOfTheEvent}
        </Text>
        {dref.event_map_details?.file && (
          <View style={pdfStyles.subSection}>
            <PDFImage
              style={pdfStyles.mapImage}
              src={dref.event_map_details.file}
            />
          </View>
        )}
        <View style={pdfStyles.subSection}>
          <Text style={pdfStyles.subSectionHeading}>
            {isImminentOnset ? strings.drefExportImminentWhereWhenHow : strings.drefExportWhatWhereWhen}
          </Text>
          <Text style={pdfStyles.text}>
            {dref.event_description}
          </Text>
        </View>
        {dref.anticipatory_actions && (
          <View style={pdfStyles.subSection}>
            <Text style={pdfStyles.subSectionHeading}>
              {strings.drefExportTargetCommunities}
            </Text>
            <Text style={pdfStyles.text}>
              {dref.anticipatory_actions}
            </Text>
          </View>
        )}
        <View style={pdfStyles.subSection}>
          <Text style={pdfStyles.subSectionHeading}>
            {strings.drefExportScopeAndScale}
          </Text>
          <Text style={pdfStyles.text}>
            {dref.event_scope}
          </Text>
        </View>
      </PDFPage>
      <PDFPage style={pdfStyles.portraitPage}>
        <View style={pdfStyles.poSection}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefExportPreviousOperations}
          </Text>
          <View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.cellTitle}>
                {strings.drefExportAffectSameArea}
              </Text>
              <Text style={pdfStyles.strongCell}>
                {formatBoolean(dref.affect_same_area)}
              </Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.cellTitle}>
                {strings.drefExportAffectedthePopulationTitle}
              </Text>
              <Text style={pdfStyles.strongCell}>
                {formatBoolean(dref.affect_same_population)}
              </Text>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.cellTitle}>
                <Text>{strings.drefExportNsRespond}</Text>
              </View>
              <View style={pdfStyles.strongCell}>
                <Text>{formatBoolean(dref.ns_respond)}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.cellTitle}>
                <Text>{strings.drefExportNsRequest}</Text>
              </View>
              <View style={pdfStyles.strongCell}>
                <Text>{formatBoolean(dref.ns_request_fund)}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.cellTitle}>
                <Text>{strings.drefExportNsFundingDetail}</Text>
              </View>
              <View style={pdfStyles.strongCell}>
                <Text>{dref.ns_request_text ?? '-'}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.cellTitle}>
                <Text> {strings.drefExportRecurrentText}</Text>
              </View>
              <View style={pdfStyles.strongCell}>
                <Text>{dref.dref_recurrent_text}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.cellTitle}>
                <Text>{strings.drefExportLessonsLearnedTitle}</Text>
                <Text style={pdfStyles.cellDescription}>
                  {strings.drefExportLessonsLearnedDescription}
                </Text>
              </View>
              <View style={pdfStyles.cell}>
                <Text>
                  {dref.lessons_learned}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {dref.national_society_actions.length > 0 && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionHeading}>
              {strings.drefExportCurrentNationalSocietyAction}
            </Text>
            {dref.national_society_actions.map((nsa) => (
              <NationalSocietyActions
                key={nsa.id}
                data={nsa}
              />
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
                <Text>{dref.ifrc}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefExportIcrc}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{dref.icrc}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefExportPartnerNationalSociety}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{dref.partner_national_society}</Text>
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
                <Text>{formatBoolean(dref.government_requested_assistance)}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefExportNationalAuthorities}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{dref.national_authorities}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefExportUNorOtherActors}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{dref.un_or_other_actor}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefExportCoordinationMechanism}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{dref.major_coordination_mechanism}</Text>
              </View>
            </View>
          </View>
        </View>
        {dref.needs_identified.length > 0 && (
          <View style={pdfStyles.niSection}>
            <Text style={pdfStyles.sectionHeading}>
              {isImminentOnset
                ? strings.drefExportImminentNeedsGapsIdentified
                : strings.drefExportNeedsGapsIdentified}
            </Text>
            {dref.needs_identified.map((ni) => (
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
          {dref.people_assisted && (
            <View style={pdfStyles.qna}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.drefExportPeopleAssistedthroughOperation}
              </Text>
              <Text style={pdfStyles.answer}>
                {dref.people_assisted}
              </Text>
            </View>
          )}
          {dref.selection_criteria && (
            <View style={pdfStyles.qna}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.drefExportSelectionCriteriaRisk}
              </Text>
              <Text style={pdfStyles.answer}>
                {dref.selection_criteria}
              </Text>
            </View>
          )}
          {dref.entity_affected && (
            <View style={pdfStyles.qna}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.drefExportProtectionGenderAndInclusion}
              </Text>
              <Text style={pdfStyles.answer}>
                {dref?.entity_affected}
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
                    {formatNumber(dref?.women)}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.drefExportMen}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(dref?.men)}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.drefExportGirls}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(dref?.girls)}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.drefExportBoys}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(dref?.boys)}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.drefExportTotal}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(dref?.total_targeted_population)}
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
                    {dref?.disability_people_per}
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
                      dref?.people_per_urban,
                      dref?.people_per_local,
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
                    {formatNumber(dref?.displaced_people)}
                  </Text>
                </View>
              </View>
              {dref?.anticipatory_actions && (
                <View style={pdfStyles.tpSubRow}>
                  <View style={pdfStyles.tpSubCell}>
                    <Text>{strings.drefExportEarlyActionPeopleTargeted}</Text>
                  </View>
                  <View style={pdfStyles.tpSubCell}>
                    <Text style={pdfStyles.strong}>
                      {formatNumber(dref?.people_targeted_with_early_actions)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefExportObjectiveOperation}
          </Text>
          <Text>{dref.operation_objective}</Text>
        </View>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefExportResponseRationale}
          </Text>
          <Text>{dref.response_strategy}</Text>
        </View>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefExportSupportServices}
          </Text>
          {dref.human_resource && (
            <View style={pdfStyles.qna}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.drefExportHumanResourceDescription}
              </Text>
              <Text style={pdfStyles.answer}>
                {dref.human_resource}
              </Text>
            </View>
          )}
          {dref.surge_personnel_deployed && (
            <View style={pdfStyles.qna}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.drefExportSurgePersonnelDeployed}
              </Text>
              <Text style={pdfStyles.answer}>
                {dref.surge_personnel_deployed}
              </Text>
            </View>
          )}
          {dref.logistic_capacity_of_ns && (
            <View style={pdfStyles.qna}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.drefExportLogisticCapacityOfNs}
              </Text>
              <Text style={pdfStyles.answer}>
                {dref.logistic_capacity_of_ns}
              </Text>
            </View>
          )}
          {dref.safety_concerns && (
            <View style={pdfStyles.qna}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.drefExportSafetyConcerns}
              </Text>
              <Text style={pdfStyles.answer}>
                {dref.safety_concerns}
              </Text>
            </View>
          )}
          {dref.pmer && (
            <View style={pdfStyles.qna}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.drefExportPmerDescription}
              </Text>
              <Text style={pdfStyles.answer}>
                {dref.pmer}
              </Text>
            </View>
          )}
          {dref.communication && (
            <View style={pdfStyles.qna}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.drefExportCommunicationDescription}
              </Text>
              <Text style={pdfStyles.answer}>
                {dref.communication}
              </Text>
            </View>
          )}
        </View>
        {dref.planned_interventions.length > 0 && (
          <View style={pdfStyles.piSection}>
            <Text style={pdfStyles.sectionHeading}>
              {strings.drefExportPlannedIntervention}
            </Text>
            {dref.planned_interventions.map((pi) => (
              <PlannedInterventionOutput
                strings={strings}
                key={pi.id}
                data={pi}
                piMap={piMap}
              />
            ))}
          </View>
        )}
      </PDFPage>
      {dref.budget_file_preview && (
        <PDFPage style={pdfStyles.portraitPage}>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionHeading}>
              {strings.drefExportBudgetOverview}
            </Text>
            <PDFImage
              style={pdfStyles.budgetOverview}
              src={dref.budget_file_preview}
            />
          </View>
        </PDFPage>
      )}
      <PDFPage style={pdfStyles.portraitPage}>
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
                dref.national_society_contact_name,
                dref.national_society_contact_title,
                dref.national_society_contact_email,
                dref.national_society_contact_phone_number,
              ]}
            />
            <ContactSection
              title={strings.drefExportAppealManager}
              contacts={[
                dref.ifrc_appeal_manager_name,
                dref.ifrc_appeal_manager_title,
                dref.ifrc_appeal_manager_email,
                dref.ifrc_appeal_manager_phone_number,
              ]}
            />
            <ContactSection
              title={strings.drefExportProjectManager}
              contacts={[
                dref.ifrc_project_manager_name,
                dref.ifrc_project_manager_title,
                dref.ifrc_project_manager_email,
                dref.ifrc_project_manager_phone_number,
              ]}
            />
            <ContactSection
              title={strings.drefExportIfrcEmergency}
              contacts={[
                dref.ifrc_emergency_name,
                dref.ifrc_emergency_title,
                dref.ifrc_emergency_email,
                dref.ifrc_emergency_phone_number,
              ]}
            />
            <ContactSection
              title={strings.drefExportMediaContact}
              contacts={[
                dref.media_contact_name,
                dref.media_contact_title,
                dref.media_contact_email,
                dref.media_contact_phone_number,
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
export default DrefPdfDocument;

import React, { useMemo } from 'react';
import {
  Page as PDFPage,
  Text,
  Link,
  View,
  Document,
  Image as PDFImage,
  // Font,
} from '@react-pdf/renderer';
import {
  isDefined,
  listToMap,
} from '@togglecorp/fujs';

import { resolveUrl } from '#utils/resolveUrl';
import { resolveToString } from '#utils/lang';
import { PdfTextOutput } from '#components/PdfTextOutput';
import {
  formatBoolean,
  formatNumber,
} from '#utils/common';
import {
  DrefApiFields,
  ONSET_IMMINENT,
} from '#views/DrefApplicationForm/common';
import {
  NumericKeyValuePair,
  StringKeyValuePair,
  Strings,
} from '#types';

import pdfStyles from './pdfStyles';
import NeedIdentified from './NeedIdentified';
import ContactSection from './ContactSection';

interface NationalSocietyActionsProps {
  data: DrefApiFields['national_society_actions'][number];
}

function NationalSocietyActions(props: NationalSocietyActionsProps) {
  const {
    data,
  } = props;
  return (
    <View wrap={false}>
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

interface PlannedInterventionProps {
  data: DrefApiFields['planned_interventions'][number];
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
          {data.image_url && (
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
        <View style={pdfStyles.piContentCell}>
          <Text style={[pdfStyles.piBorderCell, pdfStyles.fontWeightBoldAndLarge]}>
            {strings.drefExportIndicators}
          </Text>
        </View>
        <View style={pdfStyles.piContentCell}>
          <Text style={[pdfStyles.piBorderCell, pdfStyles.fontWeightBoldAndLarge]}>
            {strings.drefFormIndicatorTargetLabel}
          </Text>
        </View>
      </View>
      {
        data?.indicators?.map((el) => (
          <View
            key={el?.id}
            style={pdfStyles.piRow}
          >
            <View style={pdfStyles.piContentCell}>
              <Text style={pdfStyles.piBorderCell}>
                {el.title}
              </Text>
            </View>
            <View style={pdfStyles.piContentCell}>
              <Text style={pdfStyles.piBorderCell}>
                {el.target}
              </Text>
            </View>
          </View>
        ))
      }
      <View style={pdfStyles.piRow}>
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

const logoUrl = '/assets/graphics/layout/go-logo-2020.png';

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
            {documentTitle}
          </Text>
        </View>
        {(dref.cover_image_file?.file) && (
          <View style={pdfStyles.section}>
            <PDFImage
              style={pdfStyles.bannerImage}
              src={dref.cover_image_file.file}
            />
          </View>
        )}
        <View style={pdfStyles.section}>
          <View style={pdfStyles.basicInfoTable}>
            <View style={pdfStyles.compactSection} wrap={false}>
              <PdfTextOutput
                label={strings.drefExportAppealNum}
                value={dref.appeal_code}
              />
              <PdfTextOutput
                label={strings.drefExportDrefAllocated}
                value={formatNumber(dref.amount_requested, 'CHF ')}
                columns="2/3"
              />
            </View>
            <View style={pdfStyles.compactSection} wrap={false}>
              <PdfTextOutput
                label={strings.drefExportGlideNum}
                value={dref.glide_code}
              />
              <View style={pdfStyles.twoByThree}>
                <View style={pdfStyles.compactSection}>
                  <View style={pdfStyles.compactSection}>
                    <PdfTextOutput
                      label={strings.drefExportPeopleAffected}
                      value={
                        isDefined(dref.num_affected) ?
                          resolveToString(strings.drefExportNumPeople, { num: formatNumber(dref.num_affected) })
                          : ''
                      }
                      columns="1/2"
                    />
                    <PdfTextOutput
                      label={strings.drefExportPeopleAssisted}
                      value={
                        isDefined(dref.num_assisted) ?
                          resolveToString(strings.drefExportNumPeople, { num: formatNumber(dref.num_assisted) })
                          : ''
                      }
                      columns="1/2"
                    />
                  </View>
                </View>
                <View style={pdfStyles.compactSection}>
                  <View style={pdfStyles.compactSection}>
                    <PdfTextOutput
                      label={strings.drefExportDrefLaunched}
                      value={dref.date_of_approval}
                      columns="1/2"
                    />
                    <View style={[pdfStyles.compactSection, pdfStyles.oneByTwo]}>
                      <PdfTextOutput
                        label={strings.drefExportDrefEndDateOfOperation}
                        value={dref.end_date}
                        columns="1/2"
                      />
                      <PdfTextOutput
                        label={strings.drefExportOperationTimeframe}
                        value={
                          isDefined(dref.operation_timeframe) ?
                            resolveToString(strings.drefExportNumMonth, { num: dref.operation_timeframe })
                            : ''
                        }
                        columns="1/2"
                      />
                    </View>
                  </View>
                </View>
                <View style={pdfStyles.compactSection}>
                  <PdfTextOutput
                    label={strings.drefExportAffectedAreas}
                    value={affectedAreas}
                    columns="3/3"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        {(
          dref?.event_scope ||
          dref?.event_description ||
          dref?.anticipatory_actions ||
          dref?.images_details.length > 0
        ) && (
            <View>
              <Text style={pdfStyles.sectionHeading}>
                {strings.drefFormDescriptionEvent}
              </Text>
              {dref.images_details?.map((el) => (
                <View
                  key={el?.id}
                  style={pdfStyles.subSection}
                >
                  <PDFImage
                    style={pdfStyles.mapImage}
                    src={el.file}
                  />
                </View>
              ))}
              {dref?.event_description && (
                <View style={pdfStyles.subSection}>
                  <Text style={pdfStyles.subSectionHeading}>
                    {!isImminentOnset ?
                      strings.drefFormWhatWhereWhen
                      : strings.drefFormImminentDisaster}
                  </Text>
                  <Text style={pdfStyles.text}>
                    {dref.event_description}
                  </Text>
                </View>
              )}
              {dref.anticipatory_actions && (
                <View style={pdfStyles.subSection}>
                  <Text style={pdfStyles.subSectionHeading}>
                    {strings.drefFormTargetCommunities}
                  </Text>
                  <Text style={pdfStyles.text}>
                    {dref.anticipatory_actions}
                  </Text>
                </View>
              )}
              {dref?.event_scope && (
                <View style={pdfStyles.subSection}>
                  <Text style={pdfStyles.subSectionHeading}>
                    {strings.drefFormScopeAndScaleEvent}
                  </Text>
                  <Text style={pdfStyles.text}>
                    {dref.event_scope}
                  </Text>
                </View>
              )}
            </View>
          )}
        <View style={pdfStyles.poSection}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefFormPreviousOperations}
          </Text>
          <View>
            <Link src={resolveUrl(window.location.origin, 'preparedness#operational-learning')}>
              {strings.drefOperationalLearningPlatformLabel}
            </Link>
          </View>
          <View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.cellTitle}>
                {strings.drefFormAffectSameArea}
              </Text>
              <Text style={pdfStyles.strongCell}>
                {formatBoolean(dref.affect_same_area)}
              </Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.cellTitle}>
                {strings.drefFormAffectedthePopulationTitle}
              </Text>
              <Text style={pdfStyles.strongCell}>
                {formatBoolean(dref.affect_same_population)}
              </Text>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.cellTitle}>
                <Text>{strings.drefFormNsRespond}</Text>
              </View>
              <View style={pdfStyles.strongCell}>
                <Text>{formatBoolean(dref.ns_respond)}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.cellTitle}>
                <Text>{strings.drefFormNsRequestFund}</Text>
              </View>
              <View style={pdfStyles.strongCell}>
                <Text>{formatBoolean(dref.ns_request_fund)}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.cellTitle}>
                <Text>{strings.drefFormNsFundingDetail}</Text>
              </View>
              <View style={pdfStyles.strongCell}>
                <Text>{dref.ns_request_text ?? '-'}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.cellTitle}>
                <Text>{strings.drefFormLessonsLearnedTitle}</Text>
                <Text style={pdfStyles.cellDescription}>
                  {strings.drefFormLessonsLearnedDescription}
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
        {dref?.national_society_actions.length > 0 && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionHeading}>
              {strings.drefFormNationalSocietiesActions}
            </Text>
            {dref?.national_society_actions.map((nsa) => (
              <NationalSocietyActions
                key={nsa.id}
                data={nsa}
              />
            ))}
          </View>
        )}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefFormMovementPartners}
          </Text>
          <View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefFormIfrc}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{dref.ifrc}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefFormIcrc}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{dref.icrc}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefFormPartnerNationalSociety}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{dref.partner_national_society}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefFormNationalOtherActors}
          </Text>
          <View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefFormInternationalAssistance}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{formatBoolean(dref.government_requested_assistance)}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefFormNationalAuthorities}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{dref.national_authorities}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefFormUNorOtherActors}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{dref.un_or_other_actor}</Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.niHeaderCell}>
                <Text>{strings.drefFormCoordinationMechanism}</Text>
              </View>
              <View style={pdfStyles.niContentCell}>
                <Text>{dref.major_coordination_mechanism}</Text>
              </View>
            </View>
          </View>
        </View>
        {dref?.needs_identified.length > 0 && (
          <View style={pdfStyles.niSection}>
            <Text style={pdfStyles.sectionHeading}>
              {isImminentOnset ?
                strings.drefFormImminentNeedsIdentified
                : strings.drefFormNeedsIdentified}
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
        {(
          dref?.people_assisted ||
          dref?.selection_criteria
        ) && (
            <View style={pdfStyles.section}>
              <Text style={pdfStyles.sectionHeading}>
                {strings.drefFormTargetingStrategy}
              </Text>
              {dref?.people_assisted && (
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormPeopleAssistedThroughOperation}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref.people_assisted}
                  </Text>
                </View>
              )}
              {dref?.selection_criteria && (
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormSelectionCriteria}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref.selection_criteria}
                  </Text>
                </View>
              )}
            </View>
          )}
        <View style={pdfStyles.tpSection}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefFormAssistedPopulation}
          </Text>
          <View style={pdfStyles.row}>
            <View style={pdfStyles.tpHeaderCell}>
              <Text>{strings.drefFormTargetedPopulation}</Text>
            </View>
            <View style={pdfStyles.tpContentCell}>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.drefFormWomen}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(dref?.women)}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.drefFormMen}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(dref?.men)}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.drefFormGirls}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(dref?.girls)}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.drefFormBoys}</Text>
                </View>
                <View style={pdfStyles.tpSubCell}>
                  <Text style={pdfStyles.strong}>
                    {formatNumber(dref?.boys)}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>{strings.drefFormTotal}</Text>
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
              <Text>{strings.drefFormEstimateResponse}</Text>
            </View>
            <View style={pdfStyles.tpContentCell}>
              <View style={pdfStyles.tpSubRow}>
                <View style={pdfStyles.tpSubCell}>
                  <Text>
                    {strings.drefFormEstimatePeopleDisability}
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
                  <Text>{strings.drefFormEstimatedPercentage}</Text>
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
                  <Text>{strings.drefFormEstimatedDisplacedPeople}</Text>
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
                    <Text>{strings.drefFormPeopleTargetedWithEarlyActions}</Text>
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
        {dref?.operation_objective && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionHeading}>
              {strings.drefFormObjectiveOperation}
            </Text>
            <Text>{dref.operation_objective}</Text>
          </View>
        )}
        {dref?.response_strategy && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionHeading}>
              {strings.drefFormResponseRationale}
            </Text>
            <Text>{dref.response_strategy}</Text>
          </View>
        )}
        {(
          dref?.human_resource ||
          dref?.surge_personnel_deployed ||
          dref?.logistic_capacity_of_ns ||
          dref?.pmer ||
          dref?.communication
        )
          && (
            <View style={pdfStyles.section}>
              <Text style={pdfStyles.sectionHeading}>
                {strings.drefFormSupportServices}
              </Text>
              {dref?.human_resource && (
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormHumanResourceDescription}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref.human_resource}
                  </Text>
                </View>
              )}
              {dref?.surge_personnel_deployed && (
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormSurgePersonnelDeployed}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref.surge_personnel_deployed}
                  </Text>
                </View>
              )}
              {dref?.logistic_capacity_of_ns && (
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormLogisticCapacityOfNs}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref.logistic_capacity_of_ns}
                  </Text>
                </View>
              )}
              {dref?.pmer && (
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormPmerDescription}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref.pmer}
                  </Text>
                </View>
              )}
              {dref?.communication && (
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormCommunicationDescripiton}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref.communication}
                  </Text>
                </View>
              )}
            </View>
          )}
        {dref.planned_interventions.length > 0 && (
          <View style={pdfStyles.piSection}>
            <Text style={pdfStyles.sectionHeading}>
              {strings.drefFormPlannedIntervention}
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
        {dref?.budget_file && (
          <View>
            <Text style={pdfStyles.sectionHeading}>
              {strings.drefExportBudgetOverview}
            </Text>
            <View style={pdfStyles.subSection}>
              <Link src={resolveUrl(window.location.origin, dref?.budget_file_details?.file)}>
                {dref.budget_file_details?.file}
              </Link>
            </View>
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
              title={strings.drefFormNationalSocietyContact}
              contacts={[
                dref.national_society_contact_name,
                dref.national_society_contact_title,
                dref.national_society_contact_email,
                dref.national_society_contact_phone_number,
              ]}
            />
            <ContactSection
              title={strings.drefFormAppealManager}
              contacts={[
                dref.ifrc_appeal_manager_name,
                dref.ifrc_appeal_manager_title,
                dref.ifrc_appeal_manager_email,
                dref.ifrc_appeal_manager_phone_number,
              ]}
            />
            <ContactSection
              title={strings.drefFormProjectManager}
              contacts={[
                dref.ifrc_project_manager_name,
                dref.ifrc_project_manager_title,
                dref.ifrc_project_manager_email,
                dref.ifrc_project_manager_phone_number,
              ]}
            />
            <ContactSection
              title={strings.drefFormIfrcEmergency}
              contacts={[
                dref.ifrc_emergency_name,
                dref.ifrc_emergency_title,
                dref.ifrc_emergency_email,
                dref.ifrc_emergency_phone_number,
              ]}
            />
            <ContactSection
              title={strings.drefFormMediaContact}
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

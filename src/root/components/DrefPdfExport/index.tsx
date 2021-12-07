import React from 'react';
import type { History, Location } from 'history';
import type { match as Match } from 'react-router-dom';
import {
  Page as PDFPage,
  Text,
  Link,
  View,
  Document,
  Image as PDFImage,
  PDFViewer,
  // Font,
} from '@react-pdf/renderer';
import {
  addSeparator,
  listToMap,
} from '@togglecorp/fujs';

import BlockLoading from '#components/block-loading';
import Page from '#components/Page';
import { useRequest } from '#utils/restRequest';
import { DrefApiFields } from '#views/DrefApplicationForm/common';
import LanguageContext from '#root/languageContext';

// import ifrcLogo from './resources/ifrc_logo.png';
// import drefBanner from './resources/dref-banner.png';
// import openSansRegularFont from './resources/OpenSans-Regular.ttf';
// import openSansBoldFont from './resources/OpenSans-Bold.ttf';
// import montserratFont from './resources/Montserrat-Bold.ttf';

import {
  NumericKeyValuePair,
  StringKeyValuePair,
} from '#types';

import pdfStyles from './pdfStyles';
import styles from './styles.module.scss';

// Font.register({
//   family: 'OpenSans',
//   src: openSansRegularFont,
//   fontWeight: 'regular',
// });
// 
// Font.register({
//   family: 'OpenSans',
//   src: openSansBoldFont,
//   fontWeight: 'bold',
// });
// 
// Font.register({
//   family: 'Montserrat',
//   src: montserratFont,
//   fontWeight: 'bold',
// });

function loadImage(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = img.height;
      canvas.width = img.width;

      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }

      resolve(canvas.toDataURL());
    };

    img.src = src;
  });
}

interface NationalSocietyActionsProps {
  data: DrefApiFields['national_society_actions'][number];
  nsaMap?: Record<string, string>;
}

function NationalSocietyActions(props: NationalSocietyActionsProps) {
  const {
    data,
    nsaMap = {},
  } = props;

  return (
    <View style={pdfStyles.nsaOutput}>
      <Text>
      {'\u2022'} {nsaMap[data.title]}
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
}

function PlannedInterventionOutput(props: PlannedInterventionProps) {
  const {
    data,
    piMap = {},
  } = props;

  return (
    <View wrap={false} style={pdfStyles.piOutput}>
      <View style={pdfStyles.piRow}>
        <View style={pdfStyles.piHeaderCell}>
          <Text>
            {piMap[data.title]}
          </Text>
        </View>
        <View style={[pdfStyles.piContentCell, { flexDirection: 'column' }]}>
          <View style={pdfStyles.piSubRow}>
            <Text style={pdfStyles.piSubHeadingCell}>
              Budget
            </Text>
            <Text style={pdfStyles.piSubContentCell}>
              {data.budget}
            </Text>
          </View>
          <View style={pdfStyles.piSubRow}>
            <Text style={pdfStyles.piSubHeadingCell}>
              Targeted persons
            </Text>
            <Text style={pdfStyles.piSubContentCell}>
              {data.person_targeted}
            </Text>
          </View>
        </View>
      </View>
      <View style={pdfStyles.piRow}>
        <View style={pdfStyles.piHeaderCell}>
          <Text>
            Indicators:
          </Text>
        </View>
        <View style={pdfStyles.piContentCell}>
          <Text style={pdfStyles.piBorderCell}>
            {data.indicator}
          </Text>
        </View>
      </View>
      <View style={pdfStyles.piRow}>
        <View style={pdfStyles.piHeaderCell}>
          <Text>
            Priority Actions:
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

function booleanToYesNo(value: boolean | undefined | null) {
  if (value === true) {
    return 'Yes';
  }

  if (value === false) {
    return 'No';
  }

  return '-';
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
      <Text style={pdfStyles.label}>
        {label}
      </Text>
      <Text style={pdfStyles.value}>
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
  className?: string;
  match: Match<{ drefId?: string }>;
  history: History;
  location: Location;
}

function DrefPdfExport(props: Props) {
  const { strings } = React.useContext(LanguageContext);
  const {
    className,
    match,
  } = props;
  const [mapImage, setMapImage] = React.useState<string | undefined>();
  const [ifrcLogo, setIfrcLogo] = React.useState<string | undefined>();

  const { drefId } = match.params;

  const {
    pending: fetchingDref,
    response: dref,
  } = useRequest<DrefApiFields>({
    skip: !drefId,
    url: `api/v2/dref/${drefId}/`,
  });

  const {
    pending: fetchingDrefOptions,
    response: drefOptions,
  } = useRequest<DrefOptions>({
    url: 'api/v2/dref-options/',
  });

  const pending = fetchingDref || fetchingDrefOptions;

  const [
    piMap,
    niMap,
    nsaMap,
  ] = React.useMemo(() => {
    if (!drefOptions) {
      return [
        {},
        {}
      ];
    }

    return [
      listToMap(drefOptions.planned_interventions, d => d.key, d => d.value),
      listToMap(drefOptions.needs_identified, d => d.key, d => d.value),
      listToMap(drefOptions.national_society_actions, d => d.key, d => d.value),
    ];
  }, [drefOptions]);

  React.useEffect(() => {
    if (dref?.event_map_details) {
      loadImage(dref.event_map_details.file).then((img) => {
        setMapImage(img);
      });
    }
  }, [dref?.event_map_details]);

  React.useEffect(() => {
    loadImage('/assets/graphics/layout/go-logo-2020.png').then((img) => {
      setIfrcLogo(img);
    });
  }, []);

  return (
    <Page
      className={className}
      heading="DREF Export"
    >
      {pending ? (
        <BlockLoading />
      ) : (
        <PDFViewer className={styles.pdfPreview}>
          <Document>
            <PDFPage
              size="A4"
              style={pdfStyles.page}
            >
              <View style={pdfStyles.section}>
                <PDFImage
                  style={pdfStyles.logo}
                  src={ifrcLogo}
                />
                <Text style={pdfStyles.title}>
                  {/* FIXME: use strings */}
                  DREF Application
                </Text>
              </View>
              <View
                style={[
                  pdfStyles.section,
                  { alignSelf: 'flex-end' }
                ]}
              >
                <Text style={pdfStyles.subHeading}>
                  {[
                    dref?.country_district.map(d => d.country_details?.name).join(', '),
                    dref?.ifrc_emergency_name
                  ].join(' | ')}
                </Text>
              </View>
              <View
                style={[
                  pdfStyles.section,
                  {
                    width: 560,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    backgroundColor: '#f0f0f0',
                  },
                ]}
              >
                <PDFImage
                  style={pdfStyles.bannerImage}
                  src={ifrcLogo}
                />
              </View>
              <View
                style={{
                  width: '100%',
                  padding: 16,
                }}
              >
                <View style={pdfStyles.compactSection}>
                  <TextOutput
                    label={strings.drefFormPdfAppealNum}
                    value={dref?.appeal_code}
                  />
                  <TextOutput
                    label={strings.drefFormPdfDrefAllocated}
                    value={`CHF ${addSeparator(dref?.amount_requested ?? '') ?? '-'}`}
                    columns="2/3"
                  />
                </View>
                <View style={pdfStyles.compactSection}>
                  <TextOutput
                    label={strings.drefFormPdfGlideNum}
                    value={dref?.glide_code}
                  />
                  <View style={pdfStyles.twoByThree}>
                    <View style={pdfStyles.compactSection}>
                      <View style={[pdfStyles.compactSection, { width: '100%' }]}>
                        <TextOutput
                          label={strings.drefFormPdfPeopleAffected}
                          value={`${dref?.num_affected} ${dref?.num_affected ? 'people' : ''}`}
                          columns="1/2"
                        />
                        <TextOutput
                          label={strings.drefFormPdfPeopleAssisted}
                          value={`${dref?.num_assisted} ${dref?.num_assisted ? 'people' : ''}`}
                          columns="1/2"
                        />
                      </View>
                    </View>
                    <View style={pdfStyles.compactSection}>
                      <View style={pdfStyles.compactSection}>
                        <TextOutput
                          label={strings.drefFormPdfDrefLaunched}
                          value={dref?.date_of_approval}
                          columns="1/2"
                        />
                        <View style={[pdfStyles.compactSection, pdfStyles.oneByTwo]}>
                          <TextOutput
                            label={strings.drefFormPdfDrefEnds}
                            value={dref?.end_date}
                            columns="1/2"
                          />
                          <TextOutput
                            label={strings.drefFormOperationTimeframeSubmission}
                            value={`${dref?.operation_timeframe} months`}
                            columns="1/2"
                          />
                        </View>
                      </View>
                    </View>
                    <View style={pdfStyles.compactSection}>
                      <TextOutput
                        label={strings.drefFormPdfAffectedAreas}
                        columns="3/3"
                      />
                    </View>
                  </View>
                </View>
              </View>
            </PDFPage>
            <PDFPage
              size="A4"
              style={pdfStyles.page}
            >
              <View style={pdfStyles.section}>
                <View style={[pdfStyles.section, { alignItems: 'flex-start' }]}>
                  <View
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PDFImage
                      style={pdfStyles.mapImage}
                      src={mapImage ? mapImage : ifrcLogo}
                    />
                  </View>
                  <View style={{ padding: 10 }}>
                    <View>
                      <Text style={pdfStyles.heading}>
                        {strings.drefFormPdfDrescriptionOfTheEvent}
                      </Text>
                      <Text style={pdfStyles.subHeading}>
                        {strings.drefFormWhatWhereWhen}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 240,
                        marginTop: 30,
                      }}
                    >
                      <Text style={pdfStyles.headerText}>
                        {strings.drefFormPdfScopeAndScale}
                      </Text>
                      <Text>
                        {dref?.event_scope}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </PDFPage>
            <PDFPage
              size="A4"
              style={pdfStyles.page}
            >
              <View wrap={false}>
                <View style={[pdfStyles.section, pdfStyles.table]}>
                  <Text style={pdfStyles.heading}>
                    {strings.drefFormPreviousOperations}
                  </Text>
                  <View>
                    <View style={pdfStyles.row}>
                      <View style={pdfStyles.cell}>
                        <Text>{strings.drefFormAffectSameArea}</Text>
                      </View>
                      <View style={pdfStyles.cell}>
                        <Text>{booleanToYesNo(dref?.affect_same_area)}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.row}>
                      <View style={pdfStyles.cell}>
                        <Text>{strings.drefFormAffectedthePopulationTitle}</Text>
                      </View>
                      <View style={pdfStyles.cell}>
                        <Text>{booleanToYesNo(dref?.affect_same_population)}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.row}>
                      <View style={pdfStyles.cell}>
                        <Text>{strings.drefFormNsRespond}</Text>
                      </View>
                      <View style={pdfStyles.cell}>
                        <Text>{booleanToYesNo(dref?.ns_respond)}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.row}>
                      <View style={pdfStyles.cell}>
                        <Text>{strings.drefFormNsRequest}</Text>
                      </View>
                      <View style={pdfStyles.cell}>
                        <Text>{booleanToYesNo(dref?.ns_request_fund)}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.row}>
                      <View style={pdfStyles.cell}>
                        <Text>{strings.drefFormNsFundingDetail}</Text>
                      </View>
                      <View style={pdfStyles.cell}>
                        <Text>{dref?.ns_request_text ?? '-'}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.row}>
                      <View style={pdfStyles.cell}>
                        <Text> {strings.drefFormRecurrentText}</Text>
                      </View>
                      <View style={pdfStyles.cell}>
                        <Text>{dref?.dref_recurrent_text}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.row}>
                      <View style={pdfStyles.cell}>
                        <Text>{strings.drefFormLessonsLearnedTitle}</Text>
                        <Text>{strings.drefFormLessonsLearnedDescription}</Text>
                      </View>
                      <View style={pdfStyles.cell}>
                        <Text>{dref?.lessons_learned}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View wrap={false} style={pdfStyles.textSection}>
                <Text style={pdfStyles.heading}>
                  {strings.drefFormPdfCurrentNationalSocietyAction}
                </Text>
                {dref?.national_society_actions.map((nsa) => (
                  <NationalSocietyActions
                    key={nsa.id}
                    data={nsa}
                    nsaMap={nsaMap} />
                ))}
              </View>
              <View wrap={false} style={[pdfStyles.section, pdfStyles.table]}>
                <Text style={pdfStyles.heading}>
                  {strings.drefFormPdfMovementPartnersActions}
                </Text>
                <View style={pdfStyles.row}>
                  <View style={pdfStyles.cell}>
                    <Text>{strings.drefFormIfrc}</Text>
                  </View>
                  <View style={pdfStyles.cell}>
                    <Text>{dref?.ifrc}</Text>
                  </View>
                </View>
                <View style={pdfStyles.row}>
                  <View style={pdfStyles.cell}>
                    <Text>{strings.drefFormIcrc}</Text>
                  </View>
                  <View style={pdfStyles.cell}>
                    <Text>{dref?.icrc}</Text>
                  </View>
                </View>
                <View style={pdfStyles.row}>
                  <View style={pdfStyles.cell}>
                    <Text>{strings.drefFormPartnerNationalSociety}</Text>
                  </View>
                  <View style={pdfStyles.cell}>
                    <Text>{dref?.partner_national_society}</Text>
                  </View>
                </View>
              </View>
              <View wrap={false} style={[pdfStyles.section, pdfStyles.table]}>
                <Text style={pdfStyles.heading}>
                  {strings.drefFormNationalOtherActors}
                </Text>
                <View>
                  <View style={pdfStyles.row}>
                    <View style={pdfStyles.cell}>
                      <Text>{strings.drefFormInternationalAssistance}</Text>
                    </View>
                    <View style={pdfStyles.cell}>
                      <Text>{booleanToYesNo(dref?.government_requested_assistance)}</Text>
                    </View>
                  </View>
                  <View style={pdfStyles.row}>
                    <View style={pdfStyles.cell}>
                      <Text>{strings.drefFormNationalAuthorities}</Text>
                    </View>
                    <View style={pdfStyles.cell}>
                      <Text>{dref?.national_authorities}</Text>
                    </View>
                  </View>
                  <View style={pdfStyles.row}>
                    <View style={pdfStyles.cell}>
                      <Text>{strings.drefFormUNorOtherActors}</Text>
                    </View>
                    <View style={pdfStyles.cell}>
                      <Text>{dref?.un_or_other_actor}</Text>
                    </View>
                  </View>
                  <View style={pdfStyles.row}>
                    <View style={pdfStyles.cell}>
                      <Text>{strings.drefFormCoordinationMechanism}</Text>
                    </View>
                    <View style={pdfStyles.cell}>
                      <Text>{dref?.major_coordination_mechanism}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View wrap={false} style={pdfStyles.niSection}>
                <View style={pdfStyles.heading}>
                  <Text>
                    Needs (Gaps) Identified
                  </Text>
                </View>
                {dref?.needs_identified.map((ni) => (
                  <NeedIdentified
                    key={ni.id}
                    data={ni}
                    niMap={niMap}
                  />
                ))}
              </View>
              <View wrap={false} style={pdfStyles.textSection}>
                <Text style={pdfStyles.heading}>
                  {strings.drefFormTargetingStrategy}
                </Text>
                <Text style={pdfStyles.textLabelSection}>{strings.drefFormPeopleAssistedthroughOperation}</Text>
                <Text>{dref?.people_assisted}</Text>
                <Text style={pdfStyles.textLabelSection}>{strings.drefFormSelectionCriteria}</Text>
                <Text> {dref?.selection_criteria} </Text>
                <Text style={pdfStyles.textLabelSection}>{strings.drefFormProtectionGenderAndInclusion}</Text>
                <Text>{dref?.entity_affected} </Text>
              </View>

              <View wrap={false} style={[pdfStyles.section, pdfStyles.tpSection]}>
                <Text style={pdfStyles.heading}>
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
                        <Text>{dref?.women}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.tpSubRow}>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{strings.drefFormMen}</Text>
                      </View>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{dref?.men}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.tpSubRow}>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{strings.drefFormGirls}</Text>
                      </View>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{dref?.girls}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.tpSubRow}>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{strings.drefFormBoys}</Text>
                      </View>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{dref?.boys}</Text>
                      </View>
                    </View>
                    <View style={[pdfStyles.tpSubRow, { flexBasis: '100%' }]}>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{strings.drefFormTotal}</Text>
                      </View>
                      <View style={[pdfStyles.tpSubCell, { flexBasis: '75%' }]}>
                        <Text>{dref?.total_targated_population}</Text>
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
                        <Text>{dref?.disability_people_per}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.tpSubRow}>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{strings.drefFormEstimatedPercentage}</Text>
                      </View>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{dref?.people_per_urban}/{dref?.people_per_local} </Text>
                      </View>
                    </View>
                    <View style={pdfStyles.tpSubRow}>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{strings.drefFormEstimatedDisplacedPeople}</Text>
                      </View>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{dref?.displaced_people}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View wrap={false} style={pdfStyles.textSection}>
                <Text style={pdfStyles.heading}>
                  {strings.drefFormObjectiveOperation}
                </Text>
                <Text>{dref?.operation_objective}</Text>
              </View>
              <View wrap={false} style={pdfStyles.textSection}>
                <Text style={pdfStyles.heading}>
                  Response Strategy Rationale
                </Text>
                <Text>{dref?.response_strategy}</Text>
              </View>
              <View wrap={false} style={pdfStyles.textSection}>
                <Text style={pdfStyles.heading}>
                  {strings.drefFormSupportServices}
                </Text>
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormHumanResourceDescription}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref?.human_resource}
                  </Text>
                </View>
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormSurgePersonnelDeployed}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref?.surge_personnel_deployed}
                  </Text>
                </View>
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormLogisticCapacityOfNs}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref?.logistic_capacity_of_ns}
                  </Text>
                </View>
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormSafetyConcerns}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref?.safety_concerns}
                  </Text>
                </View>
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormPmerDescription}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref?.pmer}
                  </Text>
                </View>
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormCommunicationDescription}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref?.communication}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.piSection}>
                <View style={pdfStyles.heading}>
                  <Text>
                    {strings.drefFormPlannedIntervention}
                  </Text>
                </View>
                {dref?.planned_interventions.map((pi) => (
                  <PlannedInterventionOutput
                    key={pi.id}
                    data={pi}
                    piMap={piMap}
                  />
                ))}
              </View>
              <View wrap={false} style={[pdfStyles.section, pdfStyles.contactSection]}>
                <Text style={pdfStyles.heading}>
                  {strings.drefFormPdfContactInformation}
                </Text>
                <Text style={pdfStyles.subHeading}>
                  {strings.drefFormPdfContactDescription}
                </Text>

                <View style={pdfStyles.contactList}>
                  <View style={pdfStyles.ciRow}>
                    <Text style={pdfStyles.contactType}>
                      {'\u2022'} {strings.drefFormNationalSocietyContact}
                    </Text>
                    <Text>{dref?.national_society_contact_name}, </Text>
                    <Text>{dref?.national_society_contact_title}, </Text>
                    <Text>{dref?.national_society_contact_email}, </Text>
                    <Text>{dref?.national_society_contact_phone_number}</Text>
                  </View>

                  <View style={pdfStyles.ciRow}>
                    <Text style={pdfStyles.contactType}>
                      {'\u2022'} {strings.drefFormAppealManager}
                    </Text>
                    <Text>{dref?.ifrc_appeal_manager_name}, </Text>
                    <Text>{dref?.ifrc_appeal_manager_title}, </Text>
                    <Text>{dref?.ifrc_appeal_manager_email}, </Text>
                    <Text>{dref?.ifrc_appeal_manager_phone_number}</Text>
                  </View>

                  <View style={pdfStyles.ciRow}>
                    <Text style={pdfStyles.contactType}>
                      {'\u2022'} {strings.drefFormProjectManager}
                    </Text>
                    <Text>{dref?.ifrc_project_manager_name}, </Text>
                    <Text>{dref?.ifrc_project_manager_title}, </Text>
                    <Text>{dref?.ifrc_project_manager_email}, </Text>
                    <Text>{dref?.ifrc_project_manager_phone_number} </Text>
                  </View>

                  <View style={pdfStyles.ciRow}>
                    <Text style={pdfStyles.contactType}>
                      {'\u2022'} {strings.drefFormIfrcEmergency}
                    </Text>
                    <Text>{dref?.ifrc_emergency_name}, </Text>
                    <Text>{dref?.ifrc_emergency_title}, </Text>
                    <Text>{dref?.ifrc_emergency_email}, </Text>
                    <Text>{dref?.ifrc_emergency_phone_number}</Text>
                  </View>

                  <View style={pdfStyles.ciRow}>
                    <Text style={pdfStyles.contactType}>
                      {'\u2022'} {strings.drefFormMediaContact}
                    </Text>
                    <Text>{dref?.media_contact_name}, </Text>
                    <Text>{dref?.media_contact_title}, </Text>
                    <Text>{dref?.media_contact_email}, </Text>
                    <Text>{dref?.media_contact_phone_number}</Text>
                  </View>
                </View>
              </View>
              <View style={pdfStyles.section}>
                <Link src="https://go.ifrc.org/emergencies">
                  Click here for the reference
                </Link>
              </View>
            </PDFPage>
          </Document>
        </PDFViewer>
      )}
    </Page>
  );
}
export default DrefPdfExport;

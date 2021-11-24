import React from 'react';
import type { History, Location } from 'history';
import type { match as Match } from 'react-router-dom';

import {
  Page as PDFPage,
  Text,
  View,
  Document,
  StyleSheet,
  Image as PDFImage,
  PDFViewer,
  Font,
} from '@react-pdf/renderer';

import Page from '#components/Page';

import { useRequest } from '#utils/restRequest';
import { DrefApiFields } from '#views/DrefApplicationForm/common';

import ifrcLogo from './ifrc_logo.png';
import shelter from './shelter.png';
import livelihoods from './livelihoods.png';
import multi_purpose from './multi-purpose.png';
import health from './health.png';
import water from './water.png';
import protection from './protection.png';
import education from './education.png';
import migration from './migration.png';
import risk from './risk.png';
import environmental from './environmental.png';
import openSansRegularFont from './OpenSans-Regular.ttf';
import openSansBoldFont from './OpenSans-Bold.ttf';
import montserratFont from './Montserrat-Bold.ttf';
import LanguageContext from '#root/languageContext';
import styles from './styles.module.scss';
import content from './styles.module.scss';

Font.register({
  family: 'OpenSans',
  src: openSansRegularFont,
  fontWeight: 'regular',
});

Font.register({
  family: 'OpenSans',
  src: openSansBoldFont,
  fontWeight: 'bold',
});

Font.register({
  family: 'Montserrat',
  src: montserratFont,
  fontWeight: 'bold',
});

const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: 'OpenSans',
    fontSize: 12,
  },
  section: {
    padding: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    flexDirection: 'row',
  },
  compactSection: {
    display: 'flex',
    justifyItem: 'stretch',
    alignItems: 'stretch',
    flexDirection: 'row',
    width: '100%',
  },
  textSection: {
    padding: 20,
  },
  textLabelSection: {
    paddingTop: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  icon: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Montserrat',
    color: '#f5333f',
  },
  heading: {
    fontSize: 20,
    fontFamily: 'Montserrat',
    color: '#f5333f',
  },
  subHeading: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    fontFamily: 'OpenSans',
  },
  value: {
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
  },
  textOutput: {
    backgroundColor: '#f0f0f0',
    margin: 1,
    padding: 10,
  },
  oneByThree: {
    width: '33%',
  },
  twoByThree: {
    width: '66%',
  },
  threeByThree: {
    width: '99%',
  },
  oneByTwo: {
    width: '50%',
  },
  table: {
    fontSize: 10,
    width: 550,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "stretch",
    flexWrap: "nowrap",
    alignItems: "stretch",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    padding: '0',
    minWidth: '100%',
    width: '100%',
    margin: '0',
  },
  cellContent: {
    border: '1px solid black',
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: '5',
    minWidth: '22%',
    maxWidth: '22%',
  },
  verticalRow: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 10,
    width: 300,
  },
  cell: {
    border: '1px solid black',
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: '5',
    minWidth: '49%',
    maxWidth: '49%',
  },
  header: {
    backgroundColor: "#eee"
  },
  headerText: {
    fontSize: 11,
    fontWeight: 1200,
    color: "#1a245c",
    margin: 8
  },
  tableText: {
    margin: 10,
    fontSize: 10,
  },

});

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

  const { drefId } = match.params;

  const {
    pending: fetchingDref,
    response: dref,
  } = useRequest<DrefApiFields>({
    skip: !drefId,
    url: `api/v2/dref/${drefId}/`,
  });

  React.useEffect(() => {
    loadImage('https://i.imgur.com/ASTH5p7.jpeg').then((img) => {
      setMapImage(img);
    });
  }, []);

  console.info(dref);

  return (
    <Page
      className={className}
      heading="DREF Export"
    >
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
                DREF Application
              </Text>
            </View>
            <View
              style={[
                pdfStyles.section,
                { alignSelf: 'flex-end' }
              ]}
            >
              <Text>
                Country,  | {dref?.ifrc_emergency_name}
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
                style={{ width: 400, height: 300, objectFit: 'contain', objectPosition: 'center' }}
                src={mapImage ? mapImage : ifrcLogo}
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
                  value={`CHF ${dref?.amount_requested ?? '-'}`}
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
                    backgroundColor: '#f0f0f0',
                    width: 260,
                    height: 360,
                  }}
                >
                  <Text>
                    Image
                  </Text>
                </View>
                <View
                  style={{
                    padding: 10,
                  }}
                >
                  <View>
                    <Text style={pdfStyles.heading}>
                      {strings.drefFormPdfDrescriptionOfTheEvent}
                    </Text>
                    <Text style={pdfStyles.subHeading}>
                      {strings.drefFormWhatWhereWhen}
                    </Text>
                  </View>
                  <View>
                    <Text style={pdfStyles.subHeading}>
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
                    <Text>{dref?.affect_same_area + ''}</Text>
                  </View>
                </View>
                <View style={pdfStyles.row}>
                  <View style={pdfStyles.cell}>
                    <Text>{strings.drefFormAffectedthePopulationTitle}</Text>
                  </View>
                  <View style={pdfStyles.cell}>
                    <Text>{dref?.affect_same_population + ''}</Text>
                  </View>
                </View>
                <View style={pdfStyles.row}>
                  <View style={pdfStyles.cell}>
                    <Text>{strings.drefFormNsRespond}</Text>
                  </View>
                  <View>
                    <Text>{dref?.ns_respond}</Text>
                  </View>
                </View>
                <View style={pdfStyles.row}>
                  <View style={pdfStyles.cell}>
                    <Text>{strings.drefFormNsRequest}</Text>
                  </View>
                  <View style={pdfStyles.cell}>
                    <Text>{dref?.ns_request_fund + ''}</Text>
                  </View>
                </View>
                <View style={pdfStyles.row}>
                  <View style={pdfStyles.cell}>
                    <Text>{strings.drefFormNsFundingDetail}</Text>
                  </View>
                  <View style={pdfStyles.cell}>
                    <Text>{dref?.ns_request_text + ''}</Text>
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
                    <Text>{strings.drefFormLessonsLearnedTitle} {strings.drefFormLessonsLearnedDescription}</Text>
                  </View>
                  <View style={pdfStyles.cell}>
                    <Text>{dref?.lessons_learned}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={pdfStyles.textSection}>
              <Text style={pdfStyles.heading}>
                {strings.drefFormPdfCurrentNationalSocietyAction}
              </Text>
              <View>
                <Text>{'\u2022'}  National Society Readiness</Text>
                <Text>{'\u2022'}  Assessments</Text>
                <Text>{'\u2022'}  Others</Text>
              </View>
            </View>
            <View style={[pdfStyles.section, pdfStyles.table]}>
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
            <View style={[pdfStyles.section, pdfStyles.table]}>
              <Text style={pdfStyles.heading}>
                {strings.drefFormNationalOtherActors}
              </Text>
              <View>
                <View style={pdfStyles.row}>
                  <View style={pdfStyles.cell}>
                    <Text>{strings.drefFormInternationalAssistance}</Text>
                  </View>
                  <View style={pdfStyles.cell}>
                    <Text>{dref?.government_requested_assistance}</Text>
                  </View>
                </View>
                <View style={pdfStyles.row}>
                  <View style={pdfStyles.cell}>
                    <Text>{strings.drefFormNationalAuthorities}</Text>
                  </View>
                  <View>
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
            <View style={[pdfStyles.section, pdfStyles.table]}>
              <Text style={pdfStyles.heading}>
                {strings.drefFormNeedsIdentified}
              </Text>
              <View style={pdfStyles.row}>
                <View style={pdfStyles.cell}>
                  <PDFImage
                    style={pdfStyles.icon}
                    src={shelter}
                  />
                </View>
                <View style={pdfStyles.cell}>
                  <Text> {'\u2022'} Livelihoods</Text>
                </View>
              </View>
              <View style={pdfStyles.row}>
                <View style={pdfStyles.cell}>
                  <PDFImage
                    style={pdfStyles.icon}
                    src={health}
                  />
                </View>
                <View style={pdfStyles.cell}>
                  <Text> {'\u2022'} Health & Care (Mental Health and psychosocial support / Community Health / Medical Services)</Text>
                </View>
              </View>
            </View>
            <View style={pdfStyles.textSection}>
              <Text style={pdfStyles.heading}>
                {strings.drefFormTargetingStrategy}
              </Text>
              <Text style={pdfStyles.textLabelSection}>{strings.drefFormPeopleAssistedthroughOperation}</Text>
              <Text>{dref?.glide_code}</Text>
              <Text style={pdfStyles.textLabelSection}>{strings.drefFormSelectionCriteria}</Text>
              <Text> {dref?.selection_criteria} </Text>
              <Text style={pdfStyles.textLabelSection}>{strings.drefFormProtectionGenderAndInclusion}</Text>
              <Text>{dref?.entity_affected} </Text>
            </View>

            <View style={[pdfStyles.section, pdfStyles.table]}>
              <Text style={pdfStyles.heading}>
                {strings.drefFormAssistedPopulation}
              </Text>
              <View style={pdfStyles.row}>
                <View style={pdfStyles.cellContent}>
                  <Text>{strings.drefFormTargetedPopulation}</Text>
                </View>
                <View style={pdfStyles.cellContent}>
                  <Text>{strings.drefFormWomen}</Text>
                </View>
                <View style={pdfStyles.cellContent}>
                  <Text>{dref?.women}</Text>
                </View>
                <View style={pdfStyles.cellContent}>
                  <Text>{strings.drefFormMen}</Text>
                </View>
                <View style={pdfStyles.cellContent}>
                  <Text>{dref?.men}</Text>
                </View>
              </View>
              <View style={pdfStyles.row}>
                <View style={pdfStyles.cellContent}>
                  <Text>{strings.drefFormEstimateResponse}</Text>
                </View>
                <View style={pdfStyles.cellContent}>
                  <Text>
                    {strings.drefFormEstimatePeopleDisability}
                  </Text>
                </View>
                <View style={pdfStyles.cellContent}>
                  <Text>{dref?.disability_people_per}</Text>
                </View>
                <View style={pdfStyles.cellContent}>
                  <Text>{strings.drefFormEstimatedPercentage}</Text>
                </View>
                <View style={pdfStyles.cellContent}>
                  <Text>{dref?.people_per_urban}</Text>
                </View>
              </View>
            </View>
            <View style={pdfStyles.textSection}>
              <Text style={pdfStyles.heading}>
                {strings.drefFormObjectiveOperation}
              </Text>
              <Text>{dref?.operation_objective}</Text>
            </View>
            <View style={pdfStyles.textSection}>
              <Text style={pdfStyles.heading}>
                {strings.drefFormSupportServices}
              </Text>
              <Text style={pdfStyles.textLabelSection}>{strings.drefFormHumanResourceDescription}</Text>
              <Text>{dref?.human_resource}</Text>
              <Text style={pdfStyles.textLabelSection}>{strings.drefFormSurgePersonnelDeployed}</Text>
              <Text>{dref?.surge_personnel_deployed}</Text>
              <Text style={pdfStyles.textLabelSection}>{strings.drefFormLogisticCapacityOfNs}</Text>
              <Text>{dref?.logistic_capacity_of_ns}</Text>
              <Text style={pdfStyles.textLabelSection}>{strings.drefFormSafetyConcerns}</Text>
              <Text>{dref?.safety_concerns}</Text>
              <Text style={pdfStyles.textLabelSection}>{strings.drefFormPmerDescription}</Text>
              <Text>{dref?.pmer}</Text>
              <Text style={pdfStyles.textLabelSection}>{strings.drefFormCommunicationDescription}</Text>
              <Text>{dref?.communication}</Text>
            </View>
            <View style={pdfStyles.textSection}>
              <Text style={pdfStyles.heading}>
                {strings.drefFormPlannedIntervention}
              </Text>
              <View style={pdfStyles.row}>
                <PDFImage
                  style={pdfStyles.icon}
                  src={shelter}
                />
                <Text>{'\u2022'} </Text>
                <Text>Shelter, Housing and Settlements</Text>
                <Text>{strings.drefFormPdfBudget}</Text>
                <Text>{strings.drefFormPdfTargetPersons}</Text>
                <Text>{strings.drefFormPdfIndicators}</Text>
                <Text>{strings.drefFormPdfPriorityActions}</Text>
              </View>
            </View>
            <View style={pdfStyles.textSection}>
              <Text style={pdfStyles.heading}>
                {strings.drefFormPdfContactInformation}
              </Text>
              <Text style={pdfStyles.textLabelSection}>{strings.drefFormPdfContactDescription}</Text>

              <Text style={pdfStyles.textLabelSection}>{'\u2022'}  {strings.drefFormNationalSocietyContact}</Text>
              <Text>{dref?.national_society_contact_name}</Text>
              <Text>{dref?.national_society_contact_title}</Text>
              <Text>{dref?.national_society_contact_email}</Text>
              <Text>{dref?.national_society_contact_phone_number}</Text>

              <Text style={pdfStyles.textLabelSection}>{'\u2022'}  {strings.drefFormAppealManager}</Text>
              <Text>{dref?.ifrc_appeal_manager_name}</Text>
              <Text>{dref?.ifrc_appeal_manager_title}</Text>
              <Text>{dref?.ifrc_appeal_manager_email}</Text>
              <Text>{dref?.ifrc_appeal_manager_phone_number}</Text>

              <Text style={pdfStyles.textLabelSection}>{'\u2022'}  {strings.drefFormProjectManager}</Text>
              <Text>{dref?.ifrc_project_manager_name}</Text>
              <Text>{dref?.ifrc_project_manager_title}</Text>
              <Text>{dref?.ifrc_project_manager_email}</Text>
              <Text>{dref?.ifrc_project_manager_phone_number}</Text>

              <Text style={pdfStyles.textLabelSection}>{'\u2022'}  {strings.drefFormIfrcEmergency}</Text>
              <Text>{dref?.ifrc_emergency_name}</Text>
              <Text>{dref?.ifrc_emergency_title}</Text>
              <Text>{dref?.ifrc_emergency_email}</Text>
              <Text>{dref?.ifrc_emergency_phone_number}</Text>

              <Text style={pdfStyles.textLabelSection}>{'\u2022'}  {strings.drefFormMediaContact}</Text>
              <Text>{dref?.media_contact_name}</Text>
              <Text>{dref?.media_contact_title}</Text>
              <Text>{dref?.media_contact_email}</Text>
              <Text>{dref?.media_contact_phone_number}</Text>

              <Text>{strings.drefFormPdfReference}</Text>

            </View>
          </PDFPage>
        </Document>
      </PDFViewer>
    </Page >
  );
}
export default DrefPdfExport;

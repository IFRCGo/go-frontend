import React from 'react';
import type { History, Location } from 'history';
import type { match as Match } from 'react-router-dom';
import { jsPDF } from 'jspdf';

import BlockLoading from '#components/block-loading';
import Container from '#components/Container';
import Page from '#components/Page';

import { useRequest } from '#utils/restRequest';
import { DrefApiFields } from '#views/DrefApplicationForm/common';
import IfrcLogo from '../../../assets/icons/collecticons/ifrclogo.png';

import LanguageContext from '#root/languageContext';
import PrevOprTable from './PrevOprTable';
import { renderToString } from 'react-dom/server';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  match: Match<{ drefId?: string }>;
  history: History;
  location: Location;
}

function DrefPdfExport(props: Props) {
  const {
    className,
    match,
  } = props;
  const { strings } = React.useContext(LanguageContext);

  const { drefId } = match.params;
  const [pdfUrl, setPdfUrl] = React.useState<string | undefined>();
  const addFirstPage = (pdf: jsPDF, value: DrefApiFields) => {
    pdf.setFont('Helvetica-Bold');
    pdf.setTextColor(255, 0, 0);
    pdf.setFontSize(16);
    pdf.addImage(IfrcLogo, 'png', 1, 1.5, 1, 1);
    pdf.text("DREF APPLICATION", 5, 2, {});
    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.setLineHeightFactor(0);
    pdf.text("Country, region | Emergency Name", 5, 3, {}); // to be filled from value
    pdf.addImage(IfrcLogo, 'png', 1, 3.1, 6, 4.5);
    pdf.setFontSize(11);
    pdf.setFont('Helvetica');
    pdf.text(strings.drefFormAppealCode, 1, 8);
    pdf.text('Dref Allocated:', 3, 8);
    pdf.text(strings.drefFormGlideNum, 1, 9);
    pdf.text(strings.drefFormPdfPeopleAffected, 3, 8.5);
    pdf.text(strings.drefFormPdfPeopleAssisted, 6, 8.5);
    pdf.text(strings.drefFormPdfDrefLaunched, 3, 9);
    pdf.text(strings.drefFormPdfDrefEnds, 5, 9);
    pdf.text(strings.drefFormOperationTimeframeSubmission, 6, 9);
    pdf.text(strings.drefFormPdfAffectedAreas, 3, 9.5);
    pdf.setFontSize(12);
    pdf.setFont('Helvetica-Bold');
    pdf.text(value.appeal_code, 1, 8.2); // appeal no
    pdf.text(' ', 3, 8.2); //dref alloation
    pdf.text(value.glide_code, 1, 9.2); // glide no
    pdf.text(value.people_targeted_with_early_actions + '', 3, 8.7); // affected people
    pdf.text(value.people_assisted, 6, 8.7); // to be assisted
    pdf.text(value.date_of_approval, 3, 9.2); // dref launched
    pdf.text(value.end_date, 5, 9.2); // dref end
    pdf.text(value.operation_timeframe + ' months', 6, 9.2); // dref end - dref launched
  };

  const addSecondPage = (pdf: jsPDF, value: DrefApiFields) => {
    // const str = renderToString(
    // <PrevOprTable
    //   asa={value.affect_same_area}
    //   asp={value.affect_same_population}
    //   nsr={value.ns_respond}
    //   nsrf={value.ns_request_fund}
    //   drt={value.dref_recurrent_text}
    //   ll={value.lessons_learned}
    //   specify=''
    // />);

    pdf.addPage();
    pdf.addImage(IfrcLogo, 'JPEG', 1, 1, 2, 3);
    pdf.setFont('Helvetica-Bold');
    pdf.setTextColor(255, 0, 0);
    pdf.setFontSize(16);
    pdf.text(strings.drefFormPdfDrescriptionOfTheEvent, 3.5, 1.2);
    pdf.setTextColor(0);
    pdf.setFontSize(14);
    pdf.text(strings.drefFormWhatWhereWhen, 3.5, 1.6);
    pdf.text(strings.drefFormScopeAndScaleEvent, 3.5, 2);
    pdf.setFontSize(12);
    pdf.text(value.event_scope, 3.5, 2.2);
    // pdf.html(str);
  };

  const addThirdPage = (pdf: jsPDF, value: DrefApiFields) => {
    pdf.addPage();
    pdf.setFont('Helvetica-Bold');
    pdf.setTextColor(255, 0, 0);
    pdf.setFontSize(16);
    pdf.text(strings.drefFormPreviousOperations, 1, 1);
    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.text(strings.drefFormAffectSameArea, 1, 2);
    pdf.text(value.affect_same_area + '', 5, 2);
    pdf.text(strings.drefFormAffectedthePopulationTitle, 1, 2.2);
    pdf.text(value.affect_same_population_text + '', 5, 2.2);
    pdf.text(strings.drefFormNsRespond, 1, 2.4);
    pdf.text(value.ns_respond + '', 5, 2.4);
    pdf.text(strings.drefFormNsRequest, 1, 2.6);
    pdf.text(value.ns_request_fund + '', 5, 2.6);
    pdf.text(strings.drefFormRecurrentText, 1, 2.8);
    pdf.text(value.dref_recurrent_text, 5, 2.8);
    pdf.text(strings.drefFormLessonsLearnedTitle, 1, 3);
    pdf.text(strings.drefFormLessonsLearnedDescription, 1, 3.2);
    pdf.text(value.lessons_learned, 5, 3);
    // Add auto table here
  };
  const { pending } = useRequest<DrefApiFields>({
    skip: !drefId,
    url: `api/v2/dref/${drefId}/`,
    onSuccess: (response) => {
      const responseKeys = Object.keys(response) as (keyof (typeof response))[];
      const pdfTextList: string[] = [];
      responseKeys.forEach((key) => {
        pdfTextList.push(key);
        pdfTextList.push(JSON.stringify(response[key]));
      });

      const pageWidth = 8.3;
      const pageHeight = 11.7;
      const lineHeight = 1.5;
      const pdf = new jsPDF({
        orientation: "portrait",
        format: [pageWidth, pageHeight],
        unit: "in",
      });

      // pdf.setTextColor(255, 0, 0);
      // pdf.setFont('Montserrat');
      // pdf.text(strings.drefFormPdfTitle, 7, 1, { align: 'right' });
      // pdf.setTextColor('#000000');
      // pdf.text(response.country_district[0].country + '|' + response.country_district[0].district + '|' + response.ifrc_emergency_name, 7, 2);
      // // pdf.addImage(response.event_map_details.file, 'png', 1, 3, 40, 30);
      // pdf.text(strings.drefFormAppealCode, 1, 3);
      // // pdf.text(response.appeal_code, 7, 4);
      // pdf.text(strings.drefFormGlideNum, 1, 4);
      // pdf.text(response.glide_code, 2, 4);
      // pdf.text(strings.drefFormPdfPeopleAffected, 1, 5);
      // pdf.text(strings.drefFormPdfPeopleAssisted, 1, 6);
      // pdf.text(response.people_assisted, 2, 2);
      // pdf.text(strings.drefFormPdfDrefLaunched, 1, 7);
      // pdf.text(response.date_of_approval, 2, 3);
      // pdf.text(strings.drefFormPdfDrefEnds, 1, 8);
      // pdf.text(response.end_date, 2, 4);
      // pdf.text(strings.drefFormOperationTimeframeSubmission, 1, 9);
      // // pdf.text(response.operation_timeframe, 2, 5);
      // pdf.text(strings.drefFormPdfAffectedAreas, 1, 10);
      // // pdf.text(response.affect_same_area,2,6);
      // pdf.text(strings.drefFormPdfDrescriptionOfTheEvent, 1, 11);
      // pdf.text(strings.drefFormWhatWhereWhen, 1, 12);
      // pdf.text(strings.drefFormScopeAndScaleEvent, 1, 13);
      // pdf.text(response.event_scope, 2, 4);
      // pdf.text(strings.drefFormPreviousOperations, 1, 14);
      // pdf.text(strings., 1, 15);
      // // pdf.text(response.affect_same_drefFormAffectSameAreapopulation, 2, 5);
      // pdf.text(strings.drefFormAffectedthePopulationTitle, 1, 16);
      // // pdf.text(response.affect_same_population_text, 2, 7);
      // pdf.text(strings.drefFormNsRespond, 1, 17);
      // // pdf.text(response.ns_respond,2,7);
      // // pdf.text(response.ns_request_fund,2,8);
      // pdf.text(strings.drefFormNsRequest, 1, 18);
      // pdf.text(strings.drefFormRecurrentText, 1, 19);
      // pdf.text(response.dref_recurrent_text, 2, 8);
      // pdf.text(strings.drefFormLessonsLearnedTitle, 1, 20);
      // pdf.text(strings.drefFormLessonsLearnedDescription, 1, 21);
      // // pdf.text(response.lessons_learned,2,9);
      // pdf.text(strings.drefFormPdfCurrentNationalSocietyAction, 1, 22);
      // pdf.text(strings.drefFormPdfMovementPartnersActions, 1, 23);
      // pdf.text(strings.drefFormIfrc, 1, 22);
      // pdf.text(response.ifrc, 2, 10);
      // pdf.text(strings.drefFormIcrc, 1, 23);
      // pdf.text(response.icrc, 2, 11);
      // pdf.text(response.partner_national_society, 2, 9);
      // pdf.text(strings.drefFormNationalOtherActors, 1, 24);
      // pdf.text(strings.drefFormInternationalAssistance, 1, 25);
      // // pdf.text(response.government_requested_assistance, 2, 12);
      // pdf.text(strings.drefFormNationalAuthorities, 1, 26);
      // pdf.text(response.national_authorities, 2, 10);
      // pdf.text(response.un_or_other_actor, 2, 12);
      // pdf.text(strings.drefFormCoordinationMechanism, 1, 27);
      // pdf.text(response.major_coordination_mechanism, 2, 13);
      // pdf.text(strings.drefFormPdfNeedsGapsIdentified, 1, 27);
      // pdf.text(strings.drefFormTargetingStrategy, 1, 28);
      // pdf.text(strings.drefFormPeopleAssistedthroughOperation, 1, 29);
      // pdf.text(response.people_assisted, 2, 14);
      // pdf.text(strings.drefFormSelectionCriteria, 1, 30);
      // // pdf.text(response.drefFormSelectionCriteria,2,15);
      // pdf.text(strings.drefFormProtectionGenderAndInclusion, 1, 31);
      // pdf.text(response.entity_affected, 2, 16);
      // pdf.text(strings.drefFormTargetedPopulation, 1, 32);
      // pdf.text(strings.drefFormWomen, 1, 33);
      // // pdf.text(response.women, 2, 17);
      // pdf.text(strings.drefFormMen, 1, 32);
      // // pdf.text(response.men, 2, 18);
      // pdf.text(strings.drefFormGirls, 1, 33);
      // // pdf.text(response.girls,2,19);
      // pdf.text(strings.drefFormBoys, 1, 34);
      // // pdf.text(response.boys,2,20);
      // pdf.text(strings.drefFormTargetedPopulation, 1, 35);
      // // pdf.text(response.total_targated_population, 2, 21);
      // pdf.text(strings.drefFormEstimatePeopleDisability, 1, 36);
      // // pdf.text(response.drefFormEstimatePeopleDisability, 2, 22);
      // pdf.text(strings.drefFormEstimatedUrban, 1, 37);
      // // pdf.text(response.drefFormEstimatedUrban,2,23);
      // pdf.text(strings.drefFormEstimatedDisplacedPeople, 1, 38);
      // // pdf.text(response.displaced_people, 2, 24);
      // pdf.text(strings.drefFormObjectiveOperation, 1, 39);
      // pdf.text(response.operation_objective, 2, 26);
      // pdf.text(strings.drefFormResponseRationale, 1, 40);
      // pdf.text(response.response_strategy, 2, 25);
      // pdf.text(strings.drefFormPdfAboutSupportSurvices, 1, 41);
      // pdf.text(strings.drefFormHumanResourceDescription, 1, 42);
      // pdf.text(response.human_resource, 2, 26);
      // pdf.text(strings.drefFormSurgePersonnelDeployed, 1, 43);
      // pdf.text(response.surge_personnel_deployed, 2, 27);
      // pdf.text(strings.drefFormSafetyConcerns, 1, 44);
      // pdf.text(response.safety_concerns, 2, 28);
      // pdf.text(strings.drefFormPmerDescription, 1, 45);
      // pdf.text(response.pmer, 2, 29);
      // pdf.text(strings.drefFormCommunicationDescription, 1, 46);
      // pdf.text(response.communication, 2, 30);
      // pdf.text(strings.drefFormPlannedIntervention, 1, 47);
      // pdf.text(strings.drefFormPdfContactInformation, 1, 49);
      // pdf.text(strings.drefFormNationalSocietyContact, 1, 50);
      // pdf.text(response.national_society_contact_name, 2, 31);
      // pdf.text(response.national_society_contact_email, 2, 32);
      // // pdf.text(response.national_society_contact_phone_number, 2, 33);
      // pdf.text(strings.drefFormAppealManager, 1, 51);
      // pdf.text(response.ifrc_appeal_manager_name, 2, 34);
      // pdf.text(response.ifrc_appeal_manager_email, 2, 35);
      // // pdf.text(response.ifrc_appeal_manager_phone_number, 2, 36);
      // // pdf.text(strings.drefFormProjectManager, 1, 52);
      // // pdf.text(response.ifrc_project_manager_name, 2, 37);
      // // pdf.text(response.ifrc_project_manager_email, 2, 38);
      // // pdf.text(response.ifrc_project_manager_phone_number, 2, 39);
      // // pdf.text(strings.drefFormIfrcEmergency, 1, 53);
      // // pdf.text(response.ifrc_emergency_name, 2, 40);
      // // pdf.text(response.ifrc_emergency_email, 2, 41);
      // // pdf.text(response.ifrc_emergency_phone_number, 2, 42);
      // // pdf.text(strings.drefFormMediaContact, 1, 54);
      // // pdf.text(response.media_contact_name, 2, 43);
      // // pdf.text(response.media_contact_email, 2, 44);
      // // pdf.text(response.media_contact_phone_number, 2, 45);


      pdf.addImage('../../../assets/icons/collecticons/ifrclogo.png', 'png', 10, 10, 50, 50);
      // const margin = 1.5;
      // const maxLineWidth = pageWidth - (margin * 2);
      // const ppi = 72;
      // const fontSize = 11;

      // let vOffset = margin;
      // const pageBreak = 30;

      // pdf.setFontSize(fontSize);
      // pdfTextList.forEach((text, i) => {
      //   if (((i + 1) % 2) === 0) {
      //     pdf.setTextColor('#000000');
      //   } else {
      //     pdf.setTextColor('#f5333f');
      //   }

      //   const textLines = pdf.splitTextToSize(text, maxLineWidth);
      //   pdf.text(textLines, margin, vOffset);

      //   if ((i + 1) % pageBreak === 0) {
      //     pdf.addPage();
      //     vOffset = margin;
      //   } else {
      //     vOffset += (textLines.length * fontSize * lineHeight) / ppi;
      //   }

      //   if (((i + 1) % 2) === 0) {
      //     vOffset += fontSize / ppi;
      //   }
      // });
      addFirstPage(pdf, response);
      addSecondPage(pdf, response);
      addThirdPage(pdf, response);
      var blobPDF = new Blob([pdf.output()], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blobPDF));
    },
  });

  return (
    <Page
      className={className}
      heading="DREF Export"
    >
      {pending ? (
        <Container>
          <BlockLoading />
        </Container>
      ) : (
        <Container>
          <iframe
            className={styles.pdfPreview}
            src={pdfUrl}
          />
        </Container>
      )}
    </Page>
  );
}

export default DrefPdfExport;

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
    pdf.setTextColor('#ed1b2e');
    pdf.setFontSize(20);
    pdf.addImage(IfrcLogo, 'png', 1, 0.5, 1, 1);
    pdf.text(strings.drefFormPdfTitle, 4, 1.5, {});
    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.setLineHeightFactor(0);
    pdf.text(value.country_district[0].country + '|' + value.country_district[0].district + '|' + value.ifrc_emergency_name, 6, 2);
    // pdf.addImage(value.event_map_details.file, 'png', 1, 3, 40, 30);
    pdf.addImage(IfrcLogo, 'png', 1, 2.5, 6, 4.5);
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
    pdf.text(value.lessons_learned, 5, 3.2);
    pdf.setFont('Helvetica-Bold');
    pdf.setTextColor(255, 0, 0);
    pdf.setFontSize(16);
    pdf.text(strings.drefFormPdfCurrentNationalSocietyAction, 1, 4);
    pdf.text(strings.drefFormPdfMovementPartnersActions, 1, 5);
    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.text(strings.drefFormIfrc, 1, 5.2);
    pdf.text(value.ifrc, 5, 5.2);
    pdf.text(strings.drefFormIcrc, 1, 5.4);
    pdf.text(value.icrc, 5, 5.4);
    pdf.text(strings.drefFormPartnerNationalSociety, 1, 5.6);
    pdf.text(value.partner_national_society, 5, 5.6);

    pdf.text(strings.drefFormNationalOtherActors, 1, 5.8);

    pdf.text(strings.drefFormInternationalAssistance + '', 1, 6);
    pdf.text(value.government_requested_assistance + '', 5, 6);
    pdf.text(strings.drefFormNationalAuthorities, 1, 6.2);
    pdf.text(value.national_authorities, 5, 6.2);
    pdf.text(strings.drefFormCoordinationMechanism, 1, 6.4);
    pdf.text(value.major_coordination_mechanism, 5, 6.4);
  };

  const addFourthPage = (pdf: jsPDF, value: DrefApiFields) => {
    pdf.addPage();
    pdf.setFont('Helvetica-Bold');
    pdf.setTextColor(255, 0, 0);
    pdf.setFontSize(16);
    pdf.text(strings.drefFormPdfNeedsGapsIdentified, 1, 1);
    pdf.setTextColor(0);
    pdf.setFontSize(12);
  };

  const addFifthPage = (pdf: jsPDF, value: DrefApiFields) => {
    pdf.addPage();
    pdf.setFont('Helvetica-Bold');
    pdf.setTextColor(255, 0, 0);
    pdf.setFontSize(16);
    pdf.text(strings.drefFormTargetingStrategy, 1, 1);
    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.text(strings.drefFormPeopleAssistedthroughOperation, 1, 1.4);
    pdf.text(value.people_assisted, 1, 1.6);
    pdf.text(strings.drefFormSelectionCriteria, 1, 1.8);
    pdf.text(value.selection_criteria, 1, 2);
    pdf.text(strings.drefFormProtectionGenderAndInclusion, 1, 2.2);
    pdf.text(value.entity_affected, 1, 2.4);
    pdf.setFont('Helvetica-Bold');
    pdf.setTextColor(255, 0, 0);
    pdf.setFontSize(16);
    pdf.text(strings.drefFormTargetedPopulation, 1, 3);
    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.text(strings.drefFormTargetedPopulation, 1, 3.4);
    pdf.text(strings.drefFormWomen, 3, 3.4);
    pdf.text(value.women + '', 4.5, 3.4);
    pdf.text(strings.drefFormMen, 5.5, 3.4);
    pdf.text(value.men + '', 7, 3.4);
    pdf.text(strings.drefFormGirls, 3, 3.8);
    pdf.text(value.girls + '', 4.5, 3.8);
    pdf.text(strings.drefFormBoys, 5.5, 3.8);
    pdf.text(value.boys + '', 7, 3.8);
    pdf.text(strings.drefFormTotal, 3, 4.2);
    pdf.text(value.total_targated_population + '', 4.5, 4.2);
    pdf.text(strings.drefFormEstimatePeopleDisability, 3, 4.6);
    pdf.text(value.disability_people_per + '', 6.5, 4.6);
    pdf.text(strings.drefFormEstimatedUrban, 3, 4.8);
    pdf.text(value.people_per_urban + '', 6.5, 4.8);
    pdf.text(strings.drefFormEstimatedLocal, 3, 5);
    pdf.text(value.people_per_local + '', 6.5, 5);
    pdf.text(strings.drefFormEstimatedDisplacedPeople, 3, 5.2);
    pdf.text(value.displaced_people + '', 6.5, 5.2);
    pdf.setFont('Helvetica-Bold');
    pdf.setTextColor(255, 0, 0);
    pdf.setFontSize(16);
    pdf.text(strings.drefFormObjectiveOperation, 1, 6);
    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.text(value.operation_objective, 1, 6.5);
    pdf.setFont('Helvetica-Bold');
    pdf.setTextColor(255, 0, 0);
    pdf.setFontSize(16);
    pdf.text(strings.drefFormResponseRationale, 1, 7);
    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.text(value.response_strategy, 1, 7.5);
    pdf.setFont('Helvetica-Bold');
    pdf.setTextColor(255, 0, 0);
    pdf.setFontSize(16);
    pdf.text(strings.drefFormPdfAboutSupportSurvices, 1, 8);
    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.text(strings.drefFormHumanResourceDescription, 1, 8.4);
    pdf.text(value.human_resource, 1, 8.6);
    pdf.text(strings.drefFormSurgePersonnelDeployed, 1, 8.8);
    pdf.text(value.surge_personnel_deployed, 1, 9);
    pdf.text(strings.drefFormLogisticCapacityOfNs, 1, 9.2);
    pdf.text(value.logistic_capacity_of_ns, 1, 9.4);
    pdf.text(strings.drefFormSafetyConcerns, 1, 9.6);
    pdf.text(value.safety_concerns, 1, 9.8);
  };

  const addSixthPage = (pdf: jsPDF, value: DrefApiFields) => {
    pdf.addPage();
    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.text(strings.drefFormPmerDescription, 1, 1);
    pdf.text(value.pmer, 1, 1.2);
    pdf.text(strings.drefFormCommunicationDescription, 1, 1.4);
    pdf.text(value.communication, 1, 1.6);
    pdf.setFont('Helvetica-Bold');
    pdf.setTextColor(255, 0, 0);
    pdf.setFontSize(16);
    pdf.text(strings.drefFormPlannedIntervention, 1, 2.2);
  };

  const addSeventhPage = (pdf: jsPDF, value: DrefApiFields) => {
    pdf.addPage();
  };

  const addEighthPage = (pdf: jsPDF, value: DrefApiFields) => {
    pdf.addPage();
    pdf.setFont('Helvetica-Bold');
    pdf.setTextColor(255, 0, 0);
    pdf.setFontSize(16);
    pdf.text(strings.drefFormPdfContactInformation, 1, 1);
    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.text(strings.drefFormNationalSocietyContact, 1, 1.2);
    pdf.text(value.national_society_contact_name, 1, 1.4);
    pdf.text(value.national_society_contact_email, 1, 1.6);
    pdf.text(value.national_society_contact_phone_number, 1, 1.8);
    pdf.text(strings.drefFormAppealManager, 1, 2.2);
    pdf.text(value.ifrc_appeal_manager_name, 1, 2.4);
    pdf.text(value.ifrc_appeal_manager_email, 1, 2.6);
    pdf.text(value.ifrc_appeal_manager_phone_number, 1, 2.8);
    pdf.text(strings.drefFormProjectManager, 1, 3.2);
    pdf.text(value.ifrc_project_manager_name, 1, 3.4);
    pdf.text(value.ifrc_project_manager_email, 1, 3.6);
    pdf.text(value.ifrc_project_manager_phone_number, 1, 3.8);
    pdf.text(strings.drefFormIfrcEmergency, 1, 4.2);
    pdf.text(value.ifrc_emergency_name, 1, 4.4);
    pdf.text(value.ifrc_emergency_email, 1, 4.6);
    pdf.text(value.ifrc_emergency_phone_number, 1, 4.8);
    pdf.text(strings.drefFormMediaContact, 1, 5.2);
    pdf.text(value.media_contact_name, 1, 5.4);
    pdf.text(value.media_contact_email, 1, 5.6);
    pdf.text(value.media_contact_phone_number, 1, 5.8);
    pdf.text(strings.drefFormPdfReference, 1, 6.2);
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
      // pdf.text(strings.drefFormTargetingStrategy, 1, 28);
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
      addFourthPage(pdf, response);
      addFifthPage(pdf, response);
      addSixthPage(pdf, response);
      addEighthPage(pdf, response);
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

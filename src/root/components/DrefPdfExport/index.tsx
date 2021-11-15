import React, { useEffect } from 'react';
import type { History, Location } from 'history';
import type { match as Match } from 'react-router-dom';
import { jsPDF } from 'jspdf';

import BlockLoading from '#components/block-loading';
import Container from '#components/Container';
import Page from '#components/Page';

import { useRequest } from '#utils/restRequest';
import { DrefApiFields } from '#views/DrefApplicationForm/common';

import LanguageContext from '#root/languageContext';
import ifrcLogo from './ifrc_logo.png';
import { CountryMini, DistrictMini } from '#types/country';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  match: Match<{ drefId?: string }>;
  history: History;
  location: Location;
}

function DrefPdfExport(props: Props) {
  const FONT_FAMILY = 'Helvetica-Bold';
  const FONT_SIZE_DREF_HEADING = 20;
  const FONT_SIZE_HEADING = 16;
  const FONT_SIZE_lABEL = 12;
  const FONT_SIZE_SMALL_LABEL = 11;
  const FONT_MID_LABEL = 14;
  const TEXT_COLOR = '#FF0000';
  const TEXT_COLOR_LABEL = '#000';
  const BASE_MARGIN = 1;
  const LINE_GAP = 0.2;
  const SECTION_GAP = 0.2;
  const SECTION_NUMBER = 0;
  const SECTION_NUMBER_HEADING = 1;
  const SECTION_NUMBER_HEADING2 = 2;
  const SECTION_NUMBER_HEADING3 = 3;
  const SECTION_NUMBER_HEADING4 = 4;

  const {
    className,
    match,
  } = props;
  const { strings } = React.useContext(LanguageContext);

  const { drefId } = match.params;
  const [pdfUrl, setPdfUrl] = React.useState<string | undefined>();
  const addFirstPage = async (pdf: jsPDF, value: DrefApiFields) => {
    var img = new Image();
    img.src = ifrcLogo;
    pdf.setFont(FONT_FAMILY);
    pdf.setTextColor(TEXT_COLOR);
    pdf.setFontSize(FONT_SIZE_DREF_HEADING);
    pdf.addImage(img, 'png', 1, 0.5, 1, 1);
    pdf.text(strings.drefFormPdfTitle, 5, 1.5, {});
    pdf.setTextColor(TEXT_COLOR_LABEL);
    pdf.setFontSize(FONT_SIZE_lABEL);
    pdf.setLineHeightFactor(0);
    pdf.text(`${countriesResponse?.name + ''}, ${districtsResponse?.name + ''} | ${value.ifrc_emergency_name + ''}`, 5, 2);
    if (imageResponse && imageResponse.blob())
      pdf.addImage(imageResponse.blob(), 'png', 1, 2.5, 6.5, 4.5);
    pdf.addImage(ifrcLogo, 'png', 1, 2.5, 6.5, 4.5);
    pdf.setFontSize(FONT_SIZE_SMALL_LABEL);
    pdf.setFont(FONT_FAMILY);
    pdf.text(strings.drefFormPdfAppealNum, 1, 8);
    pdf.text(strings.drefFormPdfDrefAllocated, 3, 8);
    pdf.text(strings.drefFormPdfGlideNum, 1, 9);
    pdf.text(strings.drefFormPdfPeopleAffected, 3, 8.5);
    pdf.text(strings.drefFormPdfPeopleAssisted, 5, 8.5);
    pdf.text(strings.drefFormPdfDrefLaunched, 3, 9);
    pdf.text(strings.drefFormPdfDrefEnds, 5, 9);
    pdf.text(strings.drefFormOperationTimeframeSubmission, 6, 9);
    pdf.text(strings.drefFormPdfAffectedAreas, 3, 9.5);
    pdf.setFontSize(FONT_SIZE_lABEL);
    pdf.setFont(FONT_FAMILY);
    pdf.text(value.appeal_code + '', 1, 8.2);
    pdf.text(value.budget_file + '', 3, 8.2);
    pdf.text(value.glide_code + '', 1, 9.2);
    pdf.text(value.people_targeted_with_early_actions + '', 3, 8.7);
    pdf.text(value.people_assisted + '', 5, 8.7);
    pdf.text(value.date_of_approval + '', 3, 9.2);
    pdf.text(value.end_date + '', 5, 9.2);
    pdf.text(value.operation_timeframe + '' + ' months', 6, 9.2);
  };

  const addSecondPage = (pdf: jsPDF, value: DrefApiFields) => {

    pdf.addPage();
    pdf.addImage(ifrcLogo, 'JPEG', 1, 1, 2, 3);
    pdf.setFont(FONT_FAMILY);
    pdf.setTextColor(TEXT_COLOR);
    pdf.setFontSize(FONT_SIZE_HEADING);
    pdf.text(strings.drefFormPdfDrescriptionOfTheEvent, 3.5, 1.2);
    pdf.setTextColor(TEXT_COLOR_LABEL);
    pdf.setFontSize(FONT_MID_LABEL);
    pdf.text(strings.drefFormWhatWhereWhen, 3.5, 1.6);
    pdf.text(strings.drefFormScopeAndScaleEvent, 3.5, 2);
    pdf.setFontSize(FONT_SIZE_lABEL);
    var para = pdf.splitTextToSize(value.event_scope + '', 4);
    pdf.text(para, 3.5, 2.2);
  };

  const addThirdPage = (pdf: jsPDF, value: DrefApiFields) => {
    pdf.addPage();
    pdf.setFont(FONT_FAMILY);
    pdf.setTextColor(TEXT_COLOR);
    pdf.setFontSize(FONT_SIZE_HEADING);
    pdf.text(strings.drefFormPreviousOperations, 1, 1);
    pdf.setTextColor(TEXT_COLOR_LABEL);
    pdf.setFontSize(FONT_SIZE_lABEL);
    pdf.text(strings.drefFormAffectSameArea, 1, 2);
    pdf.text(value.affect_same_area + '', 5, 2);
    pdf.text(strings.drefFormAffectedthePopulationTitle, 1, 2.2);
    pdf.text(value.affect_same_population + '', 5, 2.2);
    pdf.text(strings.drefFormNsRespond, 1, 2.4);
    pdf.text(value.ns_respond + '', 5, 2.4);
    pdf.text(strings.drefFormNsRequest, 1, 2.6);
    pdf.text(value.ns_request_fund + '', 5, 2.6);
    var para = pdf.splitTextToSize(strings.drefFormRecurrentText, 3.5);
    pdf.text(para, 1, 2.8);
    var para = pdf.splitTextToSize(value.dref_recurrent_text + '', 3);
    pdf.text(para, 5, 2.8);
    pdf.text(strings.drefFormLessonsLearnedTitle, 1, 3.4);
    var para = pdf.splitTextToSize(strings.drefFormLessonsLearnedDescription, 3.5);
    pdf.text(para, 1, 3.6);
    var para = pdf.splitTextToSize(value.lessons_learned + '', 3);
    pdf.text(para, 5, 3.6);
    pdf.setFont(FONT_FAMILY);
    pdf.setTextColor(TEXT_COLOR);
    pdf.setFontSize(FONT_SIZE_HEADING);
    pdf.text(strings.drefFormPdfCurrentNationalSocietyAction, 1, 5);
    pdf.setTextColor(TEXT_COLOR_LABEL);
    pdf.setFontSize(FONT_SIZE_lABEL);
    value.national_society_actions.forEach((a, i) => {
      pdf.text(a.title.replaceAll('_', ' ') + '', 1, 5.2 + (i + 1) * 0.2);
    });
    pdf.setFont(FONT_FAMILY);
    pdf.setTextColor(TEXT_COLOR);
    pdf.setFontSize(FONT_SIZE_HEADING);
    pdf.text(strings.drefFormPdfMovementPartnersActions, 1, 8);
    pdf.setTextColor(TEXT_COLOR_LABEL);
    pdf.setFontSize(FONT_SIZE_lABEL);
    pdf.text(strings.drefFormIfrc, 1, 8.5);
    var para = pdf.splitTextToSize(value.ifrc + '', 3);
    pdf.text(para, 5, 8.5);
    pdf.text(strings.drefFormIcrc, 1, 9);
    var para = pdf.splitTextToSize(value.icrc + '', 3);
    pdf.text(para, 5, 9);
    pdf.text(strings.drefFormPartnerNationalSociety, 1, 9.5);
    var para = pdf.splitTextToSize(value.partner_national_society + '', 3);
    pdf.text(para, 5, 9.5);
  };

  const addFourthPage = (pdf: jsPDF, value: DrefApiFields) => {
    pdf.addPage();
    pdf.setFont(FONT_FAMILY);
    pdf.setTextColor(TEXT_COLOR);
    pdf.setFontSize(FONT_SIZE_HEADING);
    pdf.text(strings.drefFormNationalOtherActors, 1, 1);
    pdf.setTextColor(TEXT_COLOR_LABEL);
    pdf.setFontSize(FONT_SIZE_lABEL);
    pdf.text(strings.drefFormInternationalAssistance + '', 1, 1.5);
    var para = pdf.splitTextToSize(value.government_requested_assistance + '', 3);
    pdf.text(para, 5, 1.5);
    pdf.text(strings.drefFormNationalAuthorities, 1, 2);
    var para = pdf.splitTextToSize(value.national_authorities + '', 3);
    pdf.text(para, 5, 2);
    pdf.text(strings.drefFormCoordinationMechanism, 1, 2.5);
    var para = pdf.splitTextToSize(value.major_coordination_mechanism + '', 3);
    pdf.text(para, 5, 2.5);

    pdf.setFont(FONT_FAMILY);
    pdf.setTextColor(TEXT_COLOR);
    pdf.setFontSize(FONT_SIZE_HEADING);
    pdf.text(strings.drefFormPdfNeedsGapsIdentified, 1, 3.5);
    pdf.setTextColor(TEXT_COLOR_LABEL);
    pdf.setFontSize(FONT_SIZE_lABEL);
    value.needs_identified.forEach((a, i) => {
      pdf.text(a.title.replaceAll('_', ' ') + '', 1, 3.5 + (i + 1) * 0.4);
      pdf.text(a.description, 4, 3.5 + (i + 1) * 0.4);
    });
  };

  const addFifthPage = (pdf: jsPDF, value: DrefApiFields) => {
    pdf.addPage();
    pdf.setFont(FONT_FAMILY);
    pdf.setTextColor(TEXT_COLOR);
    pdf.setFontSize(FONT_SIZE_HEADING);
    pdf.text(strings.drefFormTargetingStrategy, 1, 1);
    pdf.setTextColor(TEXT_COLOR_LABEL);
    pdf.setFontSize(FONT_SIZE_lABEL);
    pdf.text(strings.drefFormPeopleAssistedthroughOperation, 1, 1.4);
    var para = pdf.splitTextToSize(value.people_assisted + '', 6.5);
    pdf.text(para, 1, 1.6);
    pdf.text(strings.drefFormSelectionCriteria, 1, 2);
    var para = pdf.splitTextToSize(value.selection_criteria + '', 6.5);
    pdf.text(para, 1, 2.2);
    var para = pdf.splitTextToSize(strings.drefFormProtectionGenderAndInclusion, 6.5);
    pdf.text(para, 1, 2.6);
    var para = pdf.splitTextToSize(value.entity_affected + '', 6.5);
    pdf.text(para, 1, 3);
    pdf.setFont(FONT_FAMILY);
    pdf.setTextColor(TEXT_COLOR);
    pdf.setFontSize(FONT_SIZE_HEADING);

    pdf.text(strings.drefFormTargetedPopulation, 1, 4);
    pdf.setTextColor(TEXT_COLOR_LABEL);
    pdf.setFontSize(FONT_SIZE_lABEL);
    pdf.text(strings.drefFormTargetedPopulation, 1, 4.4);
    pdf.text(strings.drefFormWomen, 3, 4.4);
    pdf.text(value.women + '', 4.5, 4.4);
    pdf.text(strings.drefFormMen, 5.5, 4.4);
    pdf.text(value.men + '', 7, 4.4);
    pdf.text(strings.drefFormGirls, 3, 4.6);
    pdf.text(value.girls + '', 4.5, 4.6);
    pdf.text(strings.drefFormBoys, 5.5, 4.6);
    pdf.text(value.boys + '', 7, 4.6);
    pdf.text(strings.drefFormTotal, 3, 4.8);
    pdf.text(value.total_targated_population + '', 4.5, 4.8);
    pdf.text(strings.drefFormEstimatePeopleDisability, 3, 5);
    pdf.text(value.disability_people_per + '', 6.5, 5);
    pdf.text(strings.drefFormEstimatedUrban, 3, 5.2);
    pdf.text(value.people_per_urban + '', 6.5, 5.2);
    pdf.text(strings.drefFormEstimatedLocal, 3, 5.4);
    pdf.text(value.people_per_local + '', 6.5, 5.4);
    pdf.text(strings.drefFormEstimatedDisplacedPeople, 3, 5.6);
    pdf.text(value.displaced_people + '', 6.5, 5.6);
    pdf.setFont(FONT_FAMILY);
    pdf.setTextColor(TEXT_COLOR);
    pdf.setFontSize(FONT_SIZE_HEADING);

    pdf.text(strings.drefFormObjectiveOperation, 1, 6.5);
    pdf.setTextColor(TEXT_COLOR_LABEL);
    pdf.setFontSize(FONT_SIZE_lABEL);
    pdf.text(value.operation_objective + '', 1, 7);
    pdf.setFont(FONT_FAMILY);
    pdf.setTextColor(TEXT_COLOR);
    pdf.setFontSize(FONT_SIZE_HEADING);

    pdf.text(strings.drefFormResponseRationale, 1, 7.5);
    pdf.setTextColor(TEXT_COLOR_LABEL);
    pdf.setFontSize(FONT_SIZE_lABEL);
    pdf.text(value.response_strategy + '', 1, 8);
    pdf.setFont(FONT_FAMILY);
    pdf.setTextColor(TEXT_COLOR);
    pdf.setFontSize(FONT_SIZE_HEADING);

    pdf.text(strings.drefFormPdfAboutSupportServices, 1, 8.5);
    pdf.setTextColor(TEXT_COLOR_LABEL);
    pdf.setFontSize(FONT_SIZE_lABEL);
    pdf.text(strings.drefFormHumanResourceDescription, 1, 9);
    var para = pdf.splitTextToSize(value.human_resource + '', 6.3);
    pdf.text(para, 1, 9.2);
    pdf.text(strings.drefFormSurgePersonnelDeployed, 1, 9.6);
    var para = pdf.splitTextToSize(value.surge_personnel_deployed + '', 6.3);
    pdf.text(para, 1, 9.8);
    var para = pdf.splitTextToSize(strings.drefFormLogisticCapacityOfNs, 6.3);
    pdf.text(para, 1, 10.2);
    var para = pdf.splitTextToSize(value.logistic_capacity_of_ns + '', 6.3);
    pdf.text(para, 1, 10.6);
  };

  const addSixthPage = (pdf: jsPDF, value: DrefApiFields) => {
    pdf.addPage();
    pdf.setTextColor(TEXT_COLOR_LABEL);
    pdf.setFontSize(FONT_SIZE_lABEL);
    var para = pdf.splitTextToSize(strings.drefFormSafetyConcerns, 6.3);
    pdf.text(para, 1, 1);
    var para = pdf.splitTextToSize(value.safety_concerns + '', 6.3);
    pdf.text(para, 1, 1.7);
    var para = pdf.splitTextToSize(strings.drefFormPmerDescription, 6.3);
    pdf.text(para, 1, 2.4);
    var para = pdf.splitTextToSize(value.pmer + '', 6.3);
    pdf.text(para, 1, 3.1);
    var para = pdf.splitTextToSize(strings.drefFormCommunicationDescription, 6.3);
    pdf.text(para, 1, 3.8);
    var para = pdf.splitTextToSize(value.communication + '', 6.3);
    pdf.text(para, 1, 4.5);
    pdf.setFont(FONT_FAMILY);
    pdf.setTextColor(TEXT_COLOR);
    pdf.setFontSize(FONT_SIZE_HEADING);

    pdf.text(strings.drefFormPlannedIntervention, 1, 5.5);
    pdf.setTextColor(TEXT_COLOR_LABEL);
    pdf.setFontSize(FONT_SIZE_lABEL);
    value.planned_interventions.forEach((a, i) => {
      pdf.text(a.title.replaceAll('_', ' ') + '', 1, 5.5 + (i + 1) * 1);
      pdf.text(a.indicator, 2.5, 5.7 + (i + 1) * 1);
      pdf.text(a.description, 2.5, 6 + (i + 1) * 1);
      pdf.text(a.budget + '', 6, 6 + (i + 1) * 1);
      pdf.text(strings.drefFormPdfBudget, 4.5, 5.7 + (i + 1) * 1);
      pdf.text(strings.drefFormPdfTargetPersons, 4.5, 6 + (i + 1) * 1);
      pdf.text(strings.drefFormPdfIndicators, 1, 5.7 + (i + 1) * 1);
      pdf.text(strings.drefFormPdfPriorityActions, 1, 6 + (i + 1) * 1);
      pdf.text(a.person_targeted + '', 6, 5.8 + (i + 1) * 1);
    });
  };

  const addEighthPage = (pdf: jsPDF, value: DrefApiFields) => {
    pdf.addPage();
    pdf.setFont(FONT_FAMILY);
    pdf.setTextColor(TEXT_COLOR);
    pdf.setFontSize(FONT_SIZE_HEADING);

    pdf.text(strings.drefFormPdfContactInformation, 1, 1);
    pdf.setTextColor(TEXT_COLOR_LABEL);
    pdf.setFontSize(FONT_SIZE_lABEL);
    pdf.text(strings.drefFormNationalSocietyContact, 1, BASE_MARGIN + 1 * LINE_GAP + SECTION_NUMBER * SECTION_GAP);
    pdf.text(value.national_society_contact_name + '', 1, BASE_MARGIN + 2 * LINE_GAP + SECTION_NUMBER * SECTION_GAP);
    pdf.text(value.national_society_contact_email + '', 1, BASE_MARGIN + 3 * LINE_GAP + SECTION_NUMBER * SECTION_GAP);
    pdf.text(value.national_society_contact_phone_number + '', 1, BASE_MARGIN + 4 * LINE_GAP + SECTION_NUMBER * SECTION_GAP);
    pdf.text(strings.drefFormAppealManager + '', 1, BASE_MARGIN + 5 * LINE_GAP + SECTION_NUMBER_HEADING * SECTION_GAP);
    pdf.text(value.ifrc_appeal_manager_name + '', 1, BASE_MARGIN + 6 * LINE_GAP + SECTION_NUMBER_HEADING * SECTION_GAP);
    pdf.text(value.ifrc_appeal_manager_email + '', 1, BASE_MARGIN + 7 * LINE_GAP + SECTION_NUMBER_HEADING * SECTION_GAP);
    pdf.text(value.ifrc_appeal_manager_phone_number + '', 1, BASE_MARGIN + 8 * LINE_GAP + SECTION_NUMBER_HEADING * SECTION_GAP);
    pdf.text(strings.drefFormProjectManager, 1, BASE_MARGIN + 9 * LINE_GAP + SECTION_NUMBER_HEADING2 * SECTION_GAP);
    pdf.text(value.ifrc_project_manager_name + '', 1, BASE_MARGIN + 10 * LINE_GAP + SECTION_NUMBER_HEADING2 * SECTION_GAP);
    pdf.text(value.ifrc_project_manager_email + '', 1, BASE_MARGIN + 11 * LINE_GAP + SECTION_NUMBER_HEADING2 * SECTION_GAP);
    pdf.text(value.ifrc_project_manager_phone_number + '', 1, BASE_MARGIN + 12 * LINE_GAP + SECTION_NUMBER_HEADING2 * SECTION_GAP);
    pdf.text(strings.drefFormIfrcEmergency, 1, BASE_MARGIN + 13 * LINE_GAP + SECTION_NUMBER_HEADING3 * SECTION_GAP);
    pdf.text(value.ifrc_emergency_name + '', 1, BASE_MARGIN + 14 * LINE_GAP + SECTION_NUMBER_HEADING3 * SECTION_GAP);
    pdf.text(value.ifrc_emergency_email + '', 1, BASE_MARGIN + 15 * LINE_GAP + SECTION_NUMBER_HEADING3 * SECTION_GAP);
    pdf.text(value.ifrc_emergency_phone_number + '', 1, BASE_MARGIN + 16 * LINE_GAP + SECTION_NUMBER_HEADING3 * SECTION_GAP);
    pdf.text(strings.drefFormMediaContact, 1, BASE_MARGIN + 17 * LINE_GAP + SECTION_NUMBER_HEADING4 * SECTION_GAP);
    pdf.text(value.media_contact_name + '', 1, BASE_MARGIN + 18 * LINE_GAP + SECTION_NUMBER_HEADING4 * SECTION_GAP);
    pdf.text(value.media_contact_email + '', 1, BASE_MARGIN + 19 * LINE_GAP + SECTION_NUMBER_HEADING4 * SECTION_GAP);
    pdf.text(value.media_contact_phone_number + '', 1, BASE_MARGIN + 20 * LINE_GAP + SECTION_NUMBER_HEADING4 * SECTION_GAP);
    pdf.text(strings.drefFormPdfReference, 3, BASE_MARGIN + 21 * LINE_GAP + SECTION_NUMBER_HEADING4 * SECTION_GAP);
  };

  const { pending: fetchingDref, response: responseDref } = useRequest<DrefApiFields>({
    skip: !drefId,
    url: `api/v2/dref/${drefId}/`,
  });

  const country = responseDref ? responseDref.country_district[0].country : null;
  const district = responseDref ? responseDref.country_district[0].district : null;
  const fileUrl = (responseDref && responseDref.event_map_details.file) ? responseDref.event_map_details.file : undefined;

  const {
    pending: fetchingCountries,
    response: countriesResponse,
  } = useRequest<CountryMini>({
    url: `api/v2/country/${country}/`,
    skip: !country,
  });

  const {
    pending: fetchingDistricts,
    response: districtsResponse,
  } = useRequest<DistrictMini>({
    skip: !district,
    url: `api/v2/district/${district}/`,
  });

  const {
    pending: fetchImagePending,
    response: imageResponse,
  } = useRequest<any>({
    skip: !fileUrl,
    url: fileUrl,
  });

  const pending = fetchingDref || fetchingCountries || fetchingDistricts || fetchImagePending;
  useEffect(() => {
    if (!pending && responseDref && countriesResponse) {
      const pageWidth = 8.3;
      const pageHeight = 11.7;
      const lineHeight = 1.5;
      const pdf = new jsPDF({
        orientation: "portrait",
        format: [pageWidth, pageHeight],
        unit: "in",
      });
      addFirstPage(pdf, responseDref);
      addSecondPage(pdf, responseDref);
      addThirdPage(pdf, responseDref);
      addFourthPage(pdf, responseDref);
      addFifthPage(pdf, responseDref);
      addSixthPage(pdf, responseDref);
      addEighthPage(pdf, responseDref);
      var blobPDF = new Blob([pdf.output()], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blobPDF));
    }
  }, [pending]);

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

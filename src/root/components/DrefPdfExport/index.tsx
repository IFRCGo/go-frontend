import React from 'react';
import type { History, Location } from 'history';
import {
  randomString,
} from '@togglecorp/fujs';
import {
  PartialForm,
  useForm,
} from '@togglecorp/toggle-form';
import type { match as Match } from 'react-router-dom';

import BlockLoading from '#components/block-loading';
import Container from '#components/Container';
import Page from '#components/Page';
import {
  useRequest,
} from '#utils/restRequest';

import DrefOverview from '#views/DrefApplicationForm/DrefOverview';
import EventDetails from '#views/DrefApplicationForm/EventDetails';
import ActionsFields from '#views/DrefApplicationForm/ActionsFields';
import Response from '#views/DrefApplicationForm/Response';
import Submission from '#views/DrefApplicationForm/Submission';
import {
  DrefFields,
  DrefApiFields,
  ONSET_IMMINENT,
} from '#views/DrefApplicationForm/common';
import useDrefFormOptions, { schema } from '#views/DrefApplicationForm/useDrefFormOptions';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

const defaultFormValues: PartialForm<DrefFields> = {
  country_district: [
    { clientId: randomString() },
  ],
  planned_interventions: [],
  national_society_actions: [],
  needs_identified: [],
};

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

  const { drefId } = match.params;
  const {
    value,
    error,
    onValueChange,
    onValueSet,
  } = useForm(defaultFormValues, schema);

  const {
    countryOptions,
    disasterCategoryOptions,
    disasterTypeOptions,
    fetchingCountries,
    fetchingDisasterTypes,
    fetchingDrefOptions,
    fetchingUserDetails,
    interventionOptions,
    nationalSocietyOptions,
    needOptions,
    nsActionOptions,
    onsetOptions,
    yesNoOptions,
  } = useDrefFormOptions(value);

  const {
    pending: DrefPdfExportPending,
  } = useRequest<DrefApiFields>({
    skip: !drefId,
    url: `api/v2/dref/${drefId}/`,
    onSuccess: (response) => {
      onValueSet({
        ...response,
        country_district: response.country_district?.map((cd) => ({
          ...cd,
          clientId: String(cd.id),
        })),
        planned_interventions: response.planned_interventions?.map((pi) => ({
          ...pi,
          clientId: String(pi.id),
        })),
        national_society_actions: response.national_society_actions?.map((nsa) => ({
          ...nsa,
          clientId: String(nsa.id),
        })),
        needs_identified: response.needs_identified?.map((ni) => ({
          ...ni,
          clientId: String(ni.id),
        })),
      });
    },
  });

  const pending = fetchingCountries
    || fetchingDisasterTypes
    || fetchingDrefOptions
    || fetchingUserDetails
    || DrefPdfExportPending;

  const isImminentOnset = value?.type_of_onset === ONSET_IMMINENT;
  React.useEffect(() => {
    if (drefId && !pending) {
      window.setTimeout(async () => {
        const pageOne = document.getElementById("first");
        const pageTwo = document.getElementById("second");
        const pageThree = document.getElementById("third");
        const pageFour = document.getElementById("fourth");
        const pageFive = document.getElementById("fifth");

        const pdf = new jsPDF({ orientation: "portrait", format: [297, 210], unit: "mm" });

        if (pageOne != null) {
          await html2canvas(pageOne).then((canvas: HTMLCanvasElement) => {
            const pageOneImg = canvas.toDataURL("image/png");
            pdf.addImage(pageOneImg, 'png', 5, 5, 220, 290);
            pdf.addPage();
          });
        }
        if (pageTwo != null) {
          await html2canvas(pageTwo).then((canvas: HTMLCanvasElement) => {
            const pageOneImg = canvas.toDataURL("image/png");
            pdf.addImage(pageOneImg, 'png', 5, 5, 220, 290);
            pdf.addPage();
          });
        }
        if (pageThree != null) {
          await html2canvas(pageThree).then((canvas: HTMLCanvasElement) => {
            const pageOneImg = canvas.toDataURL("image/png");
            pdf.addImage(pageOneImg, 'png', 5, 5, 220, 290);
            pdf.addPage();
          });
        }
        if (pageFour != null) {
          await html2canvas(pageFour).then((canvas: HTMLCanvasElement) => {
            const pageOneImg = canvas.toDataURL("image/png");
            pdf.addImage(pageOneImg, 'png', 5, 5, 220, 290);
            pdf.addPage();
          });
        }
        if (pageFive != null) {
          await html2canvas(pageFive).then((canvas: HTMLCanvasElement) => {
            const pageOneImg = canvas.toDataURL("image/png");
            pdf.addImage(pageOneImg, 'png', 5, 5, 220, 290);
            pdf.addPage();
          });
        }
        const fileName = "dref_application_report#" + drefId + ".pdf";
        pdf.save(fileName);
      }, 0);
    }
  }, [drefId, pending]);

  return (
    <Page
      className={className}
      heading="DREF Application"
    >
      {pending ? (
        <Container>
          <BlockLoading />
        </Container>
      ) : (
        <>
          <div id="first">
            <DrefOverview
              error={error}
              onValueChange={onValueChange}
              value={value}
              yesNoOptions={yesNoOptions}
              disasterTypeOptions={disasterTypeOptions}
              onsetOptions={onsetOptions}
              disasterCategoryOptions={disasterCategoryOptions}
              countryOptions={countryOptions}
              fetchingCountries={fetchingCountries}
              fetchingDisasterTypes={fetchingDisasterTypes}
              nationalSocietyOptions={nationalSocietyOptions}
              fetchingNationalSociety={fetchingCountries}
            />
          </div>
          <div id="second">
            <EventDetails
              isImminentOnset={isImminentOnset}
              error={error}
              onValueChange={onValueChange}
              value={value}
              yesNoOptions={yesNoOptions}
              onValueSet={onValueSet}
            />
          </div>
          <div id="third">
            <ActionsFields
              error={error}
              onValueChange={onValueChange}
              value={value}
              yesNoOptions={yesNoOptions}
              needOptions={needOptions}
              nsActionOptions={nsActionOptions}
            />
          </div>
          <div id="fourth">
            <Response
              interventionOptions={interventionOptions}
              error={error}
              onValueChange={onValueChange}
              value={value}
            />
          </div>
          <div id="fifth">
            <Submission
              error={error}
              onValueChange={onValueChange}
              value={value}
            />
          </div>
        </>
      )}
    </Page>
  );
}

export default DrefPdfExport;

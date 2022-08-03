import React from 'react';
import type { match as Match } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer';
import { isNotDefined } from '@togglecorp/fujs';

import BlockLoading from '#components/block-loading';
import Page from '#components/Page';
import { useRequest } from '#utils/restRequest';
import LanguageContext from '#root/languageContext';
import {
  NumericKeyValuePair,
  StringKeyValuePair,
} from '#types';
import { DrefFinalReportApiFields } from '#views/FinalReportForm/common';
import useAlert from '#hooks/useAlert';
import Container from '#components/Container';
import FinalReportPdfDocument from '#components/FinalReportExport/FinalReportPdfDocument';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  match: Match<{ id?: string }>;
}

interface OperationalUpdateOptions {
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

function FinalReportPdfPreview(props: Props) {
  const alert = useAlert();
  const { strings } = React.useContext(LanguageContext);
  const {
    className,
    match,
  } = props;

  const { id } = match.params;

  const {
    pending: fetchingFinalReport,
    response: finalReportResponse,
  } = useRequest<DrefFinalReportApiFields>({
    skip: !id,
    url: `api/v2/dref-final-report/${id}/`,
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.drefLoadPdfFailureMessage}
          &nbsp;
          <strong>
            {messageForNotification}
          </strong>
        </p>,
        {
          variant: 'danger',
          debugMessage,
        },
      );
    }
  });

  const {
    pending: fetchingDrefOptions,
    response: drefOptions,
  } = useRequest<OperationalUpdateOptions>({
    skip: !id,
    url: 'api/v2/dref-options/',
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.drefLoadPdfFailureMessage}
          &nbsp;
          <strong>
            {messageForNotification}
          </strong>
        </p>,
        {
          variant: 'danger',
          debugMessage,
        },
      );
    },
  });

  const pending = fetchingFinalReport || fetchingDrefOptions;

  const failedToLoadPdf = !pending && isNotDefined(id);

  const pdfLoadingStatus = () => {
    if (pending) {
      return (
        <Container>
          <BlockLoading />
        </Container>
      );
    }

    if (failedToLoadPdf) {
      return (
        <Container
          contentClassName={styles.errorMessage}
        >
          <h3>
            {strings.drefLoadPdfFailureMessage}
          </h3>
        </Container>
      );
    }
  };

  return (
    <Page
      className={className}
      heading={strings.finalReportExport}
    >
      {pdfLoadingStatus}

      {!pdfLoadingStatus && finalReportResponse && drefOptions && (
        <PDFViewer
          className={styles.pdfPreview}
        >
          <FinalReportPdfDocument
            strings={strings}
            finalReportResponse={finalReportResponse}
            drefOptions={drefOptions}
          />
        </PDFViewer>
      )}
    </Page>
  );
}
export default FinalReportPdfPreview;

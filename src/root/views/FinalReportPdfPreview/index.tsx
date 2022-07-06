import React from 'react';
import type { match as Match } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer';

import BlockLoading from '#components/block-loading';
import Page from '#components/Page';
import { useRequest } from '#utils/restRequest';
import LanguageContext from '#root/languageContext';
import {
  NumericKeyValuePair,
  StringKeyValuePair,
} from '#types';
import { DrefFinalReportApiFields } from '#views/FinalReportForm/common';

import FinalReportPdfDocument from '../../components/FinalReportExport/FinalReportPdfDocument';

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
  });

  const {
    pending: fetchingDrefOptions,
    response: drefOptions,
  } = useRequest<OperationalUpdateOptions>({
    skip: !id,
    url: 'api/v2/dref-options/',
  });

  const pending = fetchingFinalReport || fetchingDrefOptions;

  return (
    <Page
      className={className}
      heading="Final Report Export"
    >
      {pending && <BlockLoading />}
      {!pending && finalReportResponse && drefOptions && (
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

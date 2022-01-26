import React from 'react';
import type { match as Match } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer';

import BlockLoading from '#components/block-loading';
import Page from '#components/Page';
import { useRequest } from '#utils/restRequest';
import LanguageContext from '#root/languageContext';
import { DrefApiFields } from '#views/DrefApplicationForm/common';

import {
  NumericKeyValuePair,
  StringKeyValuePair,
} from '#types';

import DrefPdfDocument from '#components/DrefPdfDocument';
import styles from './styles.module.scss';

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
}

function DrefPdfExport(props: Props) {
  const { strings } = React.useContext(LanguageContext);
  const {
    className,
    match,
  } = props;

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

  return (
    <Page
      className={className}
      heading="DREF Export"
    >
      {pending && <BlockLoading />}
      {!pending && dref && drefOptions && (
        <PDFViewer
          className={styles.pdfPreview}
        >
          <DrefPdfDocument
            strings={strings}
            dref={dref}
            drefOptions={drefOptions}
          />
        </PDFViewer>
      )}
    </Page>
  );
}
export default DrefPdfExport;

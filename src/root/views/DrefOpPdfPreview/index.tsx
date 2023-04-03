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

import styles from './styles.module.scss';
import OperationalUpdatePdfDocument from '#components/OperationalUpdatePdfDocument';
import { DrefOperationalUpdateApiFields } from '#views/DrefOperationalUpdateForm/common';

interface Props {
  className?: string;
  match: Match<{ id?: string }>;
}

interface OperationalUpdateOptions {
  disaster_category: NumericKeyValuePair[];
  national_society_actions: StringKeyValuePair[];
  needs_identified: StringKeyValuePair[];
  planned_interventions: StringKeyValuePair[];
  status: NumericKeyValuePair[];
  type_of_onset: NumericKeyValuePair[];
  type_of_dref: NumericKeyValuePair[];
  users: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
  }[];
}

function OperationalUpdatePreview(props: Props) {
  const { strings } = React.useContext(LanguageContext);
  const {
    className,
    match,
  } = props;

  const { id } = match.params;

  //const {
  //  id,
  //} = props;

  const {
    pending: fetchingOperationalUpdate,
    response: operationalUpdateResponse,
  } = useRequest<DrefOperationalUpdateApiFields>({
    skip: !id,
    url: `api/v2/dref-op-update/${id}/`,
  });

  const {
    pending: fetchingDrefOptions,
    response: drefOptions,
  } = useRequest<OperationalUpdateOptions>({
    skip: !id,
    url: 'api/v2/dref-options/',
  });

  const pending = fetchingOperationalUpdate || fetchingDrefOptions;

  return (
    <Page
      className={className}
      heading="Operational Update Export"
    >
      {pending && <BlockLoading />}
      {!pending && operationalUpdateResponse && drefOptions && (
        <PDFViewer
          className={styles.pdfPreview}
        >
          <OperationalUpdatePdfDocument
            strings={strings}
            operationalUpdateResponse={operationalUpdateResponse}
            drefOptions={drefOptions}
          />
        </PDFViewer>
      )}
    </Page>
  );
}
export default OperationalUpdatePreview;

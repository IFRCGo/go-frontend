import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { IoDownload } from 'react-icons/io5';

import languageContext from '#root/languageContext';
import { useRequest } from '#utils/restRequest';
import {
  NumericKeyValuePair,
  StringKeyValuePair,
} from '#types';
import DropdownMenuItem from '#components/DropdownMenuItem';
import { DrefFinalReportApiFields } from '#views/FinalReportForm/common';
import FinalReportPdfDocument from './FinalReportPdfDocument';

interface DrefOptions {
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
interface Props {
  className?: string;
  id: number;
}

function FinalReportExport(props: Props) {
  const { strings } = React.useContext(languageContext);
  const {
    id,
  } = props;

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
  } = useRequest<DrefOptions>({
    skip: !id,
    url: 'api/v2/dref-options/',
  });

  const pending = fetchingFinalReport || fetchingDrefOptions;

  const handleExportRender = React.useCallback(() => {
    if (!pending && finalReportResponse && drefOptions) {
      const exportToPdf = async () => {
        const drefDocument = FinalReportPdfDocument({
          finalReportResponse,
          drefOptions,
          strings,
        });

        const blob = await pdf(drefDocument).toBlob();
        if (blob) {
          const now = new Date();
          const y = now.getFullYear();
          const m = now.getMonth() + 1;
          const d = now.getDate() + 1;
          const hh = now.getHours();
          const mm = now.getMinutes();
          const ss = now.getSeconds();
          const fileName = `Final Report ${finalReportResponse?.title ?? 'Export'} (${y}-${m}-${d} ${hh}-${mm}-${ss})`;
          const downloadLink = document.createElement('a');
          downloadLink.style.display = 'none';
          document.body.appendChild(downloadLink);
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.download = fileName;
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      };

      exportToPdf();
    }
  }, [pending, finalReportResponse, drefOptions, strings]);

  return (
    <DropdownMenuItem
      icon={<IoDownload />}
      label="Export"
      onClick={handleExportRender}
      disabled={pending}
    />
  );
}

export default FinalReportExport;

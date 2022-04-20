import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { IoDownload } from 'react-icons/io5';

import languageContext from '#root/languageContext';
import { useRequest } from '#utils/restRequest';
import {
  NumericKeyValuePair,
  StringKeyValuePair,
} from '#types';
import { DrefOperationalUpdateApiFields } from '#views/DrefOperationalUpdateForm/common';
import OperationalUpdatePdfDocument from '#components/OperationalUpdatePdfDocument';
import DropdownMenuItem from '#components/DropdownMenuItem';

interface OperationalUpdateOptions {
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
  operationalId: number;
}

function OperationalUpdateExport(props: Props) {
  const { strings } = React.useContext(languageContext);
  const {
    operationalId,
  } = props;

  const [shouldRender, setShouldRender] = React.useState(false);

  const {
    pending: fetchingOperationalUpdate,
    response: operationalUpdateResponse,
  } = useRequest<DrefOperationalUpdateApiFields>({
    skip: !operationalId,
    url: `api/v2/dref-op-update/${operationalId}/`,
  });

  const {
    pending: fetchingDrefOptions,
    response: drefOptions,
  } = useRequest<OperationalUpdateOptions>({
    skip: !operationalId,
    url: 'api/v2/dref-options/',
  });

  const handleClick = React.useCallback(() => {
    setShouldRender(true);
  }, []);

  const pending = fetchingOperationalUpdate || fetchingDrefOptions;

  React.useEffect(() => {
    if (!pending && operationalUpdateResponse && drefOptions && shouldRender) {
      const exportToPdf = async () => {
        const drefDocument = OperationalUpdatePdfDocument({
          operationalUpdateResponse,
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
          const fileName = `Operational update ${operationalUpdateResponse?.title ?? 'Export'} (${y}-${m}-${d} ${hh}-${mm}-${ss})`;
          const downloadLink = document.createElement('a');
          downloadLink.style.display = 'none';
          document.body.appendChild(downloadLink);
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.download = fileName;
          downloadLink.click();
          document.body.removeChild(downloadLink);
          setShouldRender(false);
        }
      };

      exportToPdf();
    }
  }, [pending, operationalUpdateResponse, drefOptions, shouldRender, strings]);


  return (
    <DropdownMenuItem
      icon={<IoDownload />}
      label="Export"
      onClick={handleClick}
      disabled={pending || shouldRender}
    />
  );
}

export default OperationalUpdateExport;

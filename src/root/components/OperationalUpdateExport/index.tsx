import React from 'react';
import { pdf } from '@react-pdf/renderer';

import languageContext from '#root/languageContext';
import { useRequest } from '#utils/restRequest';
import {
  NumericKeyValuePair,
  StringKeyValuePair,
} from '#types';
import { DrefOperationalUpdateApiFields } from '#views/DrefOperationalUpdateForm/common';
import OperationalUpdatePdfDocument from '#components/OperationalUpdatePdfDocument';
import Button, { ButtonVariant } from '#components/Button';

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
interface Props {
  className?: string;
  operationalId: number;
  variant?: ButtonVariant;
}

function OperationalUpdateExport(props: Props) {
  const { strings } = React.useContext(languageContext);
  const {
    className,
    operationalId,
    variant,
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

  const pending = fetchingOperationalUpdate || fetchingDrefOptions;

  const handleExportRender = React.useCallback(() => {
    setShouldRender(true);
    if (!pending && operationalUpdateResponse && drefOptions) {
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
  }, [pending, operationalUpdateResponse, drefOptions, strings]);

  return (
    <Button
      className={className}
      name='operational-update-export'
      variant={variant ?? 'secondary'}
      onClick={handleExportRender}
      disabled={pending || shouldRender}
    >
      {shouldRender ? 'Exporting' : 'Export'}
    </Button>
  );
}

export default OperationalUpdateExport;

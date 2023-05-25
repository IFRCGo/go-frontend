import React from 'react';
import { pdf } from '@react-pdf/renderer';

import { useRequest } from '#utils/restRequest';
import LanguageContext from '#root/languageContext';
import { DrefApiFields } from '#views/DrefApplicationForm/common';
import {
  NumericKeyValuePair,
  StringKeyValuePair,
} from '#types';
import DrefPdfDocument from '#components/DrefPdfDocument';
import Button, { ButtonVariant } from '#components/Button';

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
  drefId: number;
  variant?: ButtonVariant;
}

function DrefExportButton(props: Props) {
  const {
    className,
    drefId,
    variant,
  } = props;

  const { strings } = React.useContext(LanguageContext);
  const [shouldRender, setShouldRender] = React.useState(false);

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
    skip: !drefId,
    url: 'api/v2/dref-options/',
  });

  const pending = fetchingDref || fetchingDrefOptions;

  const handleExportRender = React.useCallback(() => {
    setShouldRender(true);
    if (!pending && dref && drefOptions) {
      const exportToPdf = async () => {
        const drefDocument = DrefPdfDocument({
          dref,
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
          const fileName = `DREF ${dref?.title ?? 'Export'} (${y}-${m}-${d} ${hh}-${mm}-${ss})`;
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
  }, [pending, dref, drefOptions, strings]);

  return (
    <Button
      className={className}
      name='dref-export-button'
      onClick={handleExportRender}
      variant= {variant ?? 'secondary'}
      disabled={pending || shouldRender}
    >
      {shouldRender ? 'Exporting...' : 'Export'}
    </Button>
  );
}
export default DrefExportButton;

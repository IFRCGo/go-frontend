import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { BsFilePdf } from 'react-icons/bs';
import { ImSpinner } from 'react-icons/im';

import useAlert from '#hooks/useAlert';
import { useLazyRequest } from '#utils/restRequest';
import Button from '#components/Button';
import { downloadFromUrl } from '#utils/common';

import styles from './styles.module.scss';

interface Response {
  status: 'ready' | 'pending',
  url: string | null;
}

interface Props {
  className?: string;
  flashUpdateId: number;
  title: string;
}

function ExportButton(props: Props) {
  const {
    className,
    flashUpdateId,
    title,
  } = props;

  const alert = useAlert();
  const [exportPending, setExportPending] = React.useState(false);

  const {
    trigger: triggerExportRequest,
    response,
    pending,
  } = useLazyRequest<Response>({
    url: `/api/v2/export-flash-update/${flashUpdateId}`,
    onSuccess: (response) => {
      if (response && response.status) {
        if (response.status === 'ready' && response.url) {
          downloadFromUrl(response.url, `${title}.pdf`);
          setExportPending(false);
        } else {
          window.setTimeout(() => {
            triggerExportRequest(null);
          }, 1000);
        }
      } else {
        alert.show(
          'Failed to get the export',
          {variant: 'danger'},
        );
        setExportPending(false);
      }
    },
    onFailure: ({ value: { messageForNotification }}) => {
      alert.show(
        `Failed to get the export: ${messageForNotification}`,
        {variant: 'danger'},
      );
      setExportPending(false);
    }
  });

  const handleClick = React.useCallback(() => {
    setExportPending(true);
    triggerExportRequest(null);
  }, [triggerExportRequest]);

  return (
    <Button
      variant="secondary"
      className={_cs(styles.exportButton, className)}
      name={undefined}
      icons={(pending || exportPending) ? <ImSpinner className={styles.spinner} /> : <BsFilePdf />}
      onClick={handleClick}
      disabled={pending}
    >
      Export
    </Button>
  );
}

export default ExportButton;

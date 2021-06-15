import React from 'react';
import _cs from 'classnames';
import { saveAs } from 'file-saver';

import { showAlert } from '#components/system-alerts';
import Button, { Props as ButtonProps } from '#components/Button';
import Translate from '#components/Translate';
import { getFileName } from '#utils/utils';
import { Row, convertJsonToCsv } from '#components/Table/useDownloading';

import useRecursiveRequest from '#utils/restRequest/useRecursiveRequest';

export interface Props<D, N> extends ButtonProps<N> {
  className?: string;
  apiUrl: string;
  urlOptions?: Record<string, unknown>;
  fileNameSuffix?: string;
  transformItem: (item: D) => Row;
}

function ExportTableButton<D, N>(props: Props<D, N>) {
  const {
    apiUrl,
    fileNameSuffix,
    className,
    urlOptions,
    transformItem,
    ...otherProps
  } = props;

  const [pending, data, total, triggerExportStart] = useRecursiveRequest<D>({
    url: apiUrl,
    urlOptions,
    onFailure: (err) => {
      showAlert('danger', (
        <p>
          Failed to complete the download
        </p>
      ), true, 3000);
    }
  });

  React.useEffect(() => {
    if (!pending) {
      if (data?.length > 0) {
        if (data.length === total) {
          const mappedData = data.map(transformItem);
          const fullCsvString = convertJsonToCsv(mappedData);
          if (fullCsvString) {
            const blob = new Blob(
              [fullCsvString],
              { type: 'text/csv' },
            );
            const fileName = getFileName(fileNameSuffix);
            saveAs(blob, fileName);
          }
        } else {
          console.error('CSV num rows mismatch', `expected: ${total}`, `got: ${data.length}`);
        }
      }
    }
  }, [pending, data, total, fileNameSuffix, transformItem]);

  const progress = React.useMemo(() => {
    if (!total) {
      return 0;
    }

    return (100 * (data?.length / total) ?? 0).toFixed(0);
  }, [data, total]);

  return (
    <Button
      onClick={triggerExportStart}
      className={_cs(
        'button button--primary-bounded button-small',
        pending && 'disabled',
        className,
      )}
      {...otherProps}
    >
      { pending ? (
        <Translate
          stringId='exportButtonDownloadingProgress'
          params={{
            progress,
          }}
        />
      ) : (
        <Translate stringId='exportButtonExportTable'/>
      )}
    </Button>
  );
}

export default ExportTableButton;

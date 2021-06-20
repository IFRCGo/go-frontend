import React from 'react';
import { saveAs } from 'file-saver';
import { IoMdDownload } from 'react-icons/io';

import Button, { Props as ButtonProps } from '#components/Button';
import Translate from '#components/Translate';
import { getFileName } from '#utils/utils';
import { Row, convertJsonToCsv } from '#components/Table/useDownloading';

import useRecursiveRequest from '#utils/restRequest/useRecursiveRequest';
import useAlert from '#hooks/useAlert';

interface BaseProps<D, N> extends ButtonProps<N> {
  className?: string;
  apiUrl: string;
  urlOptions?: Record<string, unknown>;
  fileNameSuffix?: string;
  transformItem: (item: D) => Row;
}

export type Props<D, N> = BaseProps<D, N> & {
  label?: React.ReactNode;
}

function ExportTableButton<D, N>(props: Props<D, N>) {
  const {
    apiUrl,
    fileNameSuffix,
    className,
    urlOptions,
    transformItem,
    label,
    icons = <IoMdDownload />,
    ...otherProps
  } = props;

  const alert = useAlert();

  const [pending, data, total, triggerExportStart] = useRecursiveRequest<D>({
    url: apiUrl,
    urlOptions,
    onFailure: (err) => {
      alert.show('Failed to complete the download', {
        duration: 3000,
        variant: 'danger',
      });
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
      className={className}
      icons={icons}
      {...otherProps}
    >
      { pending && (
        <Translate
          stringId='exportButtonDownloadingProgress'
          params={{ progress }}
        />
      )}
      {!pending && !label && (
        <Translate
          stringId='exportButtonExportTable'
        />
      )}
      {label}
    </Button>
  );
}

export default ExportTableButton;

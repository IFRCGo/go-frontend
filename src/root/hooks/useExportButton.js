import React from 'react';
import _cs from 'classnames';
import { saveAs } from 'file-saver';
import stringify from 'csv-stringify/lib/sync';

import { showAlert } from '#components/system-alerts';
import Translate from '#components/Translate';

import { useRecursiveCsvFetch } from '#hooks/useRequest';

function getFileName(suffix) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  return `${suffix}-${year}-${month}-${day}-${h}-${m}-${s}.csv`;
}

function formatHeader(headerRow) {
  let str = headerRow;
  str = str.replace(/dtype/gi, 'disaster-type');
  str = str.replace(/,code,/i, ',appeal_code,');
  str = str.replace(/atype/gi, 'appeal-type');
  str = str.replace(/^aid/, 'appeal_id');
  str = str.replace(/country.society_name/i, 'national_society_name');
  str = str.replace(/\./g, ' ');
  str = str.replace(/_/g, '-');

  return str;
}


function useExportButton(apiUrl, fileNameSuffix, className) {
  const apiUrlRef = React.useRef(apiUrl);
  const [url, setUrl] = React.useState('');
  const [pending, data, total] = useRecursiveCsvFetch(
    url,
    {
      onFailure: (err) => {
        console.error('failed to download', err);
        setUrl('');
        showAlert('danger', (
          <p>
            Failed to complete the download
          </p>
        ), true, 3000);
      }
    }
  );

  React.useEffect(() => {
    if (!pending) {
      if (data?.length > 0) {
        if (data.length === total) {
          const headers = Object.keys(data[0]);
          const dataString = stringify(data, {
            columns: headers,
          });
          const headerString = formatHeader(headers.join(','));
          const fullCsvString = `${headerString}\n${dataString}`;
          const blob = new Blob(
            [fullCsvString],
            { type: 'text/csv', charset: 'utf-8'},
          );
          const fileName = getFileName(fileNameSuffix);
          saveAs(blob, fileName);
        } else {
          console.error('CSV num rows mismatch', `expected: ${total}`, `got: ${data.length}`);
        }
      }
      setUrl('');
    }
  }, [pending, data, total, setUrl, fileNameSuffix]);

  const progress = React.useMemo(() => {
    if (!total) {
      return 0;
    }

    return (100 * (data?.length / total) ?? 0).toFixed(0);
  }, [data, total]);

  const handleExportClick = React.useCallback(() => {
    setUrl(apiUrlRef.current);
  }, [setUrl]);

  return (
    <button
      onClick={handleExportClick}
      className={_cs(
        'button button--primary-bounded button-small',
        pending && 'disabled',
        className,
      )}
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
    </button>
  );
}

export default useExportButton;

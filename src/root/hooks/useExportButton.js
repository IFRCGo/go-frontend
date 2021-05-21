import React from 'react';
import _cs from 'classnames';
import { saveAs } from 'file-saver';
import stringify from 'csv-stringify/lib/sync';

import { showAlert } from '#components/system-alerts';
import Translate from '#components/Translate';
import { getFileName } from '#utils/utils';

import useRecursiveCsvRequest from '#utils/restRequest/useRecursiveCsvRequest';

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
  const [pending, data, total, triggerExportStart] = useRecursiveCsvRequest({
    url: apiUrl,
    onFailure: (err) => {
      console.error('failed to download', err);
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
    }
  }, [pending, data, total, fileNameSuffix]);

  const progress = React.useMemo(() => {
    if (!total) {
      return 0;
    }

    return (100 * (data?.length / total) ?? 0).toFixed(0);
  }, [data, total]);

  return (
    <button
      onClick={triggerExportStart}
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

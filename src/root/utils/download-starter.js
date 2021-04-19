import React from 'react';
import { showAlert, hideAllAlert } from '#components/system-alerts';

export function startDownload (data, filename) {
  let dataUri = null;
  let isChrome = false;

  if (typeof data === 'string') {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(new Blob([data], {type: 'text/csv', charset: 'utf-8'}), filename);
    } else {
      isChrome = true;
      dataUri = data;
    }
  } else {
    if (window.navigator.msSaveOrOpenBlob) {
      let blob = data.msToBlob();
      window.navigator.msSaveBlob(blob, filename);
    } else {
      isChrome = true;
      dataUri = data.toDataURL('image/png');
    }
  }

  if (isChrome) {
    const link = document.createElement('a');

    link.setAttribute('href', dataUri);
    console.info('link');
    link.setAttribute('download', filename);
    link.innerHTML = 'Download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  hideAllAlert();
  showAlert('success', <p><strong>Success:</strong> Download completed</p>, true, 1000);
}

import React from 'react';
import { showAlert, hideAllAlert } from './../components/system-alerts';

export function startDownload (dataUri, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(new Blob([dataUri], {type: 'text/csv', charset: 'utf-8'}), filename);
  } else {
    const link = document.createElement('a');

    link.setAttribute('href', dataUri);
    link.setAttribute('download', filename);
    link.innerHTML = 'Download';
    document.body.appendChild(link);
    link.click();
  }

  hideAllAlert();
  showAlert('success', <p><strong>Success:</strong> Download completed</p>, true, 1000);
}

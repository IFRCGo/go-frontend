import React from 'react';
import { showAlert, hideAllAlert } from './../components/system-alerts';

export function startDownload (renderedCanvas, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    let blob = renderedCanvas.msToBlob();
    window.navigator.msSaveBlob(blob, filename);
  } else {
    let dataUri = renderedCanvas.toDataURL('image/png');
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

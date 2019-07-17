import React from 'react';
import { showAlert, hideAllAlert } from './../components/system-alerts';

export function startDownload (renderedCanvas, filename) {
  let dataUri = null;
  let isChrome = false;
  if (typeof renderedCanvas === 'string') {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(new Blob([renderedCanvas], {type: 'text/csv', charset: 'utf-8'}), filename);
    } else {
      isChrome = true;
      dataUri = renderedCanvas;
    }
  } else {
    if (window.navigator.msSaveOrOpenBlob) {
      let blob = renderedCanvas.msToBlob();
      window.navigator.msSaveBlob(blob, filename);
    } else {
      isChrome = true;
      dataUri = renderedCanvas.toDataURL('image/png');
    }
  }

  if (isChrome) {
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

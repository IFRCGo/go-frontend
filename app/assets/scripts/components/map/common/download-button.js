'use strict';

import React from 'react';
import html2canvas from 'html2canvas';
import { startDownload } from '../../../utils/download-starter';
import { PropTypes as T } from 'prop-types';
import { environment } from '../../../config';

class DownloadButton extends React.Component {
  constructor (props) {
    super(props);
    this.startDownload = this.startDownload.bind(this);
  }

  startDownload () {
    const timestamp = new Date();
    const map = document.querySelector('.map-vis');
    const downloadButton = map.querySelector('.map-vis__legend--download-btn');
    const dropdowns = map.querySelectorAll('.map-vis__legend--top-left');
    const popover = map.querySelector('.popover__contents');
    const navigationContainer = map.querySelector('.map-vis__holder')
      .querySelector('.mapboxgl-control-container');
    const navigation = map.querySelector('.mapboxgl-ctrl-top-right');

    map.removeChild(downloadButton);
    navigationContainer.removeChild(navigation);
    dropdowns.forEach(dropdown => map.removeChild(dropdown));

    if (popover !== null) {
      popover.style.height = 'fit-content';
      popover.style.maxHeight = 'none';
    }

    html2canvas(map, {useCORS: true}).then((renderedCanvas) => {
      startDownload(
        renderedCanvas.toDataURL('image/png'),
        'map-' + timestamp.getTime() + '.jpg');

      map.appendChild(downloadButton);
      navigationContainer.appendChild(navigation);
      dropdowns.forEach(dropdown => map.appendChild(dropdown));

      if (popover !== null) {
        popover.style.height = 'auto';
        popover.style.maxHeight = '225px';
      }
    });
  }

  render () {
    return (
      <figcaption className='map-vis__legend map-vis__legend--download-btn legend'
        onClick={this.startDownload} />
    );
  }
}

if (environment !== 'production') {
  DownloadButton.propTypes = {
    data: T.object
  };
}

export default DownloadButton;

'use strict';

import React from 'react';
import html2canvas from 'html2canvas';
import { startDownload } from '../../../utils/download-starter';
import { PropTypes as T } from 'prop-types';
import { environment } from '../../../config';
import { showAlert } from './../../system-alerts';

class DownloadButton extends React.Component {
  constructor (props) {
    super(props);
    this.startDownload = this.startDownload.bind(this);
  }

  startDownload () {
    if ((/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) || /Trident/.test(navigator.userAgent) || /Edge/.test(navigator.userAgent)) {
      this.props.setZoomToDefault();

      const interval = setInterval(function () {
        clearInterval(interval);
        const timestamp = new Date();
        const map = document.getElementsByClassName('map-vis')[0];
        const downloadButton = document.getElementsByClassName('map-vis__legend--download-btn')[0];
        const dropdowns = Array.from(document.getElementsByClassName('map-vis__legend--top-left'));
        const popover = document.getElementsByClassName('popover__contents')[0];
        const navigation = document.getElementsByClassName('mapboxgl-ctrl-top-right')[0];
        const mapLogoHeader = document.getElementById('map-picture-header');

        mapLogoHeader.style.visibility = 'visible';
        downloadButton.style.visibility = 'hidden';
        navigation.style.visibility = 'hidden';
        dropdowns.forEach(dropdown => {
          dropdown.style.visibility = 'hidden';
        });

        if (typeof popover !== 'undefined') {
          popover.style.height = 'fit-content';
          popover.style.maxHeight = 'none';
        }

        html2canvas(map, {useCORS: true}).then((renderedCanvas) => {
          startDownload(
            renderedCanvas,
            'map-' + timestamp.getTime() + '.png');

          mapLogoHeader.style.visibility = 'hidden';
          downloadButton.style.visibility = 'visible';
          navigation.style.visibility = 'visible';
          dropdowns.forEach(dropdown => {
            dropdown.style.visibility = 'visible';
          });

          if (typeof popover !== 'undefined') {
            popover.style.height = 'auto';
            popover.style.maxHeight = '225px';
          }
        });
      }, 1000);
    } else {
      showAlert('danger', <p><b>Error:</b> Download is only possible from Google Chrome</p>, true, 2000);
    }
  }

  render () {
    if ((/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) || /Trident/.test(navigator.userAgent) || /Edge/.test(navigator.userAgent)) {
      return (
        <figcaption className='map-vis__legend map-vis__legend--download-btn legend'
          onClick={this.startDownload}>
            <img src='/assets/graphics/content/download.svg' alt='IFRC GO logo'/></figcaption>
      );
    }
    return null;
  }
}

if (environment !== 'production') {
  DownloadButton.propTypes = {
    data: T.object,
    setZoomToDefault: T.func
  };
}

export default DownloadButton;

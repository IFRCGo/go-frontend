'use strict';

import React from 'react';
import html2canvas from 'html2canvas';
import { startDownload } from '../../../utils/download-starter';
import { PropTypes as T } from 'prop-types';
import { environment } from '../../../config';

function svgToCanvas (targetElem) {
  const svgElem = targetElem.getElementsByTagName('svg');
  for (const node of svgElem) {
    node
      .setAttribute('font-family', window.getComputedStyle(node, null)
        .getPropertyValue('font-family'));
    node
      .setAttribute('font-size', window.getComputedStyle(node, null)
        .getPropertyValue('font-size'));
    node.replaceWith(node);
  }
}

class DownloadButton extends React.Component {
  constructor (props) {
    super(props);
    this.handleDownloadButtonClick = this.handleDownloadButtonClick.bind(this);
  }

  componentWillUnmount () {
    window.clearTimeout(this.timeout);
  }

  handleDownloadButtonClick () {
    const {
      mapContainerClassName = 'map-vis',
    } = this.props;
    this.props.setZoomToDefault();

    this.timeout = window.setTimeout(function () {
      const timestamp = new Date();
      const map = document.getElementsByClassName(mapContainerClassName)[0];
      const downloadButton = document.getElementsByClassName('map-vis__legend--download-btn')[0];
      const dropdowns = Array.from(document.getElementsByClassName('map-vis__legend--top-left'));
      const popover = document.getElementsByClassName('popover__contents')[0];
      const navigation = document.getElementsByClassName('mapboxgl-ctrl-top-right')[0];
      const mapLogoHeader = document.getElementById('map-picture-header');
      const mapFooter = document.getElementById('map-export-footer');

      if (mapFooter) {
        mapFooter.style.visibility = 'visible';
      }
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

      svgToCanvas(map);
      html2canvas(map, {useCORS: true}).then((renderedCanvas) => {
        startDownload(
          renderedCanvas,
          'map-' + timestamp.getTime() + '.png');

        if (mapFooter) {
          mapFooter.style.visibility = 'hidden';
        }
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
  }

  render () {
    return (
      <figcaption
        className='map-vis__legend map-vis__legend--download-btn legend map-download-btn'
        onClick={this.handleDownloadButtonClick}>
        <img src='/assets/graphics/content/download.svg' alt='IFRC GO logo'/>
      </figcaption>
    );
  }
}

if (environment !== 'production') {
  DownloadButton.propTypes = {
    data: T.object,
    setZoomToDefault: T.func,
    mapContainerClassName: T.string,
  };
}

export default DownloadButton;

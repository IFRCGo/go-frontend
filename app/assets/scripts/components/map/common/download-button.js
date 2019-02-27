'use strict';

import React from 'react';
import { startDownload } from '../../../utils/download-starter';

class DownloadButton extends React.Component {
  constructor (props) {
    super(props);
    this.startDownload = this.startDownload.bind(this);
  }

  startDownload () {
    let dataUri = this.props.data.toDataURL('image/jpeg')
      .replace("image/jpeg", "image/octet-stream");
    let timestamp = new Date();

    startDownload(dataUri, 'map-' + timestamp.getTime() + '.jpg');
  }

  render () {
    return (
      <figcaption className='map-vis__legend map-vis__legend--download-btn legend'
        onClick={this.startDownload} />
    )
  }
}

export default DownloadButton;
import React from 'react';
import { formatDate } from './../../../utils/format';

const MapHeader = (props) => (
  <div style={{backgroundColor: '#ffffff', position: 'absolute', width: '100%', borderBottom: '5px #BC2C2A solid', verticalAlign: 'middle', visibility: 'hidden', zIndex: 3, pointerEvents: 'none'}} id='map-picture-header'>
    <span style={{color: '#f5333f', fontSize: '30px', paddingLeft: '20px'}}>{props.downloadedHeaderTitle}</span>
    <span style={{color: '#f5333f', fontSize: '12px', paddingLeft: '10px'}}>({formatDate(new Date())})</span>
    <div style={{float: 'right', right: '0', marginRight: '20px'}}>
      <img src="/assets/graphics/layout/go-logo-2020.svg" alt="IFRC GO logo" style={{height: '40px'}} />
    </div>
  </div>
);

export default MapHeader;

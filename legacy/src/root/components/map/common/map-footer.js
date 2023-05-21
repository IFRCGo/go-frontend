import React from 'react';
import Translate from '#components/Translate';

const MapFooter = () => (
  <div
    style={{
      backgroundColor: '#ffffff',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      verticalAlign: 'middle',
      visibility: 'hidden',
      zIndex: 3,
      pointerEvents: 'none',
      padding: '10px',
      fontSize: '9px',
    }}
    id='map-export-footer'
  >
    <Translate stringId='mapFooterDisclaimer'/>
  </div>
);

export default MapFooter;

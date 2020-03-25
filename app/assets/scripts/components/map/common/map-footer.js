import React from 'react';

const MapFooter = (props) => (
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
    }}
    id='map-export-footer'
  >
    The maps used do not imply the expresion of any opinion on the part of the International Federation of the Red Cross and Red Crescent Societies or National Societies concerning the legal status of a territory or of its authorities, Data sources: IFRC, OSM contributors, Mapbox.
  </div>
);

export default MapFooter;

import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../../config';

const FullScreenHeader = ({ title }) => (
  <div className='flex'>
    <div style={{width: '375px', height: '56px', position: 'absolute'}}>
      <img
        src="/assets/graphics/layout/logo_2020.png"
        alt="IFRC GO logo"
        style={{width: '375px', height: '56px'}}
      />
    </div>
    <h1 className='inpage__title inpage__title--map-fullscreen'>
      {title}
    </h1>
  </div>
);

export default FullScreenHeader;

if (environment !== 'production') {
  FullScreenHeader.propTypes = {
    title: T.string
  };
}

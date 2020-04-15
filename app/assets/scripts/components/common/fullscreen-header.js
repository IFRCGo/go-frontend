import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../../config';

const FullScreenHeader = ({ title }) => (
  <div className='flex'>
    <div style={{height: '40px', position: 'absolute'}}>
      <img
        src="/assets/graphics/layout/go-logo-2020.svg"
        alt="IFRC GO logo"
        style={{height: '40px'}}
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

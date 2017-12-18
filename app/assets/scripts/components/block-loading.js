'use strict';
import React from 'react';
// import { PropTypes as T } from 'prop-types';

import { environment } from '../config';

export default class BlockLoading extends React.Component {
  render () {
    return (
      <div className='block-loading'>
        <div className='spinner'>
          <div className='spinner__bounce'></div>
          <div className='spinner__bounce'></div>
          <div className='spinner__bounce'></div>
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  BlockLoading.propTypes = {
  };
}

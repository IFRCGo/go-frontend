'use strict';
import React from 'react';
// import { PropTypes as T } from 'prop-types';

import { environment } from '../config';

export default class BlockLoading extends React.Component {
  render () {
    return (
      <div className='block-loading'>
        I'm loading
      </div>
    );
  }
}

if (environment !== 'production') {
  BlockLoading.propTypes = {
  };
}

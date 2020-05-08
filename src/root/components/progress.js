'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';

const Progress = ({max, value, children}) => {
  return (
    <div className='progress-bar'>
      <div className='progress-bar__value' style={{width: `${value / max * 100}%`}}>{children}</div>
    </div>
  );
};
if (environment !== 'production') {
  Progress.propTypes = {
    max: T.number,
    value: T.number,
    children: T.object
  };
}

export default Progress;

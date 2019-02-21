'use strict';

import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';

const Progress = ({max, value, children}) => {
  let percent = value / max * 100;
  percent = percent > 100 ? 100 : percent;

  return (
    <div>
      <div className='progress-bar'>
        <div className='progress-bar__value' style={{width: percent + '%'}}></div>
      </div>
      <div className='progress-bar__key'><small>{percent}%</small></div>
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

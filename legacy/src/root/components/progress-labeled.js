
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '#config';
import { round } from '#utils/format';

const Progress = ({max, value}) => {
  value = round(value, 2);
  return (
    <div className='progress-bar-container'>
      <div className='progress-bar'>
        <div className='progress-bar__value' style={{width: (value > max ? max : value) + '%'}}></div>
      </div>
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

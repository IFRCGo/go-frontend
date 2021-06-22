import React from 'react';
import { _cs } from '@togglecorp/fujs';

function Spinner (props) {
  return (
    <div className={_cs('spinner', props.className)}>
      <div className='spinner__bounce'></div>
      <div className='spinner__bounce'></div>
      <div className='spinner__bounce'></div>
    </div>
  );
}

export default Spinner;

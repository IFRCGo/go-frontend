import React from 'react';
import { _cs } from '@togglecorp/fujs';

function Spinner (p) {
  return (
    <div className={_cs('spinner', p.className)}>
      <div className='spinner__bounce'></div>
      <div className='spinner__bounce'></div>
      <div className='spinner__bounce'></div>
    </div>
  );
}

export default Spinner;

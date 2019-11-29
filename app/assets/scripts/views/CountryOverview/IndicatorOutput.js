import React from 'react';
import _cs from 'classnames';

import { addSeparator } from '@togglecorp/fujs';

const IndicatorOutput = ({
  className,
  label,
  value = '-',
  addSeparatorToValue
}) => (
  <div className={_cs('key-indicator-text-output', className)}>
    <div className='tc-label'>
      {label}
    </div>
    <div className='tc-value'>
      {addSeparatorToValue ? addSeparator(value) : value}
    </div>
  </div>
);

export default IndicatorOutput;

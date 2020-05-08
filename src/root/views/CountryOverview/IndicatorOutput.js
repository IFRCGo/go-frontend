import React from 'react';
import _cs from 'classnames';

import FormattedNumber from '../../components/formatted-number';

const IndicatorOutput = ({
  className,
  label,
  value,
  addSeparatorToValue,
  normalizeValue,
  fixedTo,
}) => (
  <div className={_cs('key-indicator-text-output', className)}>
    <div className='tc-label'>
      {label}
    </div>
    <div className='tc-value'>
      <FormattedNumber
        value={value}
        addSeparator={addSeparatorToValue}
        fixedTo={fixedTo}
        normalize={normalizeValue}
      />
    </div>
  </div>
);

export default IndicatorOutput;

import React from 'react';
import _cs from 'classnames';

import FormattedNumber from './formatted-number';
import FormattedDate from './formatted-date';

const TextOutput = ({
  className,
  label,
  value,
  addSeparatorToValue,
  normalizeValue,
  fixedTo,
  type = 'string',
}) => (
  <div className={_cs('tc-text-output', className)}>
    <div className='tc-label'>
      {label}
    </div>
    <div className='tc-value'>
      { type === 'string' && value }
      { type === 'number' && (
        <FormattedNumber
          value={value}
          addSeparator={addSeparatorToValue}
          fixedTo={fixedTo}
          normalize={normalizeValue}
        />
      )}
      { type === 'date' && (
        <FormattedDate
          value={value}
        />
      )}
    </div>
  </div>
);

export default TextOutput;

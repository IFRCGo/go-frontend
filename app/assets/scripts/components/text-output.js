import React from 'react';
import _cs from 'classnames';

import { isDefined } from '@togglecorp/fujs';

import FormattedNumber from './formatted-number';
import FormattedDate from './formatted-date';

function TextOutput (p) {
  const {
    className,
    label,
    value,
    addSeparatorToValue,
    normalizeValue,
    fixedTo,
    type = 'string',
    reverseOrder,
    hideEmptyValue,
  } = p;

  return (
    (!isDefined(value) && hideEmptyValue) ? (
      null
    ) : (
      <div className={_cs(
        'tc-text-output',
        reverseOrder && 'tc-text-output-reversed',
        className,
      )}>
        <div className='tc-label'>
          {label}
        </div>
        <div className='tc-value'>
          { type === 'string' && (value || '-') }
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
    )
  );
}

export default TextOutput;

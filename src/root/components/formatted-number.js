import React from 'react';
import _cs from 'classnames';
import {
  addSeparator as addCommaSeparator,
  formattedNormalize,
} from '@togglecorp/fujs';

const FormattedNumber = ({
  value,
  normalize,
  addSeparator,
  fixedTo,
  className,
}) => {
  let displayNumber = value || '-';
  let suffix;

  if (value && !isNaN(value)) {
    if (normalize) {
      const {
        number,
        normalizeSuffix,
      } = formattedNormalize(value, 'en');

      displayNumber = number;
      suffix = normalizeSuffix;
    }

    if (addSeparator) {
      displayNumber = addCommaSeparator(displayNumber);
    } else if (fixedTo) {
      const shouldFix = (displayNumber - Math.floor(displayNumber)) !== 0;
      displayNumber = Number.parseFloat(displayNumber).toFixed(shouldFix ? fixedTo : 0);
    }
  }

  return (
    <div className={_cs(className, 'tc-formatted-number')}>
      <div className='tc-number'>
        { displayNumber }
      </div>
      {suffix && (
        <div className='tc-number-suffix'>
          { suffix }
        </div>
      )}
    </div>
  );
};

export default FormattedNumber;

'use strict';
import React from 'react';
import _cs from 'classnames';
import { FaramInputElement } from '@togglecorp/faram';

import RawInput from './raw-input';

class DateInput extends React.PureComponent {
  render() {
    return (
      <RawInput
        {...this.props}
        type='date'
      />
    );
  }
}

export default FaramInputElement(DateInput);

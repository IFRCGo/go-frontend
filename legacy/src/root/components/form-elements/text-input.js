import React from 'react';
import { FaramInputElement } from '@togglecorp/faram';

import RawInput from './raw-input';

class TextInput extends React.PureComponent {
  render () {
    return (
      <RawInput
        {...this.props}
        type='text'
      />
    );
  }
}

export default FaramInputElement(TextInput);

import React from 'react';

import FormCheckable from './checkable';

export default function FormRadio (props) {
  return <FormCheckable type='radio' {...props} />;
}

FormRadio.defaultProps = {
  inline: true
};

import React from 'react';
import { PropTypes as T } from 'prop-types';

export function FormDescription ({value}) {
  let description = null;
  if (React.isValidElement(value)) {
    description = value;
  } else if (value) {
    description = <p className='form__description'>{value}</p>;
  }

  return description;
}

if (process.env.NODE_ENV !== 'production') {
  FormDescription.propTypes = {
    value: T.oneOfType([
      T.node,
      T.object
    ])
  };
}

'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';

export default function FormError (props) {
  const { errors, property } = props;
  if (!errors) return null;

  // The path in the validator starts with . for deep props.
  const err = errors.find(o => o.dataPath === `.${property}`);

  if (!err) return null;

  let message;
  switch (err.keyword) {
    case 'required':
      message = 'Please fill in the field.';
      break;
    case 'const':
      message = 'Passwords must match.';
      break;
    default:
      message = err.message;
  }

  return (
    <p className='form__error'>{message}</p>
  );
}

if (process.env.NODE_ENV !== 'production') {
  FormError.propTypes = {
    errors: T.array,
    property: T.string
  };
}
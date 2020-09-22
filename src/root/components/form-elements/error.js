import React from 'react';
import { PropTypes as T } from 'prop-types';
import Translate from '#components/Translate';

export default function FormError (props) {
  const { errors, property } = props;
  if (!errors) return null;

  // The path in the validator starts with . for deep props.
  const err = errors.find(o => o.dataPath === `.${property}`);

  if (!err) return null;

  let message;
  switch (err.keyword) {
    case 'required':
      message = <Translate id="formElementErrorRequiredMessage" />;
      break;
    case 'dependencies':
      message = <Translate id="formElementErrorDependenciesMessage" />;
      break;
    case 'const':
      message = <Translate id="formElementErrorConstMessage" />;
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

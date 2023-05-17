import React, { useContext } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { PropTypes as T } from 'prop-types';
import LanguageContext from '#root/languageContext';

export default function FormError (props) {
  const { strings } = useContext(LanguageContext);
  const {
    errors,
    property,
  } = props;
  if (!errors) return null;

  // The path in the validator starts with . for deep props.
  const err = errors.find(o => o.dataPath === `.${property}`);

  if (!err) return null;

  let message;
  switch (err.keyword) {
    case 'required':
      message = strings.formElementErrorRequiredMessage;
      break;
    case 'dependencies':
      message = strings.formElementErrorDependenciesMessage;
      break;
    case 'const':
      message = strings.formElementErrorConstMessage;
      break;
    default:
      message = err.message;
  }

  return (
    <p className='form__error'>
      <div className='form__error_tip' />
      <div className='form__error_content'>
        <FiAlertTriangle className='form__error_icon' />
        {message}
      </div>
    </p>
  );
}

if (process.env.NODE_ENV !== 'production') {
  FormError.propTypes = {
    errors: T.array,
    property: T.string
  };
}

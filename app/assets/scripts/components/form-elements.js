'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

export function FormInput (props) {
  const {
    label,
    type,
    name,
    className,
    id,
    value,
    onChange,
    autoFocus,
    children
  } = props;

  return (
    <div className='form__group'>
      <label className='form__label' htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        className={c('form__control form__control--medium', className)}
        value={value || ''}
        onChange={onChange}
        autoFocus={autoFocus}
      />
      {children || null}
    </div>
  );
}

FormInput.defaultProps = {
  autoFocus: false
};

if (process.env.NODE_ENV !== 'production') {
  FormInput.propTypes = {
    label: T.string,
    type: T.string,
    name: T.string,
    className: T.string,
    id: T.string,
    value: T.string,
    onChange: T.func,
    autoFocus: T.bool,
    children: T.node
  };
}

export function FormError (props) {
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

'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';

export function FormInput (props) {
  const {
    label,
    type,
    name,
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
        className='form__control form__control--medium'
        value={value}
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
    id: T.string,
    value: T.string,
    onChange: T.func,
    autoFocus: T.bool,
    children: T.node
  };
}

'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

import { FormDescription } from './misc';

export default function FormInput (props) {
  const {
    label,
    type,
    name,
    description,
    className,
    id,
    value,
    onChange,
    autoFocus,
    disabled,
    children
  } = props;

  return (
    <div className='form__group'>
      <label className='form__label' htmlFor={id}>{label}</label>
      <FormDescription value={description} />
      <input
        type={type}
        id={id}
        name={name}
        className={c('form__control form__control--medium', className)}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
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
    description: T.oneOfType([
      T.node,
      T.object
    ]),
    className: T.string,
    id: T.string,
    value: T.string,
    onChange: T.func,
    autoFocus: T.bool,
    disabled: T.bool,
    children: T.node
  };
}

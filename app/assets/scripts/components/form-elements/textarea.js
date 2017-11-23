'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

import { FormDescription } from './misc';

export default function FormTextarea (props) {
  const {
    label,
    name,
    description,
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
      <FormDescription value={description} />
      <textarea
        id={id}
        name={name}
        className={c('form__control form__control--medium', className)}
        value={value || ''}
        onChange={onChange}
        autoFocus={autoFocus} />
      {children || null}
    </div>
  );
}

FormTextarea.defaultProps = {
  autoFocus: false
};

if (process.env.NODE_ENV !== 'production') {
  FormTextarea.propTypes = {
    label: T.string,
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
    children: T.node
  };
}

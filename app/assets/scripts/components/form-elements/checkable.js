'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';

export default function FormCheckable (props) {
  const {
    type,
    label,
    name,
    description,
    id,
    value,
    onChange,
    checked
  } = props;

  return (
    <label className={`form__option form__option--inline form__option--custom-${type}`}>
      <input name={name} id={id} value={value} onChange={onChange} checked={checked} type={type} />
      <span className='form__option__ui'></span>
      <span className='form__option__text'>{label} {description && <em>{description}</em>}</span>
    </label>
  );
}

FormCheckable.defaultProps = {
  checked: false
};

if (process.env.NODE_ENV !== 'production') {
  FormCheckable.propTypes = {
    type: T.oneOf(['checkbox', 'radio']),
    label: T.string,
    name: T.string,
    description: T.oneOfType([
      T.node,
      T.object
    ]),
    id: T.string,
    value: T.string,
    checked: T.bool,
    onChange: T.func
  };
}

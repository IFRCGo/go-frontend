'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

import { FormDescription } from './misc';

export default function FromSelect (props) {
  const {
    label,
    name,
    description,
    className,
    id,
    value,
    options,
    onChange,
    children
  } = props;

  return (
    <div className='form__group'>
      <label className='form__label' htmlFor={id}>{label}</label>
      <FormDescription value={description} />
      <select
        id={id}
        name={name}
        className={c('form__control form__control--medium', className)}
        value={value || ''}
        onChange={onChange}>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {children || null}
    </div>
  );
}

if (process.env.NODE_ENV !== 'production') {
  FromSelect.propTypes = {
    label: T.string,
    name: T.string,
    description: T.oneOfType([
      T.node,
      T.object
    ]),
    className: T.string,
    id: T.string,
    value: T.string,
    options: T.array,
    onChange: T.func,
    children: T.node
  };
}

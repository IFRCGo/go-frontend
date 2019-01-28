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
    classInput,
    classWrapper,
    classLabel,
    id,
    value,
    onChange,
    autoFocus,
    disabled,
    children,
    maxLength
  } = props;

  return (
    <div className={c('form__group', classWrapper)}>
      <div className='form__inner-header'>
        <div className='form__inner-headline'>
          <label className={c('form__label', classLabel)} htmlFor={id}>{label}</label>
          <FormDescription value={description} />
        </div>
      </div>
      <div className='form__inner-body'>
        <input
          type={type}
          id={id}
          name={name}
          className={c('form__control form__control--medium', classInput)}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          autoFocus={autoFocus}
          maxlength={maxLength}
        />
        {children || null}
      </div>
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
    classWrapper: T.string,
    classLabel: T.string,
    classInput: T.string,
    id: T.string,
    value: T.string,
    onChange: T.func,
    autoFocus: T.bool,
    disabled: T.bool,
    children: T.node,
    maxLength: T.number
  };
}

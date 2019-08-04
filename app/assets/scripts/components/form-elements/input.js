'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

import { FormDescription } from './misc';

export default function FormInput (props) {
  const {
    label,
    labelSecondary,
    type,
    name,
    description,
    placeholder,
    classInput,
    classWrapper,
    classLabel,
    id,
    value,
    onChange,
    autoFocus,
    disabled,
    children,
    maxLength,
    formInnerHeaderClass,
    formInnerBodyClass
  } = props;

  return (
    <div className={c('form__group', classWrapper)}>
      <div className={c('form__inner-header', formInnerHeaderClass)}>
        <div className='form__inner-headline'>
          <label className={c('form__label', classLabel)} htmlFor={id} >{label}</label>
          <FormDescription value={description} />
        </div>
      </div>
      <div className={c('form__inner-body', formInnerBodyClass)}>
        {labelSecondary ? (<label htmlFor={id} className='label-secondary'>{labelSecondary}</label>) : null}
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          className={c('form__control form__control--medium', classInput)}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          autoFocus={autoFocus}
          maxLength={maxLength}
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
    labelSecondary: T.string,
    type: T.string,
    name: T.string,
    description: T.oneOfType([
      T.node,
      T.object
    ]),
    placeholder: T.string,
    classWrapper: T.string,
    classLabel: T.string,
    classInput: T.string,
    formInnerHeaderClass: T.string,
    formInnerBodyClass: T.string,
    id: T.string,
    value: T.string,
    onChange: T.func,
    autoFocus: T.bool,
    disabled: T.bool,
    children: T.node,
    maxLength: T.number
  };
}

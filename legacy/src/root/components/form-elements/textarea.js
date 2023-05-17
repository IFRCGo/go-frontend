import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

import { FormDescription } from './misc';

export default function FormTextarea (props) {
  const {
    label,
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
    children
  } = props;

  return (
    <div className={c('form__group', classWrapper)}>
      <div className='form__group__wrap'>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <label className={c('form__label', classLabel)} htmlFor={id}>{label}</label>
            <FormDescription value={description} />
          </div>
        </div>
        <div className='form__inner-body'>
          <textarea
            id={id}
            name={name}
            className={c('form__control form__control--medium', classInput)}
            placeholder={placeholder}
            value={value || ''}
            disabled={disabled || false}
            onChange={onChange}
            autoFocus={autoFocus} />
          {children || null}
        </div>
      </div>
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
    placeholder: T.string,
    classWrapper: T.string,
    classLabel: T.string,
    classInput: T.string,
    id: T.string,
    value: T.string,
    onChange: T.func,
    autoFocus: T.bool,
    children: T.node
  };
}

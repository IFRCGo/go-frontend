'use strict';
import React from 'react';
import Select from 'react-select';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';
import { FormError } from './';
import { FormDescription } from './misc';

export default function FormInputSelect (props) {
  const {
    label,
    labelSecondary,
    selectLabel,
    type,
    name,
    errors,
    description,
    classInput,
    classWrapper,
    classLabel,
    id,
    inputValue,
    inputOnChange,
    selectValue,
    selectOnChange,
    selectLoadOptions,
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
          className={c('form__control form__control--medium', classInput)}
          value={inputValue || ''}
          onChange={inputOnChange}
          disabled={disabled}
          autoFocus={autoFocus}
          maxLength={maxLength}
        />
        {children || null}

        <div className="label-secondary global-margin-t">Or</div>

        <label className='label-secondary global-margin-t'>{selectLabel}</label>
        <Select.Async
          labelSecondary={selectLabel}
          value={selectValue}
          onChange={selectOnChange}
          loadOptions={selectLoadOptions} />

          <FormError
            errors={errors}
            property='event'
          />
      </div>
    </div>
  );
}

FormInputSelect.defaultProps = {
  autoFocus: false
};

if (process.env.NODE_ENV !== 'production') {
  FormInputSelect.propTypes = {
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

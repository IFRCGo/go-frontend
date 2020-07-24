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
    inputPlaceholder,
    selectValue,
    selectOnChange,
    selectPlaceholder,
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
      <div className='form__group__wrap'>
        <div className={c('form__inner-header', formInnerHeaderClass)}>
          <div className='form__inner-headline'>
            <label className={c('form__label', classLabel)} htmlFor={id} >{label}</label>
            <FormDescription value={description} />
          </div>
        </div>
        <div className={c('form__inner-body', formInnerBodyClass)}>
          <label className='label-secondary'>{selectLabel}</label>
          <Select.Async
            labelSecondary={selectLabel}
            value={selectValue}
            onChange={selectOnChange}
            placeholder={selectPlaceholder}
            loadOptions={selectLoadOptions}
            disabled={disabled} />

          {labelSecondary ? (<label htmlFor={id} className='label-secondary global-margin-t'>{labelSecondary}</label>) : null}
          <input
            type={type}
            id={id}
            name={name}
            placeholder={inputPlaceholder}
            className={c('form__control form__control--medium', classInput)}
            value={inputValue || ''}
            onChange={inputOnChange}
            disabled={disabled}
            autoFocus={autoFocus}
            maxLength={maxLength}
          />
          {children || null}

          {/* <div className="label-secondary global-margin-t">Or</div> */}

          <FormError
            errors={errors}
            property='event'
          />
        </div>
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
    labelSecondary: T.string,
    selectLabel: T.string,
    errors: T.array,
    inputValue: T.string,
    inputOnChange: T.func,
    inputPlaceholder: T.string,
    selectPlaceholder: T.string,
    selectValue: T.object,
    selectOnChange: T.func,
    selectLoadOptions: T.func,
    formInnerHeaderClass: T.string,
    formInnerBodyClass: T.string,
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

import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

import { FormDescription } from './misc';
import Tooltip from '#components/common/tooltip';

function FormInput (props) {
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
    formInnerBodyClass,
    inputCol,
    tooltipTitle,
    tooltipDescription
  } = props;

  return (
    <div className={c('form__group', classWrapper)}>
      <div className='form__group__wrap'>
        <div className={c('form__inner-header', formInnerHeaderClass)}>
          <div className='form__inner-headline'>
            <label className={c('form__label', classLabel)}>
              {label}
              { tooltipTitle || tooltipDescription
                ? (<Tooltip title={tooltipTitle} description={tooltipDescription} />) : null }
            </label>
            <FormDescription value={description} />
          </div>
        </div>
        <div className={c('form__inner-body', formInnerBodyClass)}>
          { inputCol
            ? (
              <div className={`col-${inputCol}-sm`}>
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
            )
            : 
            
            type==='textarea'
            ?
            (
              <React.Fragment>
                
                {labelSecondary ? (<label htmlFor={id} className='label-secondary'>{labelSecondary}</label>) : null}
                <textarea
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
                  rows={5}
                />
                {children || null}
              </React.Fragment>
            )
            
            :
            (
              <React.Fragment>
                
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
              </React.Fragment>
            )}
        </div>
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

const memoizedFormInput = React.memo(FormInput);

export default memoizedFormInput;

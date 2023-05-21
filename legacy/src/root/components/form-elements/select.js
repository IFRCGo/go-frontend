import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

import { FormDescription } from './misc';

export default function FromSelect (props) {
  const {
    label,
    name,
    description,
    classInput,
    classWrapper,
    classLabel,
    id,
    value,
    options,
    onChange,
    children
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
        {props.labelSecondary ? (<label htmlFor={id} className='label-secondary'>{props.labelSecondary}</label>) : null}
        <select
          id={id}
          name={name}
          className={c('form__control form__control--medium', classInput)}
          value={value || ''}
          onChange={onChange}>
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {children || null}
      </div>
    </div>
  );
}

if (process.env.NODE_ENV !== 'production') {
  FromSelect.propTypes = {
    label: T.string,
    labelSecondary: T.string,
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
    options: T.array,
    onChange: T.func,
    children: T.node
  };
}

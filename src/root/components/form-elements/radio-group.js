import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

import { FormDescription } from './misc';
import FormRadio from './radio';

export default function FormRadioGroup (props) {
  const {
    label,
    name,
    description,
    options,
    selectedOption,
    classWrapper,
    classLabel,
    inline,
    children,
    onChange,
    onClick
  } = props;

  return (
    <div className={c('form__group', classWrapper)}>
      <div className='form__inner-header'>
        <div className='form__inner-headline'>
          <label className={c('form__label', classLabel)}>{label}</label>
          <FormDescription value={description} />
        </div>
      </div>
      <div className='form__inner-body'>
        {options.map(o => (
          <FormRadio
            key={o.value}
            label={o.label}
            name={name}
            id={`${name}-${o.value}`}
            value={o.value}
            inline={inline}
            checked={selectedOption === o.value}
            onChange={onChange}
            onClick={onClick}
            description={o.description}
            disabled={o.disabled} />
        ))}
        {children || null}
      </div>
    </div>
  );
}

if (process.env.NODE_ENV !== 'production') {
  FormRadioGroup.propTypes = {
    label: T.string,
    name: T.string,
    description: T.oneOfType([
      T.node,
      T.object
    ]),
    options: T.array,
    selectedOption: T.string,
    classWrapper: T.string,
    classLabel: T.string,
    inline: T.bool,
    checked: T.bool,
    children: T.node,
    onChange: T.func,
    onClick: T.func
  };
}

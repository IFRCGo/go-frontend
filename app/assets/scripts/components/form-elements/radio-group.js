'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';

import { FormDescription } from './misc';
import FormRadio from './radio';

export default function FormRadioGroup (props) {
  const {
    label,
    name,
    description,
    options,
    selectedOption,
    onChange
  } = props;

  return (
    <div className='form__group'>
      <label className='form__label'>{label}</label>
      <FormDescription value={description} />
      {options.map(o => (
        <FormRadio
          key={o.value}
          label={o.label}
          name={name}
          id={`${name}-${o.value}`}
          value={o.value}
          checked={selectedOption === o.value}
          onChange={onChange}
          description={o.description} />
      ))}

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
    checked: T.bool,
    onChange: T.func
  };
}

'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';
import {
  FormInput,
  FormError
} from '../../components/form-elements/';

export default class ContactRow extends React.Component {
  onFieldChange (field, e) {
    const { values, onChange } = this.props;
    const newVals = Object.assign({}, values, {[field]: e.target.value});
    onChange(newVals);
  }

  render () {
    const {
      label,
      name,
      description,
      values,
      errors,
      fieldKey
    } = this.props;

    return (
      <div className='form__group contact-row'>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <label className='form__label'>{label}</label>
            <p className='form__description'>{description}</p>
          </div>
        </div>
        <div className='form__inner-body'>
          <FormInput
            label='Name'
            type='text'
            name={`${name}[name]`}
            id={`${name}-name`}
            classLabel='form__label--nested'
            value={values.name}
            onChange={this.onFieldChange.bind(this, 'name')} >
            <FormError
              errors={errors}
              property={`${fieldKey}.name`}
            />
          </FormInput>
          <FormInput
            label='Function'
            type='text'
            name={`${name}[func]`}
            id={`${name}-func`}
            classLabel='form__label--nested'
            value={values.func}
            onChange={this.onFieldChange.bind(this, 'func')} >
            <FormError
              errors={errors}
              property={`${fieldKey}.func`}
            />
          </FormInput>
          <FormInput
            label='Email'
            type='text'
            name={`${name}[email]`}
            id={`${name}-email`}
            classLabel='form__label--nested'
            value={values.email}
            onChange={this.onFieldChange.bind(this, 'email')} >
            <FormError
              errors={errors}
              property={`${fieldKey}.email`}
            />
          </FormInput>
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  ContactRow.propTypes = {
    label: T.string,
    name: T.string,
    description: T.string,
    values: T.shape({
      name: T.string,
      func: T.string,
      email: T.string
    }),
    fieldKey: T.string,
    errors: T.array,
    onChange: T.func
  };
}

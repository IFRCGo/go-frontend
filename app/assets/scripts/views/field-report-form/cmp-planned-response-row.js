'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';
import {
  FormInput,
  FormRadioGroup,
  FormError
} from '../../components/form-elements/';

export default class PlanResponseRow extends React.Component {
  onFieldChange (field, e) {
    const { values, onChange } = this.props;
    const newVals = Object.assign({}, values, {[field]: e.target.value});
    onChange(newVals);
  }

  render () {
    const {
      label,
      name,
      options,
      valueFieldLabel,
      values,
      errors,
      fieldKey
    } = this.props;

    return (
      <div className='form__group plan-response-row'>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <label className='form__label'>{label}</label>
          </div>
        </div>
        <div className='form__inner-body'>
          <FormRadioGroup
            name={`${name}[status]`}
            id={`${name}-status`}
            classLabel='visually-hidden'
            classWrapper='resp-status'
            label='Status'
            options={options}
            selectedOption={values.status}
            onChange={this.onFieldChange.bind(this, 'status')} />

          <FormInput
            label={valueFieldLabel}
            type='text'
            name={`${name}[value]`}
            id={`${name}-value`}
            classLabel='label-secondary'
            classWrapper='resp-value'
            value={values.value}
            onChange={this.onFieldChange.bind(this, 'value')} >
            <FormError
              errors={errors}
              property={`${fieldKey}.value`}
            />
          </FormInput>
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  PlanResponseRow.propTypes = {
    label: T.string,
    name: T.string,
    values: T.shape({
      status: T.string,
      value: T.string
    }),
    options: T.array,
    valueFieldLabel: T.string,
    fieldKey: T.string,
    errors: T.array,
    onChange: T.func
  };
}

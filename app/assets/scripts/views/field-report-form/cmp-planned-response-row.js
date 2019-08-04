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

  /*
    This is a pretty terrible hack, but we need the user to be able to "unset" a selected Radio option here
    So, if the radio being clicked is the same as the current selected value,
    we trigger `onFieldChange` to set the value back to `undefined`.
    FIXME: We should ideally re-think this whole thing a bit.
  */
  onRadioClick (e) {
    const {
      values
    } = this.props;
    const currentInput = e.target;
    const inputValue = currentInput.value;
    if (inputValue === values.status) {
      this.onFieldChange('status', {
        target: {
          value: undefined
        }
      });
    }
  }

  render () {
    const {
      label,
      name,
      description,
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
            <div className="form__description">
              {description}
            </div>
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
            onChange={this.onFieldChange.bind(this, 'status')}
            onClick={this.onRadioClick.bind(this)} />

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
    description: T.string,
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

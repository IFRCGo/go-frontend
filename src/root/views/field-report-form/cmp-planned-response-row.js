import React from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '#config';
import {
  FormInput,
  FormRadioGroup,
  FormError
} from '#components/form-elements/';
import LanguageContext from '#root/languageContext';

export default class PlanResponseRow extends React.Component {
  onFieldChange (field, e) {
    const { values, onChange } = this.props;
    const newVals = Object.assign({}, values, {[field]: e.target.value});
    onChange(newVals);
  }

  onClearSource (e) {
    const { values, onChange } = this.props;
    const newVals = Object.assign({}, values, {value: undefined, status: undefined});
    onChange(newVals);
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

    const { strings } = this.context;

    return (
      <div className='form__group plan-response-row form__group__fr'>
        <div className='form__group__wrap'>
          <div className='form__inner-header'>
            <div className='form__inner-headline'>
              <label className='form__label'>{label}</label>
              <div className="form__description">
                {description}
              </div>
            </div>
          </div>
          <div className='form__inner-body row flex-sm'>
            <FormRadioGroup
              label={strings.cmpPlannedStatus}
              name={`${name}[status]`}
              id={`${name}-status`}
              classLabel='visually-hidden'
              classWrapper='resp-status col col-8-sm'
              options={options}
              selectedOption={values.status}
              onChange={this.onFieldChange.bind(this, 'status')}
              >
              <FormError
                errors={errors}
                property={`${fieldKey}.status`}
              />
              </FormRadioGroup>

            <FormInput
              label={valueFieldLabel}
              type='text'
              name={`${name}[value]`}
              id={`${name}-value`}
              classLabel='label-secondary'
              classWrapper='resp-value col col-3-sm'
              value={values.value}
              onChange={this.onFieldChange.bind(this, 'value')} >
              <FormError
                errors={errors}
                property={`${fieldKey}.value`}
              />
            </FormInput>
            <div className='col-1-mid'>
              {values.value || values.status ? (
              <button type='button' className='button--clear-source' title='Clear Entry' onClick={this.onClearSource.bind(this)}></button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PlanResponseRow.contextType = LanguageContext;
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

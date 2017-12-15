'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import _set from 'lodash.set';
import _cloneDeep from 'lodash.clonedeep';
import c from 'classnames';

import { environment } from '../../config';
import * as formData from '../../utils/field-report-constants';
import {
  FormInput,
  FormRadioGroup,
  FormSelect,
  FormError
} from '../../components/form-elements/';

export default class Eru extends React.Component {
  onFieldChange (field, e) {
    const { values, onChange } = this.props;
    const newVals = _cloneDeep(values);
    _set(newVals, field, e.target.value);
    onChange(newVals);
  }

  onAddSource () {
    const { values, onChange } = this.props;
    onChange(values.concat({ type: undefined, status: undefined, units: undefined }));
  }

  onRemoveSource (idx) {
    const { values, onChange } = this.props;
    const newVals = _cloneDeep(values);
    newVals.splice(idx, 1);
    onChange(newVals);
  }

  canAdd () {
    // It is possible to add ERU until all types are exhausted.
    return this.props.values.length < formData.eruTypes.length - 1;
  }

  render () {
    const {
      label,
      name,
      values,
      fieldKey,
      errors
    } = this.props;

    const usedEruTypes = values.map(o => o.type);

    return (
      <div className='form__group'>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <label className='form__label'>{label}</label>
          </div>
          <div className='form__inner-actions'>
            <button type='button' className={c('button--add-item button--secondary-light', {disabled: !this.canAdd()})} title='Add new ERU' onClick={this.onAddSource.bind(this)}>Add another ERU</button>
          </div>
        </div>
        <div className='form__inner-body'>
          {values.map((o, idx) => {
            // Remove eru types already used. Each one can be used only once.
            const eruTypes = formData.eruTypes.filter(type => o.type === type.value || type.value === ''
              ? true
              : usedEruTypes.indexOf(type.value) === -1);

            return (
              <div key={o.type || `idx-${idx}`} className='eru'>
                <FormSelect
                  label='Type'
                  name={`${name}[${idx}][type]`}
                  id={`${name}-${idx}-type`}
                  classLabel='form__label--nested'
                  classWrapper='eru__item-type'
                  options={eruTypes}
                  value={o.type}
                  onChange={this.onFieldChange.bind(this, `[${idx}].type`)} >
                  <FormError
                    errors={errors}
                    property={`${fieldKey}[${idx}].type`}
                  />
                </FormSelect>

                <FormRadioGroup
                  label='Status'
                  name={`${name}[${idx}][status]`}
                  classLabel='form__label--nested'
                  classWrapper='eru__item-status'
                  options={[
                    {
                      label: 'Planned',
                      value: '2'
                    },
                    {
                      label: 'Requested',
                      value: '1'
                    },
                    {
                      label: 'Deployed',
                      value: '3'
                    }
                  ]}
                  selectedOption={o.status}
                  onChange={this.onFieldChange.bind(this, `[${idx}].status`)} />

                <FormInput
                  label='Units'
                  type='text'
                  name={`${name}[${idx}][units]`}
                  id={`${name}-${idx}-units`}
                  classLabel='form__label--nested'
                  classWrapper='eru__item-units'
                  value={o.units}
                  onChange={this.onFieldChange.bind(this, `[${idx}].units`)} >
                  <FormError
                    errors={errors}
                    property={`${fieldKey}[${idx}].units`}
                  />
                </FormInput>

                <div className='eru__item-actions'>
                  <button type='button' className={c('button--remove-source', {disabled: values.length <= 1})} title='Delete ERU' onClick={this.onRemoveSource.bind(this, idx)}>Delete ERU</button>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  Eru.propTypes = {
    label: T.string,
    name: T.string,
    values: T.array,
    fieldKey: T.string,
    errors: T.array,
    onChange: T.func
  };
}

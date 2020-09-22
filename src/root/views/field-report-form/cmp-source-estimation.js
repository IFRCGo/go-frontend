import React from 'react';
import { PropTypes as T } from 'prop-types';
import _cloneDeep from 'lodash.clonedeep';
import c from 'classnames';

import { environment } from '#config';
import * as formData from '#utils/field-report-constants';
import {
  FormInput,
  FormRadioGroup,
  FormError
} from '#components/form-elements/';
import LanguageContext from '#root/languageContext';

export default class SourceEstimation extends React.Component {
  onEstimationChange (idx, e) {
    const { values, onChange } = this.props;
    const newVals = _cloneDeep(values);
    newVals[idx].estimation = e.target.value === '' ? undefined :  e.target.value;
    onChange(newVals);
  }

  onSourceChange (idx, e) {
    const { values, onChange } = this.props;
    const val = e.target.value;
    let newVals = _cloneDeep(values);
    // Ensure vertical exclusivity in the radio button matrix.
    newVals = newVals.map(o => {
      if (o.source === val) o.source = undefined;
      return o;
    });
    newVals[idx].source = val;
    onChange(newVals);
  }

  onAddSource () {
    const { values, onChange } = this.props;
    onChange(values.concat({estimation: undefined, source: undefined}));
  }

  onClearSource (idx) {
    const { values, onChange } = this.props;
    let newVals = _cloneDeep(values);
    newVals[idx].source = undefined;
    newVals[idx].estimation = undefined;
    onChange(newVals);
  }

  render () {
    const {
      label,
      status,
      estimationLabel,
      name,
      description,
      values,
      fieldKey,
      errors
    } = this.props;

    const { strings } = this.context;

    return (
      <div className='form__group estimation-row form__group__fr'>
        <div className='form__group__wrap'>
          <div className='form__inner-header'>
            <div className='form__inner-headline'>
              <label className='form__label'>{label}</label>
              <p className='form__description'>{description}</p>
            </div>
          </div>
          <div className='form__inner-body'>
            {values.map((o, idx) => (
              <div key={o.source || idx} className='estimation row flex-mid'>
                <FormInput
                  label={estimationLabel}
                  type={fieldKey !== 'affectedPopCentres' ? 'number': 'text'}
                  name={`${name}[${idx}][estimation]`}
                  id={`${name}-${idx}-estimation`}
                  classLabel={c('label-secondary', {'visually-hidden': idx > 0})}
                  classWrapper='estimation__item-field col col-4-mid spacing-b'
                  value={o.estimation}
                  onChange={this.onEstimationChange.bind(this, idx)} >
                  <FormError
                    errors={errors}
                    property={`${fieldKey}[${idx}].estimation`}
                  />
                </FormInput>

                <FormRadioGroup
                  label={strings.cmpSourceLabel}
                  name={`${name}[${idx}][source]`}
                  options={formData.getFieldsStep2(strings).organizations[status]}
                  classLabel={c('label-secondary', {'visually-hidden': idx > 0})}
                  classWrapper='estimation__item col col-6-mid'
                  selectedOption={o.source}
                  onChange={this.onSourceChange.bind(this, idx)}>
                    <FormError
                    errors={errors}
                    property={`${fieldKey}[${idx}].source`}
                  />
                  </FormRadioGroup>
                  <div className='col-2-mid'>
                    {values[idx].estimation || values[idx].source ? (
                    <button type='button' className='button--clear-source' title='Clear Entry' onClick={this.onClearSource.bind(this, idx)}></button>
                    ) : null}
                  </div>
                {/*
                We do not want these buttons to Add new sources any more.
                Leaving commented out for now. When we delete this, we should
                also remove other bits of code that this feature refers to.
                <div className='estimation__item estimation__item--actions'>
                  {values.length > 1 ? (
                    <button type='button' className='button--remove-source' title='Delete Source' onClick={this.onRemoveSource.bind(this, idx)}>Delete source</button>
                  ) : (
                    <button type='button' className='button--add-item button--secondary-light' title='Add new source' onClick={this.onAddSource.bind(this)}>Add source</button>
                  )}
                </div>
                */}
              </div>
            ))}

          </div>
        </div>
      </div>
    );
  }
}

SourceEstimation.contextType = LanguageContext;
if (environment !== 'production') {
  SourceEstimation.propTypes = {
    label: T.string,
    name: T.string,
    description: T.string,
    values: T.array,
    fieldKey: T.string,
    errors: T.array,
    onChange: T.func
  };
}

import React from 'react';
import { PropTypes as T } from 'prop-types';
// import _cloneDeep from 'lodash.clonedeep';
import c from 'classnames';

import { environment } from '#config';
// import * as formData from '#utils/field-report-constants';
import {
  FormInput,
  FormError
} from '#components/form-elements';

export default class EPISourceEstimation extends React.Component {
  // Is this even necessary or could be handled elsewhere?
  onEstimationChange (e) {
    const { onChange } = this.props;
    const newVals = e.target.value;
    onChange(newVals);
  }

  render () {
    const {
      label,
      estimationLabel,
      name,
      description,
      values,
      fieldKey,
      errors
    } = this.props;

    // class for label indentation
    let labelClass = 'form__inner-header';
    if (name === 'epi-suspected-cases'
      || name === 'epi-probable-cases'
      || name === 'epi-confirmed-cases'
    ) {
      labelClass = 'form__inner-header epi-label-indent';
    }

    return (
      <div className={ name === 'epi-num-dead' || name === 'epi-deaths-since-last-fr'
        ? 'form__group estimation-row form__group__fr'
        : 'form__group estimation-row epi-form-group form__group__fr'
      }>
        <div className='form__group__wrap'>
          <div className={labelClass}>
            <div className='form__inner-headline'>
              <label className='form__label'>{label}</label>
              <p className='form__description'>{description}</p>
            </div>
          </div>
          <div className='form__inner-body'>
            <div key={fieldKey} className='estimation'>
              <FormInput
                label={estimationLabel}
                type='text'
                name={name}
                id={`${name}-estimation`}
                classLabel={c('label-secondary', {'visually-hidden': 1 > 0})}
                classWrapper='estimation__item-field'
                value={values}
                onChange={this.onEstimationChange.bind(this)} >
                <FormError
                  errors={errors}
                  property={`${fieldKey}`}
                />
              </FormInput>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  EPISourceEstimation.propTypes = {
    label: T.string,
    name: T.string,
    description: T.string,
    values: T.string,
    fieldKey: T.string,
    errors: T.array,
    onChange: T.func
  };
}

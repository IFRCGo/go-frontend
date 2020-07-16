import React from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '#config';
import {
  FormInput,
  FormError
} from '#components/form-elements/';
import LanguageContext from '#root/languageContext';

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

    const { strings } = this.context;

    return (
      <div className='form__group contact-row'>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <label className='form__label'>{label}</label>
            <p className='form__description'>{description}</p>
          </div>
        </div>
        <div className='form__inner-body'>
          <div className='row'>
            <div className='col col-6-mid'>
              <FormInput
                label={strings.cmpContactName}
                type='text'
                name={`${name}[name]`}
                id={`${name}-name`}
                classLabel='label-secondary'
                value={values.name}
                onChange={this.onFieldChange.bind(this, 'name')} >
                <FormError
                  errors={errors}
                  property={`${fieldKey}.name`}
                />
              </FormInput>
            </div>
            <div className='col col-6-mid'>
              <FormInput
                label={strings.cmpContactTitle}
                type='text'
                name={`${name}[title]`}
                id={`${name}-title`}
                classLabel='label-secondary'
                value={values.title}
                onChange={this.onFieldChange.bind(this, 'title')} >
                <FormError
                  errors={errors}
                  property={`${fieldKey}.title`}
                />
              </FormInput>
            </div>
            <div className='col col-6-mid'>
              <FormInput
                label={strings.cmpContactEmail}
                type='text'
                name={`${name}[email]`}
                id={`${name}-email`}
                classLabel='label-secondary'
                value={values.email}
                onChange={this.onFieldChange.bind(this, 'email')} >
                <FormError
                  errors={errors}
                  property={`${fieldKey}.email`}
                />
              </FormInput>
            </div>
            <div className='col col-6-mid'>
              <FormInput
                label={strings.cmpContactPhone}
                type='text'
                name={`${name}[phone]`}
                id={`${name}-phone`}
                classLabel='label-secondary'
                value={values.phone}
                onChange={this.onFieldChange.bind(this, 'phone')} >
                <FormError
                  errors={errors}
                  property={`${fieldKey}.phone`}
                />
              </FormInput>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ContactRow.contextType = LanguageContext;

if (environment !== 'production') {
  ContactRow.propTypes = {
    label: T.string,
    name: T.string,
    description: T.string,
    values: T.shape({
      name: T.string,
      title: T.string,
      email: T.string,
      phone: T.string
    }),
    fieldKey: T.string,
    errors: T.array,
    onChange: T.func
  };
}

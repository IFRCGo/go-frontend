'use strict';
import React from 'react';
import { Link } from 'react-router-dom';
import _set from 'lodash.set';
import _cloneDeep from 'lodash.clonedeep';
import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';
import Select from 'react-select';

import { isValidEmail, isRedCrossEmail, get } from '../utils/utils';
import { countries, orgTypes } from '../utils/field-report-constants';

import App from './app';
import { FormInput, FormError } from '../components/form-elements/';
import registerSchemaDef from '../schemas/register';

const ajv = new Ajv({ $data: true, allErrors: true, errorDataPath: 'property' });
ajvKeywords(ajv);
const registerValidator = ajv.compile(registerSchemaDef);

const getClassIfError = (errors, prop) => {
  if (!errors) return '';
  let err = errors.find(o => o.dataPath === `.${prop}`);
  return err ? 'form__control--danger' : '';
};

export default class Login extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      data: {
        username: undefined,
        firstname: undefined,
        lastname: undefined,
        email: undefined,
        password: undefined,
        passwordConf: undefined,

        organization: undefined,
        organizationType: undefined,

        country: undefined,
        city: undefined,
        department: undefined,
        position: undefined,
        phoneNumber: undefined,

        contact: [0, 1].map(o => ({ name: undefined, email: undefined }))
      },
      errors: []
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  prepStateForValidation (state) {
    let payload = _cloneDeep(state);
    payload.country = get(state, 'country.value') || undefined;
    payload.organizationType = get(state, 'organizationType.value') || undefined;
    return payload;
  }

  onSubmit () {
    const payload = this.prepStateForValidation(this.state.data);
    registerValidator(payload);
    this.setState({ errors: _cloneDeep(registerValidator.errors) });

    if (registerValidator.errors !== null) {
      return null;
    }
  }

  onFieldChange (field, e) {
    let data = _cloneDeep(this.state.data);
    let val = e.target ? e.target.value : e;
    _set(data, field, val === '' || val === null ? undefined : val);
    this.setState({data});
  }

  shouldRequestAccess () {
    return this.state.data.email && isValidEmail(this.state.data.email) && !isRedCrossEmail(this.state.data.email);
  }

  renderPasswordFields () {
    return (
      <div className='form__hascol form__hascol--2'>
        <FormInput
          label='Password *'
          type='password'
          name='register-password'
          id='register-password'
          classInput={getClassIfError(this.state.errors, 'password')}
          value={this.state.data.password}
          onChange={this.onFieldChange.bind(this, 'password')}
        >
          <FormError
            errors={this.state.errors}
            property='password'
          />
        </FormInput>
        <FormInput
          label='Confirm Password *'
          type='password'
          name='register-password-conf'
          id='register-password-conf'
          classInput={getClassIfError(this.state.errors, 'passwordConf')}
          value={this.state.data.passwordConf}
          onChange={this.onFieldChange.bind(this, 'passwordConf')}
        >
          <FormError
            errors={this.state.errors}
            property='passwordConf'
          />
        </FormInput>
      </div>
    );
  }

  renderAdditionalInfo () {
    return (
      <div className='form__hascol form__hascol--2'>
        <div className='form__group'>
          <label className='form__label'>Country *</label>
          <Select
            name='country'
            value={this.state.data.country}
            onChange={this.onFieldChange.bind(this, 'country')}
            options={countries} />
          <FormError
            errors={this.state.errors}
            property='country'
          />
        </div>
        <FormInput
          label='City *'
          type='text'
          name='register-city'
          id='register-city'
          classInput={getClassIfError(this.state.errors, 'city')}
          value={this.state.data.city}
          onChange={this.onFieldChange.bind(this, 'city')} />
        <div className='form__group'>
          <label className='form__label'>Organization Type *</label>
          <Select
            name='organizationType'
            value={this.state.data.organizationType}
            onChange={this.onFieldChange.bind(this, 'organizationType')}
            options={orgTypes} />
          <FormError
            errors={this.state.errors}
            property='organizationType'
          />
        </div>
        <FormInput
          label='Organization Name *'
          type='text'
          name='register-organization'
          id='register-organization'
          classInput={getClassIfError(this.state.errors, 'organization')}
          value={this.state.data.organization}
          onChange={this.onFieldChange.bind(this, 'organization')}
        >
          <FormError
            errors={this.state.errors}
            property='organization'
          />
        </FormInput>
        <FormInput
          label='Department *'
          type='text'
          name='register-department'
          id='register-department'
          classInput={getClassIfError(this.state.errors, 'department')}
          value={this.state.data.department}
          onChange={this.onFieldChange.bind(this, 'department')}
        >
          <FormError
            errors={this.state.errors}
            property='department'
          />
        </FormInput>
        <FormInput
          label='Position *'
          type='text'
          name='register-position'
          id='register-position'
          classInput={getClassIfError(this.state.errors, 'position')}
          value={this.state.data.position}
          onChange={this.onFieldChange.bind(this, 'position')}
        >
          <FormError
            errors={this.state.errors}
            property='position'
          />
        </FormInput>
        <FormInput
          label='Phone Number'
          type='text'
          name='register-phoneNumber'
          id='register-phoneNumber'
          classInput={getClassIfError(this.state.errors, 'phoneNumber')}
          value={this.state.data.phoneNumber}
          onChange={this.onFieldChange.bind(this, 'phoneNumber')}
        >
          <FormError
            errors={this.state.errors}
            property='phoneNumber'
          />
        </FormInput>
      </div>
    );
  }

  renderContactRequest () {
    if (!this.shouldRequestAccess()) {
      return null;
    }

    return (
      <div>
        <p className='form__note'>
          It appears you do not have an official Red Cross email, we will need to verify your status. Please provide the names and email address of two Red Cross members for us to contact.
        </p>
        {[0, 1].map(o => (
          <div key={o} className='form__hascol form__hascol--2'>
            <FormInput
              label='Contact name'
              type='text'
              name={`register-contact[${o}][name]`}
              id={`register-contact-name-${o}`}
              classInput={getClassIfError(this.state.errors, `contact[${o}].name`)}
              value={this.state.data.contact[o].name}
              onChange={this.onFieldChange.bind(this, `contact[${o}].name`)}
            >
              <FormError
                errors={this.state.errors}
                property={`contact[${o}].name`}
              />
            </FormInput>
            <FormInput
              label='Contact email'
              type='text'
              name={`register-contact[${o}][email]`}
              id={`register-contact-email-${o}`}
              classInput={getClassIfError(this.state.errors, `contact[${o}].email`)}
              value={this.state.data.contact[o].email}
              onChange={this.onFieldChange.bind(this, `contact[${o}].email`)}
            >
              <FormError
                errors={this.state.errors}
                property={`contact[${o}].email`}
              />
            </FormInput>
          </div>
        ))}
      </div>
    );
  }

  renderSubmitButton () {
    return this.shouldRequestAccess() ? (
      <button className='mfa-tick' type='button' onClick={this.onSubmit}><span>Request Access</span></button>
    ) : (
      <button className='mfa-tick' type='button' onClick={this.onSubmit}><span>Register</span></button>
    );
  }

  render () {
    return (
      <App className='page--register'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <div className='inpage__title--centered'>
                  <h1 className='inpage__title'>Register</h1>
                </div>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <form className='form form--centered' onSubmit={this.onSubmit}>
                <FormInput
                  label='Email *'
                  type='text'
                  name='register-email'
                  id='register-email'
                  classInput={getClassIfError(this.state.errors, 'email')}
                  value={this.state.data.email}
                  onChange={this.onFieldChange.bind(this, 'email')}
                  autoFocus
                >
                  <FormError
                    errors={this.state.errors}
                    property='email'
                  />
                </FormInput>

                {this.renderPasswordFields()}
                {this.renderAdditionalInfo()}
                {this.renderContactRequest()}
                <div className='form__footer'>
                  {this.renderSubmitButton()}
                  <p>
                    Already have an account? <Link to='/login' title='Go to login page'><span>Log in.</span></Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

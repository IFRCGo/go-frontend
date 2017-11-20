'use strict';
import React from 'react';
import { Link } from 'react-router-dom';
import _set from 'lodash.set';
import _cloneDeep from 'lodash.clonedeep';
import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';

import { isValidEmail, isRedCrossEmail } from '../utils/utils';

import App from './app';
import { FormInput, FormError } from '../components/form-elements';
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
        email: undefined,
        password: undefined,
        passwordConf: undefined,
        country: undefined,
        organization: undefined,
        contact: [0, 1].map(o => ({ name: undefined, email: undefined }))
      },
      errors: []
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit () {
    registerValidator(this.state.data);
    this.setState({ errors: _cloneDeep(registerValidator.errors) });

    if (registerValidator.errors !== null) {
      return null;
    }
  }

  onFieldChange (field, e) {
    let data = _cloneDeep(this.state.data);
    let val = e.target.value;
    _set(data, field, val === '' ? undefined : val);
    this.setState({data});
  }

  shouldRequestAccess () {
    return this.state.data.email && isValidEmail(this.state.data.email) && !isRedCrossEmail(this.state.data.email);
  }

  renderPasswordFields () {
    return (
      <div className='form__hascol form__hascol--2'>
        <FormInput
          label='Password'
          type='password'
          name='register-password'
          id='register-password'
          className={getClassIfError(this.state.errors, 'password')}
          value={this.state.data.password}
          onChange={this.onFieldChange.bind(this, 'password')}
        >
          <FormError
            errors={this.state.errors}
            property='password'
          />
        </FormInput>
        <FormInput
          label='Confirm Password'
          type='password'
          name='register-password-conf'
          id='register-password-conf'
          className={getClassIfError(this.state.errors, 'passwordConf')}
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
        <FormInput
          label='Country'
          type='text'
          name='register-country'
          id='register-country'
          className={getClassIfError(this.state.errors, 'country')}
          value={this.state.data.country}
          onChange={this.onFieldChange.bind(this, 'country')}
        >
          <FormError
            errors={this.state.errors}
            property='country'
          />
        </FormInput>
        <FormInput
          label='Organization'
          type='text'
          name='register-organization'
          id='register-organization'
          className={getClassIfError(this.state.errors, 'organization')}
          value={this.state.data.organization}
          onChange={this.onFieldChange.bind(this, 'organization')}
        >
          <FormError
            errors={this.state.errors}
            property='organization'
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
              className={getClassIfError(this.state.errors, `contact[${o}].name`)}
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
              className={getClassIfError(this.state.errors, `contact[${o}].email`)}
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
                <h1 className='inpage__title'>Register</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <form className='form form--centered' onSubmit={this.onSubmit}>
                <FormInput
                  label='Email'
                  type='text'
                  name='register-email'
                  id='register-email'
                  className={getClassIfError(this.state.errors, 'email')}
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

                {this.renderSubmitButton()}

                <p>
                  Already have an account? <Link to='/login' title='Go to login page'><span>Log in.</span></Link>
                </p>
              </form>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

'use strict';
import React from 'react';
import { Link } from 'react-router-dom';
import c from 'classnames';
import { default as _set } from 'lodash.set';
import { default as _cloneDeep } from 'lodash.clonedeep';

import { isValidEmail, isRedCrossEmail } from '../utils/utils';

import App from './app';
import { FormInput } from '../components/form-elements';

export default class Login extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      data: {
        email: '',
        password: '',
        passwordConf: '',
        country: '',
        organization: '',
        contact: [0, 1].map(o => ({ name: '', email: '' }))
      }
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit () {
  }

  onFieldChange (field, e) {
    let data = _cloneDeep(this.state.data);
    _set(data, field, e.target.value);
    this.setState({data});
  }

  allowSubmit () {
    // Do proper validation.
    return this.state.data.email && this.state.data.password;
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
          value={this.state.data.password}
          onChange={this.onFieldChange.bind(this, 'password')}
        />
        <FormInput
          label='Confirm Password'
          type='password'
          name='register-password-conf'
          id='register-password-conf'
          value={this.state.data.passwordConf}
          onChange={this.onFieldChange.bind(this, 'passwordConf')}
        />
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
          value={this.state.data.country}
          onChange={this.onFieldChange.bind(this, 'country')}
        />
        <FormInput
          label='Organization'
          type='text'
          name='register-organization'
          id='register-organization'
          value={this.state.data.organization}
          onChange={this.onFieldChange.bind(this, 'organization')}
        />
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
              value={this.state.data.contact[o].name}
              onChange={this.onFieldChange.bind(this, `contact[${o}].name`)}
            />
            <FormInput
              label='Contact email'
              type='text'
              name={`register-contact[${o}][email]`}
              id={`register-contact-email-${o}`}
              value={this.state.data.contact[o].email}
              onChange={this.onFieldChange.bind(this, `contact[${o}].email`)}
            />
          </div>
        ))}
      </div>
    );
  }

  renderSubmitButton () {
    return this.shouldRequestAccess() ? (
      <button className={c('mfa-tick', { disabled: !this.allowSubmit() })} type='button' onClick={this.onSubmit}><span>Request Access</span></button>
    ) : (
      <button className={c('mfa-tick', { disabled: !this.allowSubmit() })} type='button' onClick={this.onSubmit}><span>Register</span></button>
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
                  value={this.state.data.email}
                  onChange={this.onFieldChange.bind(this, 'email')}
                  autoFocus
                />

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

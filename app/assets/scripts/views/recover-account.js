'use strict';
import React from 'react';
import c from 'classnames';

import App from './app';
import { FormInput } from '../components/form-elements/';

export default class RecoverAccount extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      data: {
        email: ''
      }
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit () {
  }

  onFieldChange (field, e) {
    let data = Object.assign({}, this.state.data, {[field]: e.target.value});
    this.setState({data});
  }

  allowSubmit () {
    // Do proper validation.
    return this.state.data.email;
  }

  render () {
    return (
      <App className='page--login'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Recover Account</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <form className='form form--centered' onSubmit={this.onSubmit}>
                <p className='form__note'>
                  Insert the email you used during registration
                </p>
                <FormInput
                  label='Email'
                  type='text'
                  name='login-email'
                  id='login-email'
                  value={this.state.data.email}
                  onChange={this.onFieldChange.bind(this, 'email')}
                  autoFocus
                />

                <button className={c('mfa-tick', { disabled: !this.allowSubmit() })} type='button' onClick={this.onSubmit}><span>Recover</span></button>
              </form>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

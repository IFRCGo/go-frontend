'use strict';
import React from 'react';
import { Link } from 'react-router-dom';
import c from 'classnames';

import App from './app';
import { FormInput } from '../components/form-elements';

export default class Login extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      data: {
        email: '',
        password: ''
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
    return this.state.data.email && this.state.data.password;
  }

  render () {
    return (
      <App className='page--login'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Login</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <form className='form form--centered' onSubmit={this.onSubmit}>
                <FormInput
                  label='Email'
                  type='text'
                  name='login-email'
                  id='login-email'
                  value={this.state.data.email}
                  onChange={this.onFieldChange.bind(this, 'email')}
                  autoFocus
                />
                <FormInput
                  label='Password'
                  type='password'
                  name='login-password'
                  id='login-password'
                  value={this.state.data.password}
                  onChange={this.onFieldChange.bind(this, 'password')} >

                  <p className='form__help'>
                    <Link to='/recover-account' title='Recover password'><span>I forgot my password.</span></Link>
                  </p>
                </FormInput>

                <button className={c('mfa-tick', { disabled: !this.allowSubmit() })} type='button' onClick={this.onSubmit}><span>Login</span></button>
                <p>
                  Don’t have an account? <Link to='/register' title='Create new account'><span>Sign Up.</span></Link>
                </p>
              </form>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

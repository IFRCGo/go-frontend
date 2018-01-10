'use strict';
import React from 'react';
import c from 'classnames';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';

import { environment } from '../config';

import App from './app';
import { recoverPassword } from '../actions';
import { FormInput, FormError } from '../components/form-elements/';
import { isValidEmail } from '../utils/utils';
import { showAlert } from '../components/system-alerts';
import NewPassword from '../components/connected/new-password';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';

class RecoverAccount extends React.Component {
  constructor (props) {
    super(props);
    const { params } = this.props.match;
    const hasTokens = params.username && params.token;
    this.state = {
      data: {
        email: ''
      },
      errors: null,
      hasTokens
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.hasTokens) { return; }
    if (this.props.password.fetching && !nextProps.password.fetching) {
      hideGlobalLoading();
      if (nextProps.password.error) {
        showAlert('danger', <p><strong>Error:</strong> {nextProps.password.error.error_message}</p>, true, 4500);
      } else {
        showAlert('success', <p>Success! Password changed, redirecting...</p>, true, 2000);
        setTimeout(() => this.props.history.push('/account'), 2000);
      }
    }
  }

  onSubmit (e) {
    e.preventDefault();
    const errors = isValidEmail(this.state.data.email) ? null
      : [{ dataPath: '.email', message: 'Please enter a valid email' }];
    this.setState({ errors });
    if (errors === null) {
      showGlobalLoading();
      this.props._recoverPassword(this.state.data.email);
    }
  }

  onFieldChange (field, e) {
    let data = Object.assign({}, this.state.data, {[field]: e.target.value});
    this.setState({data});
  }

  allowSubmit () {
    return this.state.data.email;
  }

  renderEmailForm () {
    return (
      <form className='form form--centered' onSubmit={this.onSubmit}>
        <p className='form__note'>
          Enter the email you used during registration
        </p>
        <FormInput
          label='Email'
          type='text'
          name='login-email'
          id='login-email'
          value={this.state.data.email}
          onChange={this.onFieldChange.bind(this, 'email')}
          autoFocus
        >
          <FormError
            errors={this.state.errors}
            property='email'
          />
        </FormInput>
        <button className={c('mfa-tick', { disabled: !this.allowSubmit() })} type='button' onClick={this.onSubmit}><span>Recover</span></button>
      </form>
    );
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
              {this.state.hasTokens ? <NewPassword verifyOldPassword={false} /> : this.renderEmailForm()}
            </div>
          </div>
        </section>
      </App>
    );
  }
}

if (environment !== 'production') {
  RecoverAccount.propTypes = {
    history: T.object,
    match: T.object,
    password: T.object,
    _recoverPassword: T.func
  };
}
const selector = (state) => ({
  password: state.password
});

const dispatcher = (dispatch) => ({
  _recoverPassword: (email) => dispatch(recoverPassword(email))
});

export default connect(selector, dispatcher)(RecoverAccount);

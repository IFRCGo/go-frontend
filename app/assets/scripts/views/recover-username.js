'use strict';
import React from 'react';
import c from 'classnames';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Helmet } from 'react-helmet';

import { environment } from '../config';

import App from './app';
import { showUsername } from '../actions';
import { FormInput, FormError } from '../components/form-elements/';
import { isValidEmail } from '../utils/utils';
import { showAlert } from '../components/system-alerts';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';

class RecoverUsername extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      data: {
        email: ''
      },
      errors: null
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.email.fetching && !nextProps.email.fetching) {
      hideGlobalLoading();
      showAlert('success', <p>If the given email address exists here, you will find an email in your mailbox...</p>, true, 3000);
      setTimeout(() => this.props.history.push('/login'), 3000);
    }
  }

  onSubmit (e) {
    e.preventDefault();
    const errors = isValidEmail(this.state.data.email) ? null
      : [{ dataPath: '.email', message: 'Please enter a valid email' }];
    this.setState({ errors });
    if (errors === null) {
      showGlobalLoading();
      this.props._showUsername(this.state.data.email);
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
        <button className={c('mfa-tick', { disabled: !this.allowSubmit() })} type='button' onClick={this.onSubmit}><span>Send me my username</span></button>
      </form>
    );
  }

  render () {
    return (
      <App className='page--login'>
        <Helmet>
          <title>IFRC Go - Recover Username</title>
        </Helmet>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Getting the given Username</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              {this.renderEmailForm()}
            </div>
          </div>
        </section>
      </App>
    );
  }
}

if (environment !== 'production') {
  RecoverUsername.propTypes = {
    history: T.object,
    match: T.object,
    email: T.object,
    _showUsername: T.func
  };
}
const selector = (state) => ({
  email: state.email
});

const dispatcher = (dispatch) => ({
  _showUsername: (email) => dispatch(showUsername(email))
});

export default connect(selector, dispatcher)(RecoverUsername);

'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import c from 'classnames';

import { getAuthToken } from '../actions';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';

import App from './app';
import { FormInput } from '../components/form-elements';

class Login extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      data: {
        email: '',
        password: ''
      },
      authenticated: false
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit () {
    this.props._getAuthToken(this.state.data.email, this.state.data.password);
    showGlobalLoading();
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.user.fetching && !nextProps.user.fetching) {
      if (!nextProps.user.error) {
        hideGlobalLoading(() => {
          this.setState({ authenticated: true });
        });
      }
    }
  }

  onFieldChange (field, e) {
    let data = Object.assign({}, this.state.data, {[field]: e.target.value});
    this.setState({data});
  }

  allowSubmit () {
    // Do proper validation.
    return this.state.data.email && this.state.data.password;
  }

  renderError () {
    const error = this.props.user.error;
    if (!error) { return null; }

    if (error.statusCode === 400) {
      return <p className='form__note'>Invalid username or password</p>;
    }

    return <p className='form__note'>Error: {error.message}</p>;
  }

  render () {
    if (this.state.authenticated) {
      const { from } = this.props.location.state || { from: { pathname: '/' } };
      return (
        <Redirect to={from}/>
      );
    }

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

                {this.renderError()}

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

if (process.env.NODE_ENV !== 'production') {
  Login.propTypes = {
    _getAuthToken: T.func,
    user: T.object,
    location: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  user: state.user
});

const dispatcher = (dispatch) => ({
  _getAuthToken: (...args) => dispatch(getAuthToken(...args))
});

export default connect(selector, dispatcher)(Login);

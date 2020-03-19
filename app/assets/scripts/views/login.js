'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import c from 'classnames';
import { Helmet } from 'react-helmet';

import { getAuthToken } from '../actions';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';

import App from './app';
import { FormInput } from '../components/form-elements/';

class Login extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      data: {
        username: '',
        password: ''
      },
      authenticated: false
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit (e) {
    e.preventDefault();
    this.props._getAuthToken(this.state.data.username, this.state.data.password);
    showGlobalLoading();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.user.fetching && !nextProps.user.fetching) {
      hideGlobalLoading();
      if (!nextProps.user.error) {
        this.setState({ authenticated: true });
      }
    }
  }

  onFieldChange (field, e) {
    let data = Object.assign({}, this.state.data, {[field]: e.target.value});
    this.setState({data});
  }

  allowSubmit () {
    // Do proper validation.
    return this.state.data.username && this.state.data.password;
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
        <Helmet>
          <title>IFRC Go - Login</title>
        </Helmet>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <div className='inpage__title--centered'>
                  <h1 className='inpage__title'>Login</h1>
                </div>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <form className='form form--centered' onSubmit={this.onSubmit}>
                <FormInput
                  label='Username'
                  type='text'
                  name='login-username'
                  id='login-username'
                  value={this.state.data.username}
                  onChange={this.onFieldChange.bind(this, 'username')}
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
                    <br/>
                    <Link to='/recover-username' title='Show me my username'><span>I forgot my username only.</span></Link>
                  </p>
                </FormInput>

                {this.renderError()}
                <div className='form__footer'>
                  <button className={c('mfa-tick', { disabled: !this.allowSubmit() })} type='submit' onClick={this.onSubmit}><span>Login</span></button>
                  <p>
                   Don’t have an account? <Link to='/register' title='Create new account'><span>Sign Up.</span></Link>
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

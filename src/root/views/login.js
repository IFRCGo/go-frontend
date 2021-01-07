import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import c from 'classnames';
import { Helmet } from 'react-helmet';

import { getAuthToken } from '#actions';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';
import BreadCrumb from '#components/breadcrumb';


import App from './app';
import { FormInput } from '#components/form-elements/';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

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
      return <p className='form__note'>
               <Translate stringId='loginInvalid' />
             </p>;
    }

    return <p className='form__note'>
             <Translate
               stringId='loginErrorMessage'
               params={{
                 message: error.message,
               }}
             />
           </p>;
  }

  render () {
    const { strings } = this.context;

    if (this.state.authenticated) {
      // TODO: remove
      // This condition is handled by Anonymous route now
      // Hence, is redundant

      const { from } = this.props.location.state || { from: { pathname: '/' } };

      return (
        <Redirect to={from}/>
      );
    }

    return (
      <App className='page--login'>
        <Helmet>
          <title>{strings.loginTitle}</title>
        </Helmet>
        {/* <BreadCrumb crumbs={[
          {link: '/login', name: strings.breadCrumbLogin},
          {link: '/', name: strings.breadCrumbHome}
        ]} /> */}
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <div className='inpage__title--centered'>
                  <h1 className='inpage__title'>
                    <Translate stringId='loginHeader' />
                  </h1>
                </div>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner container-sm'>
              <form className='form' onSubmit={this.onSubmit}>
                <p className='inpage__subheader'>
                  <Translate stringId='loginSubHeader' />
                </p>

                <FormInput
                  label={strings.loginEmailUsername}
                  type='text'
                  name='login-username'
                  id='login-username'
                  value={this.state.data.username}
                  onChange={this.onFieldChange.bind(this, 'username')}
                  autoFocus
                />
                <FormInput
                  label={strings.loginPassword}
                  type='password'
                  name='login-password'
                  id='login-password'
                  value={this.state.data.password}
                  onChange={this.onFieldChange.bind(this, 'password')}
                >
                  {/* TODO: keep me logged in */}
                  <p className='form__help'>
                    <Link to='/recover-account' className='text-underlined' title={strings.loginRecoverTitle}>
                      <span><Translate stringId='loginForgotUserPass' /></span>
                    </Link>
                    {/* <br/>
                    <Link to='/recover-username' title={strings.loginShowUsernameTitle}>
                      <span><Translate stringId='loginForgotUsername' /></span>
                    </Link>
                    <br/>
                    <Link to='/resend-validation' title={strings.loginResendValidationTitle}>
                      <span><Translate stringId='loginResendValidation' /></span>
                    </Link> */}
                  </p>
                </FormInput>
                {this.renderError()}
                <hr/>
                <div className='form__footer text-center'>
                  <button
                    className={c('button button--primary-filled button--small', { disabled: !this.allowSubmit() })}
                    type='submit' onClick={this.onSubmit}
                  >
                    <Translate stringId='loginButton' />
                  </button>
                  <p>
                    <Translate stringId='loginDontHaveAccount' />
                    <Link to='/register' title={strings.loginCreateAccountTitle}>
                      <Translate stringId='loginSignUp' />
                    </Link>
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

Login.contextType = LanguageContext;
export default connect(selector, dispatcher)(Login);

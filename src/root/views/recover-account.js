import React from 'react';
import c from 'classnames';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Helmet } from 'react-helmet';

import { environment } from '#config';

import App from './app';
import { recoverPassword } from '#actions';
import { FormInput, FormError } from '#components/form-elements/';
import { isValidEmail } from '#utils/utils';
import { showAlert } from '#components/system-alerts';
import NewPassword from '#components/connected/new-password';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

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

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.state.hasTokens) { return; }
    if (this.props.password.fetching && !nextProps.password.fetching) {
      hideGlobalLoading();
      if (nextProps.password.error) {
        showAlert('danger', <p><strong>Error:</strong> {nextProps.password.error.error_message}</p>, true, 4500);
      } else {
        showAlert('success', <p>We've sent an email to your inbox. Redirecting...</p>, true, 2000);
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
    const { strings } = this.context;
    return (
      <form className='form form--centered' onSubmit={this.onSubmit}>
        <p className='form__note'>
          <Translate stringId='recoverAccountEmail' />
        </p>
        <FormInput
          label={strings.recoverAccountEmailLabel}
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
        <button className={c('mfa-tick', { disabled: !this.allowSubmit() })} type='button' onClick={this.onSubmit}>
          <span>
            <Translate stringId='recoverAccountSubmitText' />
          </span>
        </button>
      </form>
    );
  }

  render () {
    const { strings } = this.context;
    return (
      <App className='page--login'>
        <Helmet>
          <title>
            {strings.recoverAccountTitle}
          </title>
        </Helmet>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>
                  <Translate stringId='recoverAccountHeading' />
                </h1>
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

RecoverAccount.contextType = LanguageContext;
export default connect(selector, dispatcher)(RecoverAccount);

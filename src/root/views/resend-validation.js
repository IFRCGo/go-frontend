import React from 'react';
import c from 'classnames';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Helmet } from 'react-helmet';

import { environment } from '#config';

import App from './app';
import { resendValidation } from '#actions';
import { FormInput, FormError } from '#components/form-elements/';
import { showAlert } from '#components/system-alerts';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

class ResendValidation extends React.Component {
  constructor (props) {
    super(props);
    const { params } = this.props.match;
    const hasTokens = params.username && params.token;
    this.state = {
      data: {
        username: ''
      },
      errors: null,
      hasTokens
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.state.hasTokens) { return; }
    hideGlobalLoading();
    if (nextProps.resendValidation.fetched) {
      if (nextProps.resendValidation.error) {   
        showAlert('danger', <p><Translate stringId="resendValidationErrorMessage" params={{message: nextProps.resendValidation.error.error_message}} /></p>, true, 7000);
      } else {
        showAlert('success', <p><Translate stringId="resendValidationSuccessMessage" /></p>, true, 2000);
        setTimeout(() => this.props.history.push('/login'), 2000);
      }
    }
  }

  onSubmit (e) {
    e.preventDefault();
    const errors = this.state.data.username
      ? null
      : [{ dataPath: '.username', message: 'Please provide your username' }];
    this.setState({ errors });
    if (errors === null) {
      showGlobalLoading();
      this.props._resendValidation(this.state.data.username);
    }
  }

  onFieldChange (field, e) {
    let data = Object.assign({}, this.state.data, {[field]: e.target.value});
    this.setState({data});
  }

  renderUsernameForm () {
    const { strings } = this.context;
    return (
      <form className='form form--centered' onSubmit={this.onSubmit}>
        <p className='form__note'>
          <Translate stringId='resendValidationUsername' />
        </p>
        <FormInput
          label={strings.loginEmailUsername}
          type='text'
          name='username'
          id='username'
          value={this.state.data.username}
          onChange={this.onFieldChange.bind(this, 'username')}
          autoFocus
        >
          <FormError
            errors={this.state.errors}
            property='username'
          />
        </FormInput>
        <button className={c('mfa-tick', { disabled: !this.state.data.username })} type='button' onClick={this.onSubmit}>
          <span>
            <Translate stringId='resendValidationSubmitText' />
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
            {strings.resendValidationTitle}
          </title>
        </Helmet>
        <section className='inpage container-lg'>
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
              {this.state.hasTokens ? null : this.renderUsernameForm()}
            </div>
          </div>
        </section>
      </App>
    );
  }
}

if (environment !== 'production') {
  ResendValidation.propTypes = {
    history: T.object,
    match: T.object,
    resendValidation: T.object,
    _resendValidation: T.func
  };
}
const selector = (state) => ({
  username: state.username,
  resendValidation: state.resendValidation
});

const dispatcher = (dispatch) => ({
  _resendValidation: (username) => dispatch(resendValidation(username))
});

ResendValidation.contextType = LanguageContext;
export default connect(selector, dispatcher)(ResendValidation);

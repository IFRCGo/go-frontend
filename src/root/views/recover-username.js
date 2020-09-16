import React from 'react';
import c from 'classnames';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Helmet } from 'react-helmet';

import { environment } from '#config';

import App from './app';
import { showUsername } from '#actions';
import { FormInput, FormError } from '#components/form-elements/';
import { isValidEmail } from '#utils/utils';
import { showAlert } from '#components/system-alerts';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

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
      showAlert('success', <p><Translate stringId="recoverUsernameSuccessMessage" /></p>, true, 3000);
      setTimeout(() => this.props.history.push('/login'), 3000);
    }
  }

  onSubmit (e) {
    const { strings } = this.context;

    e.preventDefault();
    const errors = isValidEmail(this.state.data.email) ? null
      : [{ dataPath: '.email', message: strings.recoverUsernameInvalidEmailMessage }];
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
    const { strings } = this.context;
    return (
      <form className='form form--centered' onSubmit={this.onSubmit}>
        <p className='form__note'>
          <Translate stringId='recoverUsernameEmail' />
        </p>
        <FormInput
          label={strings.recoverUsernameEmailLabel}
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
            <Translate stringId='recoverUsernameSubmitText' />
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
            {strings.recoverUsernameTitle}
          </title>
        </Helmet>
        <section className='inpage container-lg'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>
                  <Translate stringId='recoverUsernameHeading' />
                </h1>
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

RecoverUsername.contextType = LanguageContext;
export default connect(selector, dispatcher)(RecoverUsername);

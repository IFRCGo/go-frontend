'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { withRouter } from 'react-router-dom';
import _set from 'lodash.set';
import _cloneDeep from 'lodash.clonedeep';
import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';

import { environment } from '../config';

import { validateAndUpdatePassword } from '../actions';
import { get } from '../utils/utils';
import schemaDef from '../schemas/new-password';
import { FormInput, FormError } from '../components/form-elements/';
import { showAlert } from '../components/system-alerts';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';

const ajv = new Ajv({ $data: true, allErrors: true, errorDataPath: 'property' });
ajvKeywords(ajv);
const validator = ajv.compile(schemaDef);

const getClassIfError = (errors, prop) => {
  if (!errors) return '';
  let err = errors.find(o => o.dataPath === `.${prop}`);
  return err ? 'form__control--danger' : '';
};

class NewPassword extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      data: {
        oldPassword: undefined,
        password: undefined,
        passwordConfirm: undefined
      },
      errors: null
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps (nextProps) {
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

  onSubmit () {
    const { data } = this.state;
    validator(data);
    const errors = _cloneDeep(validator.errors);

    // Selectively apply validation based on whether
    // we are verifying an existing password, as opposed
    // to resetting a password.
    const { verifyOldPassword } = this.props;
    if (verifyOldPassword && !data.oldPassword) {
      errors.push({
        dataPath: '.oldPassword',
        keyword: 'required'
      });
    }

    this.setState({ errors });
    if (errors !== null) { return; }

    showGlobalLoading();
    let payload = {};
    if (verifyOldPassword) {
      payload.username = get(this.props, 'user.data.username');
      payload.password = data.oldPassword;
    } else {
      // TODO read reset token and username from url path?
    }
    payload['new_password'] = data.password;
    this.props._validateAndUpdatePassword(payload);
  }

  onFieldChange (field, e) {
    let data = _cloneDeep(this.state.data);
    let val = e.target ? e.target.value : e;
    _set(data, field, val === '' || val === null ? undefined : val);
    this.setState({data});
  }

  renderPasswordField (label, id) {
    return (
      <FormInput
        label={label}
        type='password'
        name={`newpassword-${id}`}
        id={`newpassword-${id}`}
        classInput={getClassIfError(this.state.errors, id)}
        value={this.state.data[id]}
        onChange={this.onFieldChange.bind(this, id)}
      >
        <FormError
          errors={this.state.errors}
          property={id}
        />
      </FormInput>
    );
  }

  render () {
    const { verifyOldPassword } = this.props;
    return (
      <section className='fold'>
        <div className='inner'>
          {verifyOldPassword && this.renderPasswordField('Verify old password', 'oldPassword')}
          {this.renderPasswordField('New password', 'password')}
          {this.renderPasswordField('Confirm new password', 'passwordConfirm')}
          <button className='mfa-tick' type='button' onClick={this.onSubmit}><span>Submit</span></button>
        </div>
      </section>
    );
  }
}

if (environment !== 'production') {
  NewPassword.propTypes = {
    user: T.object,
    password: T.object,
    history: T.object,
    verifyOldPassword: T.Bool,
    _validateAndUpdatePassword: T.func
  };
}

const selector = (state) => ({
  user: state.user,
  password: state.password
});

const dispatcher = (dispatch) => ({
  _validateAndUpdatePassword: (payload) => dispatch(validateAndUpdatePassword(payload))
});

export default withRouter(connect(selector, dispatcher)(NewPassword));

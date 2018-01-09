'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import _set from 'lodash.set';
import _cloneDeep from 'lodash.clonedeep';
import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';

import { environment } from '../config';

import { FormInput, FormError } from '../components/form-elements/';
import schemaDef from '../schemas/new-password';

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

  onSubmit () {
    const payload = this.state.data;
    validator(payload);
    const errors = _cloneDeep(validator.errors);

    const { verifyOldPassword } = this.props;
    if (verifyOldPassword && !this.state.data.oldPassword) {
      errors.push({
        dataPath: '.oldPassword',
        keyword: 'required',
      });
    }

    this.setState({ errors });
    if (errors !== null) {
      return;
    }
      // showGlobalLoading();
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
  PasswordChange.propTypes = {
    user: T.object,
    verifyOldPassword: T.Bool
  }
}

export default NewPassword;

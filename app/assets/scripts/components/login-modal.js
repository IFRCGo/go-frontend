'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';

import { environment } from '../config';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './modal';

class LoginModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      data: {
        email: '',
        password: ''
      }
    };

    this.onClose = this.onClose.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onClose () {
    // this.props.resetForm();
    // this.setState(this.getInitialState());
    this.props.onCloseClick();
  }

  onSubmit () {
  }

  onFieldChange (field, e) {
    let data = Object.assign({}, this.state.data, {[field]: e.target.value});
    this.setState({data});
  }

  allowSubmit () {
    // Do proper validation.
    return this.state.data.email && this.state.data.password;
  }

  render () {
    return (
      <Modal
        id='modal-login'
        className='modal--small'
        onCloseClick={this.onClose.bind(this)}
        revealed={this.props.revealed} >

        <ModalHeader>
          <div className='modal__headline'>
            <h1 className='modal__title'>Login</h1>
          </div>
        </ModalHeader>
        <ModalBody>
          <form className='form' onSubmit={this.onSubmit}>
            <div className='form__group'>
              <label className='form__label' htmlFor='login-email'>Email</label>
              <input
                type='text'
                id='login-email'
                name='login-email'
                className='form__control form__control--medium'
                value={this.state.data.email}
                onChange={this.onFieldChange.bind(this, 'email')}
                autoFocus
              />
            </div>
            <div className='form__group'>
              <label className='form__label' htmlFor='login-password'>Password</label>
              <input
                type='password'
                id='login-password'
                name='login-password'
                className='form__control form__control--medium'
                value={this.state.data.password}
                onChange={this.onFieldChange.bind(this, 'password')}
              />
              <p className='form__help'>
                <Link to='/' title='Recover password'><span>I forgot my password.</span></Link>
              </p>
            </div>

          </form>
        </ModalBody>
        <ModalFooter>
          <button className='mfa-tick' type='button' onClick={this.onClose}><span>Login</span></button>
          <p>
            Don’t have an account? <Link to='/' title='Create new account'><span>Sign Up.</span></Link>
          </p>
        </ModalFooter>
      </Modal>
    );
  }
}

if (environment !== 'production') {
  LoginModal.propTypes = {
    revealed: T.bool,
    onCloseClick: T.func
  };
}

export default LoginModal;

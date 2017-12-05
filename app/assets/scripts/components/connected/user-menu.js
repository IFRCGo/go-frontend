'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

import { environment } from '../../config';
import { logoutUser } from '../../actions';

import Dropdown from '../dropdown';

class UserMenu extends React.Component {
  onLogoutClick (e) {
    e.preventDefault();
    this.props._logoutUser();
    this.props.history.push('/');
  }

  render () {
    if (this.props.userData.username) {
      return (
        <Dropdown
          id='user-menu'
          triggerClassName='drop__togle--user'
          triggerActiveClassName='active'
          triggerText={'User menu'}
          triggerTitle={'Access user menu'}
          triggerElement='a'
          direction='down'
          alignment='center' >

          <h6 className='drop__title'>Hello {this.props.userData.firstName} {this.props.userData.lastName}</h6>
          <ul className='drop__menu' role='menu'>
            <li><Link to='/account' title='View user account' className='drop__menu-item' data-hook='dropdown:close'>Account</Link></li>
            <li><a href='#' title='Logout' className='drop__menu-item' data-hook='dropdown:close' onClick={this.onLogoutClick.bind(this)}>Logout</a></li>
          </ul>
        </Dropdown>
      );
    }

    return [
      <Link key='login' to='/login' className='button button--small button--primary-raised-light' title='Login'><span>Login</span></Link>,
      <Link key='register' to='/register' className='button button--small button--primary-raised-light' title='Register'><span>Register</span></Link>
    ];
  }
}

if (environment !== 'production') {
  UserMenu.propTypes = {
    _logoutUser: T.func,
    history: T.object,
    userData: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  userData: state.user.data
});

const dispatcher = (dispatch) => ({
  _logoutUser: (...args) => dispatch(logoutUser(...args))
});

export default withRouter(connect(selector, dispatcher)(UserMenu));

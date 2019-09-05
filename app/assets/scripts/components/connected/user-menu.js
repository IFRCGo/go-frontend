'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { environment } from '../../config';
import { logoutUser } from '../../actions';
import Dropdown from '../dropdown';

class UserMenu extends React.Component {
  constructor () {
    super();
    this.state = {
      width: window.innerWidth
    };
  }

  // Adds a listener for window size to determine style for menu content
  componentWillMount () {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  // Ensures the listener is removed when the component is no longer mounted
  componentWillUnmount () {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  // Updates window width change
  handleWindowSizeChange () {
    this.setState({ width: window.innerWidth });
  }

  onLogoutClick (e) {
    e.preventDefault();
    this.props._logoutUser();
    window.location.reload();
  }

  render () {
    const { width } = this.state;
    const isMobile = width <= 767;

    // Displays dropdown menu on non-mobile screens and a single logout button for the mobile menu
    if (this.props.userData.username && !isMobile) {
      return (
        <Dropdown
          id='user-menu'
          triggerClassName='drop__toggle drop__toggle--caret page__meta-nav-elements-borderless'
          triggerActiveClassName='active'
          triggerText={this.props.userData.firstName + ' ' + this.props.userData.lastName}
          triggerTitle={'Access user menu'}
          triggerElement='a'
          direction='down'
          alignment='right' >

          <h6 className='drop__title'>Hello {this.props.userData.firstName} {this.props.userData.lastName}</h6>
          <ul className='drop__menu' role='menu'>
            <li><Link to='/account' title='View user account' className='drop__menu-item' data-hook='dropdown:close'>Account</Link></li>
            <li><a href='#' title='Logout' className='drop__menu-item' data-hook='dropdown:close' onClick={this.onLogoutClick.bind(this)}>Logout</a></li>
          </ul>
        </Dropdown>
      );
    } else if (this.props.userData.username && isMobile) {
      return (
        <ul className='drop__menu' role='menu'>
          <li><a href='#' title='Logout' className='drop__menu-item' data-hook='dropdown:close' onClick={this.onLogoutClick.bind(this)}>Logout</a></li>
        </ul>
      );
    }

    return [
      <Link key='login' to={{pathname: '/login', state: {from: this.props.location}}} title='Login' className='page__meta-nav-elements'><span>Login</span></Link>,
      <Link key='register' to='/register' title='Register' className='page__meta-nav-elements-borderless'><span>Register</span></Link>
    ];
  }
}

if (environment !== 'production') {
  UserMenu.propTypes = {
    _logoutUser: T.func,
    history: T.object,
    userData: T.object,
    location: T.object
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

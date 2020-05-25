
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { isMobileOnly } from 'react-device-detect';
import { environment } from '#root/config';
import { logoutUser } from '#actions';
import Dropdown from '#components/common/dropdown';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

class UserMenu extends React.Component {
  onLogoutClick (e) {
    e.preventDefault();
    this.props._logoutUser();
    window.location.reload();
  }

  render () {
    // Displays dropdown menu on non-mobile screens and a single logout button for the mobile menu
    const { strings } = this.context;
    if (this.props.userData.username && !isMobileOnly) {
      return (
        <Dropdown
          id='user-menu'
          triggerClassName='drop__toggle drop__toggle--caret page__meta-nav-elements-borderless'
          triggerActiveClassName='active'
          triggerText={this.props.userData.firstName + ' ' + this.props.userData.lastName}
          triggerTitle={strings.userMenuAccess}
          triggerElement='a'
          direction='down'
          alignment='right' >

          <h6 className='drop__title'>Hello {this.props.userData.firstName} {this.props.userData.lastName}</h6>
          <ul className='drop__menu' role='menu'>
            <li><Link to='/account' title={strings.userMenuViewAccount} className='drop__menu-item' data-hook='dropdown:close'><Translate stringId='userMenuAccount'/></Link></li>
            <li><a href='#' title={strings.userMenuLogout} className='drop__menu-item' data-hook='dropdown:close' onClick={this.onLogoutClick.bind(this)}><Translate stringId='userMenuLogout'/></a></li>
          </ul>
        </Dropdown>
      );
    } else if (this.props.userData.username && isMobileOnly) {
      return (
        <ul className='drop__menu' role='menu'>
          <li><a href='#' title={strings.userMenuLogout} className='drop__menu-item' data-hook='dropdown:close' onClick={this.onLogoutClick.bind(this)}><Translate stringId='userMenuLogout'/></a></li>
        </ul>
      );
    }

    return [
      <Link key='login' to={{pathname: '/login', state: {from: this.props.location}}} title={strings.userMenuLogin} className='page__meta-nav-elements'><span><Translate stringId='userMenuLogin'/></span></Link>,
      <Link key='register' to='/register' title={strings.userMenuRegister} className='page__meta-nav-elements-borderless'><span><Translate stringId='userMenuRegister'/></span></Link>
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
UserMenu.contextType = LanguageContext;

export default withRouter(connect(selector, dispatcher)(UserMenu));

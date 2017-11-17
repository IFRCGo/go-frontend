'use strict';
import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  render () {
    return (
      <header className='page__header' role='banner'>
        <div className='inner'>
          <div className='page__headline'>
            <Link to='/' title='Visit page'><h1 className='page__title'>IFRC GO</h1></Link>
          </div>
          <nav className='page__prime-nav' role='navigation'>
            <ul className='nav-global-menu'>
              <li><Link to='/operations' title='Visit operations page'><span>Operations</span></Link></li>
              <li><Link to='/deployments' title='Visit deployments page'><span>Deployments</span></Link></li>
              <li><Link to='/field-reports' title='Visit field reports page'><span>Field Reports</span></Link></li>
              <li><Link to='/login' title='Login'><span>Login</span></Link></li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }
}

export default Header;

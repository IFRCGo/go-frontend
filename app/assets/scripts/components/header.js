'use strict';
import React from 'react';
import { Link } from 'react-router-dom';

import UserMenu from './connected/user-menu';

class Header extends React.Component {
  render () {
    return (
      <header className='page__header' role='banner'>
        <div className='inner'>
          <div className='page__headline'>
            <h1 className='page__title'>
              <Link to='/' title='Visit page'>
                <img src='/assets/graphics/layout/logo.png' alt='IFRC GO logo'/>
                <span>IFRC GO</span>
              </Link>
            </h1>
          </div>
          <nav className='page__meta-nav' role='navigation'>
            <Link to='/reports/new' className='button button--primary' title='Create Field Report'><span>Create Field Report</span></Link>
            <UserMenu />
          </nav>
        </div>
        <div className='inner'>
          <nav className='page__prime-nav' role='navigation'>
            <ul className='nav-global-menu'>
              <li><Link to='/operations' title='Visit operations page'><span>Operations</span></Link></li>
              <li><Link to='/deployments' title='Visit deployments page'><span>Deployments</span></Link></li>
              <li><Link to='/field-reports' title='Visit field reports page'><span>Field Reports</span></Link></li>
              <li><Link to='/about' title='Visit about page'><span>About</span></Link></li>
            </ul>
            <div className='nav-global-search'>
              <form className='gsearch'>
                <div className='form__group'>
                  <label className='form__label' htmlFor='site-search'>Search</label>
                  <input
                    type='text'
                    id='site-search'
                    name='site-search'
                    placeholder="Try 'Vietnam Typhoon'"
                    className='form__control'
                  />
                </div>
                <button type='submit' className='gsearch__button'><span>Search</span></button>
              </form>
            </div>
          </nav>
        </div>
      </header>
    );
  }
}

export default Header;

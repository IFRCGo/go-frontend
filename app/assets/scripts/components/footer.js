'use strict';
import React from 'react';
import { Link } from 'react-router-dom';

import { regions } from '../utils/region-constants';
import { objValues } from '../utils/utils';
import { api } from '../config';

class Footer extends React.PureComponent {
  render () {
    return (
      <footer className='page__footer' role='contentinfo'>
        <div className='inner'>
          <nav className='footer-nav' role='navigation'>
            <div className='footer-nav__block'>
              <ul className='footer-menu'>
                <li className='footer-menu__item--highlight'><Link to='/emergencies' title='View Emergencies'>Emergencies</Link></li>
              </ul>
            </div>
            <div className='footer-nav__block'>
              <ul className='footer-menu'>
                <li className='footer-menu__item--highlight'>Regions</li>
                {objValues(regions).map(o => (
                  <li key={o.id}><Link to={`/regions/${o.id}`} title='View Region'>{o.name} Region</Link></li>
                ))}
              </ul>
            </div>
            <div className='footer-nav__block'>
              <ul className='footer-menu'>
                <li className='footer-menu__item--highlight'><Link to='/reports/new' title='Create Field Report'>Create Field Report</Link></li>
              </ul>
            </div>
            <div className='footer-nav__block'>
              <ul className='footer-menu'>
                <li className='footer-menu__item--highlight'><Link to='/deployments' title='Deployments'>Deployments</Link></li>
              </ul>
            </div>
            <div className='footer-nav__block'>
              <ul className='footer-menu'>
                <li className='footer-menu__item--highlight'><Link to='/about' title='About'>About</Link></li>
              </ul>
            </div>
            <div className='footer-nav__block footer-nav__block--sec'>
              <ul className='footer-menu'>
                <li><a href='https://github.com/ifrcgo/go-frontend' title='Open Source Code'>Open Source Code</a></li>
                <li><a href={`${api}docs`} title='API Documentation'>API Documentation</a></li>
              </ul>
            </div>
          </nav>
          <div className='footer-credits'>
            <p>© IFRC 2018</p>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;

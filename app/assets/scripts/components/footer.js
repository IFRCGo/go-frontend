'use strict';
import React from 'react';
import { Link } from 'react-router-dom';

import { regions } from '../utils/region-constants';
import { objValues } from '../utils/utils';

class Footer extends React.PureComponent {
  render () {
    return (
      <footer className='page__footer' role='contentinfo'>
        <div className='inner'>
          <nav className='footer-nav' role='navigation'>
            <div className='footer-nav__block'>
              <ul className='footer-menu'>
                <li className='footer-menu__item--highlight'><Link to='/' title='View Emergencies'>Emergencies</Link></li>
              </ul>
            </div>
            <div className='footer-nav__block'>
              <ul className='footer-menu'>
                <li className='footer-menu__item--highlight'><Link to='/' title='View Regions'>Regions</Link></li>
                {objValues(regions).map(o => (
                  <li key={o.id}><Link to={`/regions/${o.id}`} title='View Region'>{o.name} Region</Link></li>
                ))}
              </ul>
            </div>
            <div className='footer-nav__block'>
              <ul className='footer-menu'>
                <li className='footer-menu__item--highlight'><Link to='/report/new' title='Create Field Report'>Create Field Report</Link></li>
              </ul>
            </div>
            <div className='footer-nav__block'>
              <ul className='footer-menu'>
                <li className='footer-menu__item--highlight'><Link to='/' title='Deployments'>Deployments</Link></li>
                <li><Link to='/' title='HeOps'>HeOps</Link></li>
              </ul>
            </div>
            <div className='footer-nav__block'>
              <ul className='footer-menu'>
                <li className='footer-menu__item--highlight'><Link to='/' title='About'>About</Link></li>
                <li><Link to='/' title='Resources'>Resources</Link></li>
              </ul>
            </div>
            <div className='footer-nav__block footer-nav__block--sec'>
              <ul className='footer-menu'>
                <li><a href='#' title='Open Source Code'>Open Source Code</a></li>
                <li><a href='#' title='API Documentation'>API Documentation</a></li>
              </ul>
            </div>
          </nav>
          <div className='footer-credits'>
            <p>© IFRC 2017</p>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;

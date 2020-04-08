'use strict';

import React from 'react';
import { api } from '../config';

class Footer extends React.PureComponent {
  render () {
    const stagingBanner = process.env.NODE_ENV !== 'production'
      ? (
        <div className='sticky-banner staging-footer'>
          {process.env.NODE_ENV === 'staging' ? 'STAGING' : 'TESTING (SURGE)'} SITE
        </div>
      )
      : null;
    return (
      <footer className='page__footer' role='contentinfo'>
        <div className='inner'>
          <div className='footer-menu'>
            <div className="footer-left-block">
              <a href='https://github.com/ifrcgo/go-frontend' title='Open Source Code'>Open Source Code</a>
              <a href={`${api}docs`} title='API Documentation'>API Documentation</a>
              <a href='mailto:im@ifrc.org'>Contact Us</a>
            </div>

            <div className="footer-right-block">
              © IFRC 2019
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;

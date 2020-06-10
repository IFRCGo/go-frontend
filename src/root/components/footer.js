
import React from 'react';
import { api } from '#config';

class Footer extends React.PureComponent {
  render () {
    const { NODE_ENV: currentEnv } = process.env;
    const stagingBanner = currentEnv !== 'production' && currentEnv !== 'development'
      ? (
        <div className='sticky-banner staging-footer'>
          {process.env.NODE_ENV === 'staging' ? 'STAGING' : 'TESTING (SURGE)'} SITE
        </div>
      )
      : null;
    return (
      <React.Fragment>
        <footer className='page__footer' role='contentinfo'>
          <div className='inner'>
            <div className='footer-menu'>
              <div className="footer-left-block">
                <a href='https://github.com/ifrcgo/go-frontend' title='Open Source Code'>Open Source Code</a>
                <a href={`${process.env.NODE_ENV === 'production' ? 'https://goadmin.ifrc.org/' : api}docs`} title='API Documentation'>API Documentation</a>
                <a href='mailto:im@ifrc.org'>Contact Us</a>
              </div>

              <div className="footer-right-block">
              © IFRC 2020
              </div>
            </div>
          </div>
        </footer>

        {stagingBanner}
      </React.Fragment>
    );
  }
}

export default Footer;

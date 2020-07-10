
import React from 'react';
import { api } from '#config';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

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
    const { strings } = this.context;
    return (
      <React.Fragment>
        <footer className='page__footer' role='contentinfo'>
          <div className='inner'>
            <div className='footer-menu g-row flex-xs'>
              <div className="footer-left-block col col-7-xs">
                <a href='https://github.com/ifrcgo/go-frontend' title={strings.footerOpenSourceCode}><Translate stringId='footerOpenSourceCode'/></a>
                <a href={`${process.env.NODE_ENV === 'production' ? 'https://goadmin.ifrc.org/' : api}docs`} title={strings.footerApiDocumentation}>
                  <Translate stringId='footerApiDocumentation'/>
                </a>
                <a href='mailto:im@ifrc.org'>
                  <Translate stringId='footerContactUs'/>
                </a>
              </div>

              <div className="footer-right-block col col-5-xs">
                <Translate stringId='footerIFRC'/>
              </div>
            </div>
          </div>
        </footer>

        {stagingBanner}
      </React.Fragment>
    );
  }
}
Footer.contextType = LanguageContext;
export default Footer;

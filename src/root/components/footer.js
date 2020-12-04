
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
          <div className='container-lg'>
            <div className='footer-menu row flex-xs'>
              <div className="col col-6-xs col-3-mid">
                <div className='footer-section-heading'>About Go</div>
                <div className='base-font-medium'>
                  IFRC GO is a Red Cross Red Crescent platform to connect information on emergency needs with the right response.
                </div>
                 <div className='footer-copyright'><Translate stringId='footerIFRC'/></div>
              </div>

              <div className="col col-6-xs col-3-mid">
                <div className='footer-section-heading'>Find out more</div>
                <a href='https://ifrc.org' className='footer-section-link'>ifrc.org</a>
                <a href='https://rcrcsims.org' className='footer-section-link'>rcrcsims.org</a>
                <a href='https://data.ifrc.org' className='footer-section-link'>dataifrc.org</a>
              </div>

              <div className="col col-6-xs col-3-mid">
                <div className='footer-section-heading'>Helpful links</div>
                <div className='footer-section-link'><a href='https://github.com/ifrcgo/go-frontend' title={strings.footerOpenSourceCode}><Translate stringId='footerOpenSourceCode'/></a></div>
                <a href={`${process.env.NODE_ENV === 'production' ? 'https://goadmin.ifrc.org/' : api}docs`} title={strings.footerApiDocumentation} className='footer-section-link'>
                  <Translate stringId='footerApiDocumentation'/>
                </a>
                <a href='mailto:im@ifrc.org' className='footer-section-link'>
                  <Translate stringId='footerContactUs'/>
                </a>
              </div>

              <div className="col col-6-xs col-3-mid">
                <div className='footer-section-heading'>Contact us</div>
                <a href='mailto:im@ifrc.org' className='button button--primary-filled button--small'>im@ifrc.org</a>
                <div className='footer-social-block'>
                  <a href='https://ifrcgoproject.medium.com' className='footer-social-each'></a>
                  <a href='https://www.facebook.com/IFRC' className='footer-social-each'>
                    <span className='f-icon-facebook'></span>
                  </a>
                  <a href='https://twitter.com/ifrcgo' className='footer-social-each'>
                    <span className='f-icon-twitter'></span>
                  </a>
                  <a href='https://www.youtube.com/watch?v=dwPsQzla9A4' className='footer-social-each'></a>
                </div>
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

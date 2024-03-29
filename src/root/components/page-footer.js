import React from 'react';
import { api } from '#config';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';
import EnvironmentBanner from '#components/EnvironmentBanner';
import { APP_VERSION, GIT_HASH } from '#utils/constants';

class Footer extends React.PureComponent {
  render () {
    const { strings } = this.context;
    const date = new Date();
    const year = date.getFullYear();
    return (
      <React.Fragment>
        <footer className='page__footer' role='contentinfo'>
          <div className='container-lg'>
            <div className='footer-menu row flex-xs'>
              <div className="col col-6-xs col-3-mid">
                <div className='footer-section-heading'><Translate stringId='footerAboutGo'/></div>
                <div className='base-font-medium'>
                  <Translate stringId='footerAboutGoDesc'/>
                </div>
                 <div className='footer-copyright footer-copyright--lg'><Translate stringId='footerIFRC'/> {year} <span title={GIT_HASH}>{APP_VERSION}</span></div>
              </div>

              <div className="col col-6-xs col-3-mid">
                <div className='footer-section-heading'><Translate stringId='footerFindOutMore'/></div>
                <a href='https://ifrc.org' className='footer-section-link' target='_blank'>ifrc.org</a>
                <a href='https://rcrcsims.org' className='footer-section-link' target='_blank'>rcrcsims.org</a>
                <a href='https://data.ifrc.org' className='footer-section-link' target='_blank'>data.ifrc.org</a>
              </div>

              <div className="col col-6-xs col-3-mid">
                <div className='footer-section-heading'><Translate stringId='footerHelpfulLinks'/></div>
                <div className='footer-section-link'><a href='https://github.com/ifrcgo/go-frontend' title={strings.footerOpenSourceCode} target='_blank'><Translate stringId='footerOpenSourceCode'/></a></div>
                <a href={`${api}docs`} title={strings.footerApiDocumentation} className='footer-section-link' target='_blank'>
                  <Translate stringId='footerApiDocumentation'/>
                </a>
                <a href='/about' className='footer-section-link'>
                  <Translate stringId='footerOtherResources'/>
                </a>
              </div>

              <div className="col col-6-xs col-3-mid">
                <div className='footer-section-heading'><Translate stringId='footerContactUs'/></div>
                <a href='mailto:im@ifrc.org' className='button button--primary-filled button--small button-footer-contact'>im@ifrc.org</a>
                <div className='footer-social-block'>
                  <a href='https://ifrcgoproject.medium.com' className='footer-social-each' target='_blank'>
                    <span className='f-icon-medium footer-social-icon'></span>
                  </a>
                  <a href='https://www.facebook.com/IFRC' className='footer-social-each' target='_blank'>
                    <span className='f-icon-facebook footer-social-icon'></span>
                  </a>
                  <a href='https://twitter.com/ifrcgo' className='footer-social-each' target='_blank'>
                    <span className='f-icon-twitter footer-social-icon'></span>
                  </a>
                  <a href='https://www.youtube.com/watch?v=dwPsQzla9A4' className='footer-social-each' target='_blank'>
                    <span className='f-icon-youtube footer-social-icon'></span>
                  </a>
                </div>
                <div className='footer-copyright footer-copyright--sm'><Translate stringId='footerIFRC'/> {year} <span title={GIT_HASH}>{APP_VERSION}</span></div>
              </div>
            </div>
          </div>
        </footer>
        <EnvironmentBanner />
      </React.Fragment>
    );
  }
}
Footer.contextType = LanguageContext;
export default Footer;

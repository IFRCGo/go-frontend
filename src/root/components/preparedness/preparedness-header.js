
import React from 'react';
import Fold from './../fold';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';
import ContactPer from '#components/preparedness/contact-per';

class PreparednessHeader extends React.Component {
  render () {
    const { strings }  = this.context;
    return (
      <div className='inner'>
        <Fold title={strings.preparednessHeaderTitle} foldTitleClass='margin-reset' foldWrapperClass='fold--main'>
          <div className='container-full'>
            <div className='key-emergencies-list-wrap row flex-xs'>
              <ul className='key-emergencies-list key-emergencies-list--preparedness col col-6-xs'>
                <Translate
                  stringId='preparednessHeaderDetail'
                  params={{
                    link: <a
                      className='link key-emergencies-list--preparedness'
                      href='https://media.ifrc.org/ifrc/what-we-do-disaster-and-crisis-national-society-preparedness-effective-response/'
                      >
                        here
                      </a>
                  }}
                />
                <ContactPer />
              </ul>
              <div className='key-emergencies-list-image col col-6-xs'>
                <img src="/assets/graphics/content/per_approach_notext.png" alt="IFRC GO logo" width='330' />
              </div>
            </div>
          </div>
        </Fold>
      </div>);
  }
}

PreparednessHeader.contextType = LanguageContext;
export default PreparednessHeader;

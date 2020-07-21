
import React from 'react';
import Fold from './../fold';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

class PreparednessHeader extends React.Component {
  render () {
    const { strings }  = this.context;
    return (
      <div className='inner'>
        <Fold title={strings.preparednessHeaderTitle} foldTitleClass='margin-reset' foldWrapperClass='fold--main'>
          <div className='container-full'>
            <div className='key-emergencies-list-wrap row flex-xs'>
              <ul className='key-emergencies-list key-emergencies-list--preparedness col col-8-xs'>
                <Translate stringId='preparednessHeaderDetail'/>
              </ul>
              <div className='key-emergencies-list-image col col-4-xs'>
                <img src="/assets/graphics/content/per.jpg" alt="IFRC GO logo" width='220' />
              </div>
            </div>
          </div>
        </Fold>
      </div>);
  }
}

PreparednessHeader.contextType = LanguageContext;
export default PreparednessHeader;


import React from 'react';
import Fold from './../fold';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

class PreparednessHeader extends React.Component {
  render () {
    const { strings }  = this.context;
    return (
      <div className='inner'>
        <Fold title={strings.preparednessHeaderTitle} foldClass='margin-reset' extraClass='fold--main'>
          <div className='key-emergencies-list-wrap clearfix'>
            <ul className='key-emergencies-list key-emergencies-list--preparedness'>
              <Translate stringId='preparednessHeaderDetail'/>
            </ul>
            <div className='key-emergencies-list-image clearfix'>
              <img src="/assets/graphics/content/per.jpg" alt="IFRC GO logo" width='220' />
            </div>
          </div>
        </Fold>
      </div>);
  }
}

PreparednessHeader.contextType = LanguageContext;
export default PreparednessHeader;


import React from 'react';
import Fold from './../fold';

class PreparednessHeader extends React.Component {
  render () {
    return (
      <div className='inner'>
        <Fold title={'The PER process'} foldClass='margin-reset' extraClass='fold--main'>
          <div className='key-emergencies-list-wrap clearfix'>
            <ul className='key-emergencies-list key-emergencies-list--preparedness'>
              PER follows a cyclical process for a National Society to systematically assess, measure and analyse
              the strength and gaps of its response system to construct a work-plan that, when implemented, will
              strengthen It&apos;s overall response capacity.
            </ul>
            <div className='key-emergencies-list-image clearfix'>
              <img src="/assets/graphics/content/per.jpg" alt="IFRC GO logo" width='220' />
            </div>
          </div>
        </Fold>
      </div>);
  }
}

export default PreparednessHeader;

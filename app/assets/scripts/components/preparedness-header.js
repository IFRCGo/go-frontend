'use strict';
import React from 'react';
import Fold from './fold';

class PreparednessHeader extends React.Component {
  render () {
    return (
      <div className='inner'>
        <Fold title={'The PER process'}>
          <ul className='key-emergencies-list'>
            PER follows a cyclical process for a National Society to systematically assess, measure and analyse
            the strength and gaps of its response system to construct a work-plan that, when implemented, will
            strengthen It`s overall response capacity.

            <img src="/assets/graphics/content/per.jpg" alt="IFRC GO logo" style={{width: '250px', height: '250px', float: 'right'}} />
          </ul>
        </Fold>
      </div>);
  }
}

export default PreparednessHeader;

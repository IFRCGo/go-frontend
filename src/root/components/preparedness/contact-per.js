import React from 'react';
import Translate from '#components/Translate';

export default class ContactPer extends React.Component {
  render () {
    return (
      <div className='inner spacing-t' style={{textAlign: 'center'}}>
        <a href='mailto:PER.Team@ifrc.org' className='button button--primary-filled global-margin-t'>
          <Translate stringId='contactPerTitle'/>
        </a>
        <div className='container-xs spacing-t'>
          <p>
            <Translate stringId='contactPerDetails'/>
          </p>
        </div>
      </div>
    );
  }
}


import React from 'react';
import Translate from '#components/Translate';

export default class ContactPer extends React.Component {
  render () {
    return (
      <div className='inner' style={{textAlign: 'center'}}>
        <a href='mailto:PER.Team@ifrc.org' className='button button--medium button--primary-filled global-margin-t'>
          <Translate stringId='contactPerTitle'/>
        </a>
        <p style={{marginTop: '10px'}}>
          <Translate stringId='contactPerDetails'/>
        </p>
      </div>
    );
  }
}
